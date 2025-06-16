import { API_BASE_URL } from "../constants/constants";

export let formatList = [];

export async function fetchAllFormats() {
    try{
        const response = await fetch(`${API_BASE_URL}/format`, {
            method:'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials:'include'
        });

        if(!response.ok){
            throw new Error("Ошибка при получении данных");
        }

        const data = await response.json();
        formatList = data.map(format => ({
            visibilityFormat : format.visibilityFormat
        }));
        updateFormatOptions();
        console.log(formatList);
    } catch(error) {
        console.error("Ошибка:", error);
    }
}

fetchAllFormats();

export function updateFormatOptions(){
    const formatSelect = document.getElementById('format-select');
    formatSelect.innerHTML = '';

    formatList.forEach(format => {
        const option = new Option (format.visibilityFormat, format.visibilityFormat);
        formatSelect.add(option);
    });
}