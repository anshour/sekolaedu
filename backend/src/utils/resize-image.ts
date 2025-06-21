import sharp from "sharp";

export default async function resizeImage(
  inputPath: string,
  outputPath: string,
  maxSize = 1000,
) {
  // Mendapatkan metadata gambar
  const metadata = await sharp(inputPath).metadata();

  // Menghitung ukuran baru dengan mempertahankan aspect ratio
  let newWidth, newHeight;

  if (metadata.width > metadata.height) {
    // Landscape orientation
    newWidth = Math.min(metadata.width, maxSize);
    newHeight = Math.round((metadata.height * newWidth) / metadata.width);
  } else {
    // Portrait orientation
    newHeight = Math.min(metadata.height, maxSize);
    newWidth = Math.round((metadata.width * newHeight) / metadata.height);
  }

  await sharp(inputPath)
    .resize(newWidth, newHeight, {
      kernel: sharp.kernel.lanczos3,
      fit: "inside",
      withoutEnlargement: true,
    })
    .toFile(outputPath);
}
