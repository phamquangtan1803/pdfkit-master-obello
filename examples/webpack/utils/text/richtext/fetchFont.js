import fs from "fs";
import path from "path";
import { create } from "fontkit";
import { fetchFile } from "../../../src/httpHelpers"; // Adjust the import path as necessary

const fetchFont = async (src) => {
  const fetchedFont = await fetchFile(src, { type: "arraybuffer" });
  const fontFolder = path.join(process.cwd(), "./src/utils/text/assets");
  const fileExtension = src.match(/\.([a-zA-Z0-9]+)$/)?.[1];

  fs.mkdirSync(fontFolder, { recursive: true });

  const font = create(fetchedFont);
  const fontName = font.familyName || `unknown-font-${src}`;
  const outputFontPath = path.join(
    fontFolder,
    `${fontName}.${fileExtension.toLowerCase()}`
  );
  const relativeFontPath = path
    .relative(process.cwd(), outputFontPath)
    .replace(/\\/g, "/");

  fs.writeFileSync(outputFontPath, Buffer.from(fetchedFont));

  return { path: relativeFontPath, metadata: font };
};

export { fetchFont };
