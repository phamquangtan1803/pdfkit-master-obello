import axios from "axios";
import fs from "fs";
import path from "path";
import { create } from "fontkit";

const fetchFont = async (src) => {
  const fetchedFont = await axios.get(src, { responseType: "arraybuffer" });
  const fontFolder = path.join(process.cwd(), "./src/utils/text/assets");
  const fileExtension = src.match(/\.([a-zA-Z0-9]+)$/)?.[1];

  fs.mkdirSync(fontFolder, { recursive: true });

  const font = create(fetchedFont.data);
  const fontName = font.familyName || `unknown-font-${src}`;
  const outputFontPath = path.join(
    fontFolder,
    `${fontName}.${fileExtension.toLowerCase()}`
  );
  const relativeFontPath = path
    .relative(process.cwd(), outputFontPath)
    .replace(/\\/g, "/");

  fs.writeFileSync(outputFontPath, Buffer.from(fetchedFont.data));

  return { path: relativeFontPath, metadata: font };
};

export { fetchFont };
