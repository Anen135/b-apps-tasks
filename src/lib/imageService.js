// src/lib/imageService.js
import fs from 'fs'
import path from 'path'

export async function downloadImage(url, filename) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch image')
  const buffer = await res.arrayBuffer()
  const filepath = path.resolve('./public/avatars', filename)
  await fs.promises.writeFile(filepath, Buffer.from(buffer))
  console.log(`Image saved to ${filepath}`)
  return `/avatars/${filename}` // путь для использования в src
}

export async function deleteImage(filename) {
  if (filename === "unset_avatar.png") return;
  const filepath = path.resolve('./public/avatars', filename);

  try {
    await fs.promises.unlink(filepath);
  } catch (err) {
    if (err.code === 'ENOENT') { console.warn(`Файл не найден: ${filepath}`); }
    else { throw err; }
  }
}
