import fs from "fs/promises"
import path from "path"

/**
 * All supported upload target folders.
 * Files will be saved into: public/uploads/<folder>/
 */
export type UploadFolder = "products" | "thumbnails" | "categories" | "logos"

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads")

const ALL_DIRS: UploadFolder[] = ["products", "thumbnails", "categories", "logos"]

/**
 * Ensures every required upload sub-directory exists under public/uploads/.
 * Safe to call repeatedly – uses `recursive: true`.
 */
export async function ensureUploadDirs(): Promise<void> {
  await Promise.all(
    ALL_DIRS.map((dir) =>
      fs.mkdir(path.join(UPLOAD_ROOT, dir), { recursive: true })
    )
  )
}

/**
 * Saves a File to the given target folder with a unique timestamped name.
 * Returns the public-relative path, e.g. `/uploads/products/1234567890-987654321.jpg`
 *
 * @param file      - The File object from FormData
 * @param folder    - Which sub-folder to save into (products | thumbnails | categories | logos)
 */
export async function saveFile(
  file: File,
  folder: UploadFolder
): Promise<string> {
  // Guarantee the directories exist before writing
  const targetDir = path.join(UPLOAD_ROOT, folder)
  await fs.mkdir(targetDir, { recursive: true })

  // Read file to buffer
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Generate a unique, timestamped filename
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  const ext = path.extname(file.name) || ".jpg"
  const fileName = `${folder.slice(0, -1)}-${uniqueSuffix}${ext}`

  const filePath = path.join(targetDir, fileName)
  await fs.writeFile(filePath, buffer)

  return `/uploads/${folder}/${fileName}`
}

/**
 * Convenience: process an array of Files and save them all to the same folder.
 * Returns an array of public-relative paths.
 */
export async function saveFiles(
  files: File[],
  folder: UploadFolder
): Promise<string[]> {
  const paths: string[] = []
  for (const file of files) {
    if (file && file.size > 0) {
      const savedPath = await saveFile(file, folder)
      paths.push(savedPath)
    }
  }
  return paths
}
