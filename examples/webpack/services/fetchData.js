import { fetchData } from "./api/mainAPI.js";

let templateSizeID = ''

export const templateData = {
    getAll: async () => {
        return await fetchData.get(`https://stg-api.obello.com/template-service/animations/list/${templateSizeID}`)
    }
}