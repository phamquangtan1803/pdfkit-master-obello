// import fs from "fs";
// import sharp from "sharp";
// import path from "path";
// export async function convertSVGToPNG(svgPath, svgBuffer, svgWidth) {
//   const scaleFactor = 10;
//   const logoFolder = path.join(process.cwd(), "./src/utils/logo/assets");
//   const getFileName = (url) => {
//     const match = url.match(/\/([^/]+)\.svg$/);
//     return match ? match[1] : null;
//   };
//   const fileName = getFileName(svgPath);
//   fs.mkdirSync(logoFolder, { recursive: true });

//   const outputPngPath = path.join(logoFolder, `${fileName}.png`);

//   await sharp(svgBuffer)
//     .resize({ width: Math.round(svgWidth * scaleFactor) })
//     .png()
//     .toFile(outputPngPath);

//   return outputPngPath;
// }
import pica from "pica";

export async function convertSVGToPNG(svgPath, svgBuffer, svgWidth) {
  const scaleFactor = 10;
  const logoFolder = "./src/utils/logo/assets"; // Adjust path as needed for browser
  const getFileName = (url) => {
    const match = url.match(/\/([^/]+)\.svg$/);
    return match ? match[1] : null;
  };
  const fileName = getFileName(svgPath);

  const outputPngPath = `${logoFolder}/${fileName}.png`;

  // Create a canvas element
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(svgWidth * scaleFactor);
  canvas.height = Math.round(svgWidth * scaleFactor);
  const ctx = canvas.getContext("2d");

  // Create an image element and load the SVG
  const img = new Image();
  img.src = URL.createObjectURL(
    new Blob([svgBuffer], { type: "image/svg+xml" })
  );

  return new Promise((resolve, reject) => {
    img.onload = async () => {
      // Draw the SVG onto the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Use pica to resize the image
      const picaInstance = pica();
      const resizedCanvas = document.createElement("canvas");
      resizedCanvas.width = canvas.width;
      resizedCanvas.height = canvas.height;
      await picaInstance.resize(canvas, resizedCanvas);

      // Convert the resized canvas to a PNG data URL
      const dataUrl = resizedCanvas.toDataURL("image/png");

      // Resolve with the data URL or handle it as needed
      resolve(dataUrl);
    };

    img.onerror = reject;
  });
}
