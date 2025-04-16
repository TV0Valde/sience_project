export let buildingsList = [];
export let selectedBuildingId = null; // Экспортируем ID выбранного здания

export async function fetchAllBuildings() {
    try {
        const response = await fetch('http://localhost:5141/api/building', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Ошибка при получении данных');
        }

        const data = await response.json();
        buildingsList = data.map(building => ({
            name: building.name,
            path: building.path,
            selected: building.selected,
            id: building.id
        }));

        // Устанавливаем ID по умолчанию для выбранного здания (если есть)
        const selectedBuilding = buildingsList.find(building => building.selected);
        if (selectedBuilding) {
            selectedBuildingId = selectedBuilding.id;
        }

        updateModelOptions();
        console.log(buildingsList);
        console.log("ID выбранного здания:", selectedBuildingId);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

export function updateModelOptions() {
    const modelSelect = document.getElementById('model-select');
    modelSelect.innerHTML = '';

    buildingsList.forEach(building => {
        const option = new Option(building.name, building.path); 
        option.dataset.id = building.id; 
        modelSelect.add(option);
    });

    modelSelect.addEventListener('change', (event) => {

        const selectedOption = event.target.selectedOptions[0];
        selectedBuildingId = parseInt(selectedOption.dataset.id, 10);
        console.log("ID выбранного здания обновлено:", selectedBuildingId);
    });
}



fetchAllBuildings();
