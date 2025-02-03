import { fetchFile } from "../../src/httpHelpers";

export default async function initializeFontClients(data) {
    const mainData = data;
    const textData = mainData.flatMap((item) => item.children).filter((child) => child.type === "text");
    const fontClients = textData.map((textItem) => {
        const fileExtension = textItem.s3FilePath.match(/\.([a-zA-Z0-9]+)$/)?.[1];
        return {
            s3FilePath: textItem.s3FilePath,
            fileExtension: fileExtension
        };
    });

    const fetchFontData = async (client) => {
        try {
            const data = await fetchFile(client.s3FilePath, { type: 'arraybuffer' });
            return { data, fileExtension: client.fileExtension };
        } catch (error) {
            throw new Error(`Error fetching font data: ${error}`);
        }
    };

    const fontDataPromises = fontClients.map(fetchFontData);
    return Promise.all(fontDataPromises);
}


