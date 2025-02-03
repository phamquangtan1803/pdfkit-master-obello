import { fetchFile } from "../../src/httpHelpers";

export const fetchLogo = {
    get: async (url) => {
        try {
            const response = await fetchFile(url, { type: 'arraybuffer' });
            return response;
        } catch (error) {
            throw error;
        }
    }
}