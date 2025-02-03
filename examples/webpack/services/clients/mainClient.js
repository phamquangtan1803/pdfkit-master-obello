import { fetchFile } from '../../src/httpHelpers'; // Adjust the path as necessary

async function mainClient(url) {
    const data = await fetchFile(url, { type: 'json' })
        .then(data => {
            if (Array.isArray(data.data)) {
                data.data = data.data.map(item => {
                    if (!item.hasOwnProperty('children')) {
                        item.children = [];
                    }
                    return item;
                });
            }
            return data.data;
        })
        .catch(error => {
            throw error;
        });
    return data;
}

// Example usage


export default mainClient