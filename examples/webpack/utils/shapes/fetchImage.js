// import axios from "axios";
// import sharp from "sharp";

// const fetchImage = async (src, opacity) => {
//     const fetchedImg = await axios.get(src, { responseType: "arraybuffer" });
//     const result = await sharp(Buffer.from(fetchedImg.data))
//             .ensureAlpha(opacity).toBuffer();
//     return result;
// }

import { fetchFile } from "../../src/httpHelpers";
import Pica from "pica";

const fetchImage = async (src, opacity) => {
  const fetchedImg = await fetchFile(src, { responseType: "arraybuffer" });
  const imgBuffer = Buffer.from(fetchedImg.data);

  // Create an image element to use with pica
  const img = new Image();
  img.src = URL.createObjectURL(new Blob([imgBuffer]));

  // Create a canvas to draw the image
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Wait for the image to load
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  // Set canvas dimensions
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the image onto the canvas
  ctx.drawImage(img, 0, 0);

  // Use pica to process the image
  const pica = new Pica();
  const resultCanvas = await pica.resize(canvas, canvas, {
    alpha: true,
    unsharpAmount: 80,
    unsharpRadius: 0.6,
    unsharpThreshold: 2,
  });

  // Convert the canvas to a buffer
  const result = await new Promise((resolve) => {
    resultCanvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.onload = () => resolve(Buffer.from(reader.result));
      reader.readAsArrayBuffer(blob);
    });
  });

  return result;
};

export { fetchImage };
