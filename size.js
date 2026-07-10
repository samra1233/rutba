import fs from 'fs';

function getJpegSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  let i = 4;
  while (i < buffer.length) {
    const marker = buffer.readUInt16BE(i);
    i += 2;
    if (marker >= 0xffc0 && marker <= 0xffc3) {
      i += 3; // skip length and precision
      const height = buffer.readUInt16BE(i);
      const width = buffer.readUInt16BE(i + 2);
      return { width, height };
    } else {
      const length = buffer.readUInt16BE(i);
      i += length;
    }
  }
}

try {
  console.log(getJpegSize('public/hero_showcase.jpg'));
} catch (e) {
  console.error(e);
}
