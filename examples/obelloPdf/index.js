import { fetchData } from "./services/api/mainAPI.js";
import { fetchFont } from "./services/api/fontAPI.js";
import initializeFontClients from "./services/clients/fontClient.js";
import { generatePDF } from "./utils/pdfGenerator.js";
import blobStream from "blob-stream";

import "./registerStaticFiles.js"
export async function createPDF(templateSizeID) {
  try {
    const data = await fetchData.get(templateSizeID);
    console.log(data);
    let fontClients = await initializeFontClients(data);
    fetchFont.setClients(fontClients);

    // Create a blob stream
    const stream = blobStream();

    // Pass the stream to the PDF generator
    const pdfBlob = await generatePDF(data, stream);
    console.log('pdfBlob', pdfBlob);
    // When the stream is finished, create a blob URL and download it
  

    console.log("PDF generation initiated.");
  } catch (error) {
    console.error("Error in main process:", error);
  }
}

document.querySelector("#generate-pdf").addEventListener("click", async () => {
  console.log("clicked");
  await createPDF("93fc730a44fa4846a02b6aefb36f7632");
});
