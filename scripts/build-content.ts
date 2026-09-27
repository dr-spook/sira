// npm run content            : génère src/content/puzzles.json et public/content/img/*.webp
// npm run content -- --check : vérifie content-source/ sans rien écrire
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

import { toTiles } from '../src/engine/tiles.ts'
import type { ImageCredit, Puzzle, PuzzleCatalog, Region } from '../src/engine/types.ts'
import { parseMeta, type Meta } from './content/meta.ts'
import { matchKey, matchRegionFolder, REGIONS, slugify } from './content/regions.ts'

const ROOT = path.resolve(import.meta.dirname, '..')
const SOURCE_DIR = path.join(ROOT, 'content-source')
const IMAGE_OUT_DIR = path.join(ROOT, 'public', 'content', 'img')
const CATALOG_FILE = path.join(ROOT, 'src', 'content', 'puzzles.json')
const GAME_CONFIG_FILE = path.join(ROOT, 'src', 'config', 'game.json')

// Réglages techniques du pipeline (pas des règles de jeu, donc pas dans game.json).
const MAX_WIDTH = 480
const WEBP_QUALITY = 70
const HASH_LENGTH = 12
const ANECDOTE_MAX_LENGTH = 300
const SOURCE_MIN_WIDTH = 400
const WEBP_MAX_BYTES = 40 * 1024

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const ANECDOTE_FILE = 'anecdote.txt'
const META_FILE = 'meta.json'
// Fichiers créés par Windows ou macOS, sans intérêt : ignorés en silence.
const SYSTEM_FILES = new Set(['thumbs.db', 'desktop.ini'])
const GENERAL = '(général)'

const checkOnly = process.argv.includes('--check')

// ─── Rapport : erreurs et avertissements rangés par dossier ───

const issues = new Map<string, { errors: string[]; warnings: string[] }>()

function issuesOf(folder: string) {
  let entry = issues.get(folder)
  if (!entry) {
    entry = { errors: [], warnings: [] }
    issues.set(folder, entry)
  }
  return entry
}
const error = (folder: string, message: string) => issuesOf(folder).errors.push(message)
const warn = (folder: string, message: string) => issuesOf(folder).warnings.push(message)

// ─── Lecture des fichiers ───

const byCodePoint = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0)

async function listDir(dir: string) {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries
    .map((entry) => ({
      name: entry.name.normalize('NFC'),
      realName: entry.name,
      isDir: entry.isDirectory(),
    }))
    .sort((a, b) => byCodePoint(a.name, b.name))
}

/** Décode un .txt. S'il n'est pas en UTF-8, on le convertit et on le signale. */
function decodeText(buffer: Buffer): { text: string; warning?: string } {
  if (buffer[0] === 0xff && buffer[1] === 0xfe) {
    return { text: new TextDecoder('utf-16le').decode(buffer), warning: 'UTF-16' }
  }
  if (buffer[0] === 0xfe && buffer[1] === 0xff) {
    return { text: new TextDecoder('utf-16be').decode(buffer), warning: 'UTF-16' }
  }
  try {
    // TextDecoder retire lui-même un éventuel BOM UTF-8 en tête.
    return { text: new TextDecoder('utf-8', { fatal: true }).decode(buffer) }
  } catch {
    // Les éditeurs Windows enregistrent souvent en Windows-1252 (« ANSI »).
    return { text: new TextDecoder('windows-1252').decode(buffer), warning: 'Windows-1252' }
  }
}

function shortHash(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex').slice(0, HASH_LENGTH)
}

// ─── Parcours de content-source/ ───

interface SourceImage {
  file: string
  folders: string[]
}

interface PendingPuzzle {
  folder: string
  puzzle: Puzzle
}

async function readKeepAccents(): Promise<boolean> {
  try {
    const config = JSON.parse(await readFile(GAME_CONFIG_FILE, 'utf8'))
    const value = config?.tiles?.keepAccents
    if (typeof value === 'boolean') return value
    error(GENERAL, 'src/config/game.json : « tiles.keepAccents » doit valoir true ou false')
  } catch (cause) {
    error(GENERAL, `src/config/game.json illisible : ${(cause as Error).message}`)
  }
  return true
}

async function readAnswerFolder(
  region: Region,
  regionDir: string,
  answer: string,
  folder: string,
  keepAccents: boolean,
  images: Map<string, SourceImage>,
): Promise<Puzzle | undefined> {
  const dir = path.join(regionDir, answer)
  const entries = await listDir(dir)

  const imageFiles: { name: string; path: string }[] = []
  let anecdotePath: string | undefined
  let metaPath: string | undefined
  for (const entry of entries) {
    const lower = entry.name.toLowerCase()
    const fullPath = path.join(dir, entry.realName)
    if (entry.isDir) warn(folder, `sous-dossier ignoré : ${entry.name}`)
    else if (lower === ANECDOTE_FILE) anecdotePath = fullPath
    else if (lower === META_FILE) metaPath = fullPath
    else if (IMAGE_EXTENSIONS.has(path.extname(lower)))
      imageFiles.push({ name: entry.name, path: fullPath })
    else if (!lower.startsWith('.') && !SYSTEM_FILES.has(lower))
      warn(folder, `fichier ignoré : ${entry.name}`)
  }

  let ok = true
  if (imageFiles.length !== 4) {
    error(folder, `${imageFiles.length} image(s) trouvée(s), il en faut exactement 4`)
    ok = false
  }

  let text = ''
  if (!anecdotePath) {
    error(folder, 'Anecdote.txt absent')
    ok = false
  } else {
    const decoded = decodeText(await readFile(anecdotePath))
    if (decoded.warning) {
      warn(
        folder,
        `Anecdote.txt n'est pas en UTF-8 (${decoded.warning}) : converti à la lecture, à réenregistrer en UTF-8`,
      )
    }
    text = decoded.text.replace(/\r\n?/g, '\n').normalize('NFC').trim()
    if (!text) {
      error(folder, 'Anecdote.txt est vide')
      ok = false
    } else if ([...text].length > ANECDOTE_MAX_LENGTH) {
      warn(
        folder,
        `anecdote longue : ${[...text].length} caractères (conseillé : ${ANECDOTE_MAX_LENGTH} au plus)`,
      )
    }
  }

  let meta: Meta = {}
  if (metaPath) {
    const decoded = decodeText(await readFile(metaPath))
    const result = parseMeta(decoded.text)
    result.errors.forEach((message) => error(folder, message))
    result.warnings.forEach((message) => warn(folder, message))
    if (result.errors.length) ok = false
    meta = result.meta
  }

  // Ordre des images : celui de meta.json s'il est donné, sinon alphabétique.
  let ordered = imageFiles
  if (meta.images) {
    const byName = new Map(imageFiles.map((image) => [image.name, image]))
    const missing = meta.images.filter((name) => !byName.has(name))
    missing.forEach((name) =>
      error(folder, `meta.json « images » cite un fichier absent : ${name}`),
    )
    if (!missing.length) {
      if (
        new Set(meta.images).size !== meta.images.length ||
        meta.images.length !== imageFiles.length
      ) {
        error(folder, 'meta.json « images » doit citer chacune des 4 images une seule fois')
        ok = false
      } else {
        ordered = meta.images.map((name) => byName.get(name)!)
      }
    } else {
      ok = false
    }
  }

  const tiles = toTiles(answer, { keepAccents })
  if (!tiles.length) {
    error(folder, 'le nom du dossier ne contient aucune lettre')
    ok = false
  }

  const decoyLetters: string[] = []
  for (const letter of meta.decoyLetters ?? []) {
    const letterTiles = toTiles(letter, { keepAccents })
    if (letterTiles.length === 1) decoyLetters.push(letterTiles[0]!)
    else {
      error(folder, `meta.json « decoyLetters » : « ${letter} » doit être une seule lettre`)
      ok = false
    }
  }
  for (const distractor of meta.distractors ?? []) {
    if (matchKey(distractor) === matchKey(answer)) {
      warn(folder, `meta.json « distractors » contient la bonne réponse : ${distractor}`)
    }
  }

  if (!ok) return undefined

  const webpNames = new Map<string, string>()
  for (const image of ordered) {
    const hash = shortHash(await readFile(image.path))
    webpNames.set(image.name, `${hash}.webp`)
    const known = images.get(hash)
    if (known) known.folders.push(folder)
    else images.set(hash, { file: image.path, folders: [folder] })
  }

  const credits: ImageCredit[] = []
  for (const credit of meta.credits ?? []) {
    const webp = webpNames.get(credit.image)
    if (!webp) {
      warn(folder, `meta.json « credits » cite un fichier absent : ${credit.image}`)
      continue
    }
    credits.push({ ...credit, image: webp })
  }
  const uncredited = ordered.filter(
    (image) => !credits.some((c) => c.image === webpNames.get(image.name)),
  )
  if (uncredited.length === ordered.length)
    warn(folder, 'aucun crédit d’image (champ « credits » de meta.json)')
  else if (uncredited.length)
    warn(folder, `crédits manquants pour : ${uncredited.map((i) => i.name).join(', ')}`)

  return {
    id: `${region.id}--${slugify(answer)}`,
    regionId: region.id,
    answer,
    tiles,
    lang: meta.lang ?? 'fr',
    logic: meta.logic ?? 'A',
    images: ordered.map((image) => webpNames.get(image.name)!),
    anecdote: { title: meta.title ?? answer, text },
    distractors: meta.distractors ?? [],
    decoyLetters,
    credits,
    source: meta.source ?? null,
  }
}

// ─── Conversion des images ───

interface ConvertedImage {
  hash: string
  webp: Buffer | undefined // undefined : le fichier existe déjà, rien à écrire
  bytes: number
  sourceBytes: number
}

async function convertImage(hash: string, image: SourceImage): Promise<ConvertedImage | undefined> {
  const [firstFolder = GENERAL, ...otherFolders] = image.folders
  const alsoIn = otherFolders.length
    ? `, même image dans ${otherFolders.length} autre(s) dossier(s)`
    : ''
  const name = path.basename(image.file)
  const outFile = path.join(IMAGE_OUT_DIR, `${hash}.webp`)
  try {
    const source = await readFile(image.file)
    const metadata = await sharp(source).metadata()
    const width = metadata.autoOrient?.width ?? metadata.width
    if (width < SOURCE_MIN_WIDTH) {
      warn(
        firstFolder,
        `${name} : ${width} px de large, moins de ${SOURCE_MIN_WIDTH} px (risque de flou${alsoIn})`,
      )
    }

    let webp: Buffer | undefined
    let bytes: number
    if (existsSync(outFile)) {
      bytes = (await stat(outFile)).size
    } else {
      webp = await sharp(source)
        .autoOrient()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer()
      bytes = webp.length
    }
    if (bytes > WEBP_MAX_BYTES) {
      warn(
        firstFolder,
        `${name} : WebP de ${formatSize(bytes)}, plus de ${formatSize(WEBP_MAX_BYTES)}${alsoIn ? ` (${alsoIn.slice(2)})` : ''}`,
      )
    }
    return { hash, webp, bytes, sourceBytes: source.length }
  } catch (cause) {
    error(firstFolder, `${name} : image illisible (${(cause as Error).message})`)
    return undefined
  }
}

// ─── Rapport final ───

function formatSize(bytes: number): string {
  const [value, unit] = bytes < 1024 * 1024 ? [bytes / 1024, 'Ko'] : [bytes / 1024 / 1024, 'Mo']
  return `${value.toFixed(1).replace('.', ',').replace(',0', '')} ${unit}`
}

function printReport(totals: string[]) {
  console.log(`\nContenu SIRA${checkOnly ? ' (vérification seule, rien n’est écrit)' : ''}\n`)
  totals.forEach((line) => console.log(`  ${line}`))

  const folders = [...issues.keys()].sort((a, b) =>
    a === GENERAL ? -1 : b === GENERAL ? 1 : byCodePoint(a, b),
  )
  for (const folder of folders) {
    const { errors, warnings } = issues.get(folder)!
    if (!errors.length && !warnings.length) continue
    console.log(`\n${folder}`)
    errors.forEach((message) => console.log(`  [ERREUR] ${message}`))
    warnings.forEach((message) => console.log(`  [attention] ${message}`))
  }
}

// ─── Programme principal ───

async function main(): Promise<number> {
  if (!existsSync(SOURCE_DIR)) {
    console.log('content-source/ est absent : rien à traiter.')
    console.log(
      'Récupère le dossier de contenu auprès du pôle Contenu et place-le à la racine du projet.',
    )
    return checkOnly ? 0 : 1
  }

  const keepAccents = await readKeepAccents()
  const images = new Map<string, SourceImage>()
  const pending: PendingPuzzle[] = []
  const regionsWithContent = new Set<string>()

  for (const regionEntry of await listDir(SOURCE_DIR)) {
    if (!regionEntry.isDir) {
      const lower = regionEntry.name.toLowerCase()
      if (!lower.startsWith('.') && !SYSTEM_FILES.has(lower))
        warn(GENERAL, `fichier ignoré : ${regionEntry.name}`)
      continue
    }
    const match = matchRegionFolder(regionEntry.name)
    if (!match.ok) {
      error(regionEntry.name, `dossier région non reconnu : ${match.reason}`)
      continue
    }
    const regionDir = path.join(SOURCE_DIR, regionEntry.realName)
    for (const answerEntry of await listDir(regionDir)) {
      const folder = `${regionEntry.name}/${answerEntry.name}`
      if (!answerEntry.isDir) {
        warn(regionEntry.name, `fichier ignoré (hors d'un dossier réponse) : ${answerEntry.name}`)
        continue
      }
      const puzzle = await readAnswerFolder(
        match.region,
        regionDir,
        answerEntry.realName.normalize('NFC'),
        folder,
        keepAccents,
        images,
      )
      if (puzzle) {
        pending.push({ folder, puzzle })
        regionsWithContent.add(match.region.id)
      }
    }
  }

  const byId = new Map<string, string[]>()
  for (const { folder, puzzle } of pending)
    byId.set(puzzle.id, [...(byId.get(puzzle.id) ?? []), folder])
  for (const [id, folders] of byId) {
    if (folders.length > 1)
      folders.forEach((folder) =>
        error(folder, `identifiant en double « ${id} » : ${folders.join(' et ')}`),
      )
  }

  for (const region of REGIONS) {
    if (!regionsWithContent.has(region.id))
      warn(GENERAL, `aucune énigme pour la région ${region.name}`)
  }

  const converted: ConvertedImage[] = []
  for (const [hash, image] of [...images].sort(([a], [b]) => byCodePoint(a, b))) {
    const result = await convertImage(hash, image)
    if (result) converted.push(result)
  }

  const errorCount = [...issues.values()].reduce((sum, entry) => sum + entry.errors.length, 0)
  const warningCount = [...issues.values()].reduce((sum, entry) => sum + entry.warnings.length, 0)
  const puzzles = pending.map((entry) => entry.puzzle).sort((a, b) => byCodePoint(a.id, b.id))
  const imageRefs = puzzles.reduce((sum, puzzle) => sum + puzzle.images.length, 0)

  const willWrite = !checkOnly && errorCount === 0
  if (willWrite) {
    await mkdir(IMAGE_OUT_DIR, { recursive: true })
    for (const image of converted) {
      if (image.webp) await writeFile(path.join(IMAGE_OUT_DIR, `${image.hash}.webp`), image.webp)
    }
    const catalog: PuzzleCatalog = { version: 1, regions: [...REGIONS], puzzles }
    await mkdir(path.dirname(CATALOG_FILE), { recursive: true })
    await writeFile(CATALOG_FILE, `${JSON.stringify(catalog, null, 2)}\n`)
  }

  const newImages = converted.filter((image) => image.webp).length
  printReport([
    `Régions         ${regionsWithContent.size} / ${REGIONS.length}`,
    `Énigmes         ${puzzles.length}`,
    `Images uniques  ${converted.length} (utilisées ${imageRefs} fois)`,
    `Poids sources   ${formatSize(converted.reduce((sum, image) => sum + image.sourceBytes, 0))}`,
    `Poids WebP      ${formatSize(converted.reduce((sum, image) => sum + image.bytes, 0))}` +
      (willWrite
        ? ` (${newImages} converties, ${converted.length - newImages} déjà présentes)`
        : ''),
    `Erreurs         ${errorCount}`,
    `Avertissements  ${warningCount}`,
  ])

  if (errorCount) {
    console.log(
      `\n${errorCount} erreur(s) bloquante(s) : puzzles.json et les images n'ont pas été écrits.`,
    )
    return 1
  }
  if (willWrite) console.log('\nÉcrit : src/content/puzzles.json et public/content/img/')
  return 0
}

process.exitCode = await main()
