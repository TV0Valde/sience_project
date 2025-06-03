import { apiService } from "./apiService";
import { controlsManager } from "./controlsManager";
import { selectedBuildingId } from "./buildingSelect";

export const projectNameInput = document.getElementById("project_name");
export const projectAddressInput = document.getElementById("project_adress");


export const buildingInfoManager = {
    isEditing:true,
    currentRecordId: null,
    
    async loadBuildingInfo() {
        return await apiService.fetchBuildingInfo(selectedBuildingId);
    },

    async openModal() {
        controlsManager.lock();

        const infoModal = document.getElementById('infoModal');
        const modalContent = document.getElementById('infoModal-content');
        const buildingInfoBlock = document.getElementById('building_info_container');
        const saveButton = document.getElementById('infoModal_saveBtn');
        const deleteButton = document.getElementById('infoModal_deleteBtn');
        const updateButton = document.getElementById('infoModal_updateBtn');
        const closeInfoModalButton = document.querySelector('#infoModal .close');
        const buildingInfoDisplay = document.getElementById('buildingInfoDisplay');
        const projectNameDisplay = document.getElementById('buildingInfoDisplay_project_name');
        const projectAddressDisplay = document.getElementById('buildingInfoDisplay_project_adress');
    
    
        if (!infoModal || !modalContent) {
            console.error("Не удалось найти модальное окно или его содержимое.");
            return;
        }
    
        /**
         * Сброс полей
         */
        function resetInputs() {
            projectNameInput.value = '';
            projectAddressInput.value = '';
        }
    
        /**
         * Переключения режима модального окна в режим редактирования
         */
        function switchToEditMode() {
            buildingInfoManager.isEditing = true;
            buildingInfoDisplay.style.display = 'none';
            buildingInfoBlock.style.display = 'flex';
            buildingInfoBlock.style.alignItems = 'center';
            buildingInfoBlock.style.flexDirection = 'column';
            saveButton.style.display = 'inline-block';
            deleteButton.style.display = 'none';
            updateButton.style.display = 'none';
        }
    
        /**
         * Переключение режима модального окна в режим просмотра
         */
        function switchToViewMode() {
            buildingInfoManager.isEditing = false;
            buildingInfoDisplay.style.display = 'block';
            buildingInfoBlock.style.display = 'none';
            saveButton.style.display = 'none';
            deleteButton.style.display = 'inline-block';
            updateButton.style.display = 'inline-block';
            projectNameDisplay.style.display = `block`;
            projectAddressDisplay.style.display = `block`;
        }
        const buildingData = await this.loadBuildingInfo();

        if(buildingData) {
            buildingInfoManager.currentRecordId = buildingData.id,
            projectNameInput.value = buildingData.projectName || '';
            projectAddressInput.value = buildingData.areaAdress || '';

            projectNameDisplay.textContent = `Наименование проекта: ${buildingData.projectName}`;
            projectAddressDisplay.textContent =  `Адрес участка: ${buildingData.areaAdress}`;

            switchToViewMode();

            updateButton.onclick = () => {
                switchToEditMode();
            };

            deleteButton.onclick = async () => {
                try {
                    await apiService.deleteBuildingInfo(buildingInfoManager.currentRecordId);
                    infoModal.style.display = 'none';
                } catch (error) {
                    console.error('Ошибка при удалении информации о здании', error);                    
                } finally {
                    controlsManager.unlock();
                }
            };
        } else {
            resetInputs();
            buildingInfoManager.currentRecordId = null;
            switchToEditMode();
        }

        infoModal.style.display = 'flex';
        modalContent.style.height = '40wh';
        modalContent.style.width = '20vw';

        saveButton.onclick =  async () => apiService.saveBuildingInfo();

        if(closeInfoModalButton) {
            closeInfoModalButton.onclick = () => {
                infoModal.style.display = 'none';
                controlsManager.unlock();
            };
        }
    }
};