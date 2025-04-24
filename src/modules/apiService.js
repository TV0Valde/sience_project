import { API_BASE_URL} from '../constants/constants'
import { buildingInfoManager } from './buildingInfoManager';
import { controlsManager } from './controlsManager';
import { calculateDistance } from '../functions/distanseModule';
import { projectNameInput, projectAddressInput, currentRecordId } from './buildingInfoManager';
import { selectedBuildingId } from './buildingSelect';

export const apiService = {
    /**
     * Получение информации о здании
     * @param {*} buildingId Id здания
     * @returns Информация о здании
     */
    async fetchBuildingInfo(buildingId){
        try{
            const response = await fetch(`${API_BASE_URL}/buildingInfo/byBuilding/${buildingId}`);
            if(!response.ok) throw new Error("Не удалось загрузить данные здания");
            return await response.json();
        } catch (error) {
                console.error("Ошибка при загрузке информции о здании:", error);
                return null;
            }
        },
      
     /**
      * Сохраненине информации о здании
      */   
    async saveBuildingInfo() {
        const newRecord = {
            id:buildingInfoManager.currentRecordId, 
            projectName: projectNameInput.value,
            areaAdress: projectAddressInput.value,
            buildingId: selectedBuildingId,
        };

        try {
            let response;
            if (buildingInfoManager.isEditing && buildingInfoManager.currentRecordId) {
                response = await fetch(`${API_BASE_URL}/buildingInfo/${buildingInfoManager.currentRecordId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newRecord),
                });

                if (!response.ok) throw new Error('Не удалось обновить запись');
                console.log('Запись успешно обновлена');

            } else {
                // Создание новой записи
                response = await fetch(`${API_BASE_URL}/buildingInfo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newRecord),
                });
                
                if (!response.ok) throw new Error('Не удалось создать запись');
                console.log('Новая запись успешно создана');
            }

            infoModal.style.display = 'none';
        } catch (error) {
            console.error('Ошибка при сохранении записи:', error);
        } finally {
            controlsManager.unlock()
        }
    },
    
    /**
     * Удаление информации о здании
     * @param {*} recordId Id записи
     */
    async deleteBuildingInfo (recordId){
        try {
            const response = await fetch (`${API_BASE_URL}/buildingInfo/${recordId}`,{
                method: 'DELETE'
            });

            if(!response.ok) throw new Error('Не удалось удалить запись');
        } catch (error){
            console.error("Ошибка при удалении записи информации о здании:", error);
            throw error;
        }
    },

    /**
     * Проверка на существование точки по близости
     * @param {*} position координаты точки
     */
    async checkExistingPoint(position){
        try{
            const response = await fetch(
                `${API_BASE_URL}/points?x=${position.x}&y=${position.y}&z=${position.z}`,
                {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                }
            );

            if(!response.ok) {
                console.error("Ошибка при проверке существующих точек:",response.statusText);
                return true;
            }
            const existingPoints = await response.json();
            return existingPoints.some(existingPoint => {
                if (!existingPoint.position) return false; 
            
                const existingPos = Array.isArray(existingPoint.position) 
                    ? existingPoint.position 
                    : [existingPoint.position.x, existingPoint.position.y, existingPoint.position.z];
            
                
                const newPos = Array.isArray(position) 
                    ? position 
                    : [position._x, position._y, position._z];
            
                const distance = calculateDistance(existingPos, newPos);
                return distance < 0.5;
            });
        } catch(error){
            console.error('Ошибка при проверки существующих точек:', error);
            return true;
        }
    },

    /**
     * Создание точки
     * @param {*} position координаты точки
     * @returns информация о точке
     */
    async createPoint(position) {
        try{
            const pointData = {
                buildingId : selectedBuildingId,
                position: position
            };

            const response = await fetch(`${API_BASE_URL}/point`,{
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(pointData)
            });

            if(!response.ok) throw new Error('Не удалось создать точку');
            return await response.json();

        } catch(error){
            console.error('Ошибка при создании точки:', error);
            throw error;
        }
    },

    /**
     * Удаление точки
     * @param {*} pointId Id точки
     */
    async deletePoint(pointId){
        try{
            const response = await fetch(`${API_BASE_URL}/point/${pointId}`,{
                method: 'DELETE'
            });

            if(!response.ok) 
            throw new Error(`Не удалось удалить точку с ID: ${pointId}. Статус ${response.status} `);
        return true;
        } catch(error){
            console.error('Ошибка при удалении точки', error);
            throw error;
        }
    },

    /**
     * Получение информации о точке
     * @param {*} pointId Id точки
     */
    async getPointData(pointId){
        try{
            const  response = await fetch(`${API_BASE_URL}/point/${pointId}`);
            
            if(!response.ok)
            throw new Error('Ошибка получения данных', response.statusText);

            return await response.json();
        } catch(error){
            console.error('Ошибка при получени данных точки', error);
        }
    },

    /**
     * Получение информации о записи
     * @param {*} pointId Id записи
     */
    async getPointRecords(pointId){
        try {
            const response = await fetch(`${API_BASE_URL}/point/${pointId}/records`);
            if(!response.ok){
                throw new Error(`Проблема при получении записи: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            console.error('Ошибка при получении записей',error);
            throw error;
        }
    },

    /**
     * Загрузка фотографии
     * @param {*} file файл
     */
    async uploadPhotoFile(file){
        try {
            const formData = new FormData();
            formData.append('file',file);

            const response = await fetch(`${API_BASE_URL}/photos/upload`, {
                method: 'POST',
                body: formData
            });
            if(!response.ok){
                throw new Error("Ошибка при загрузке фото");
            }

            const result = await response.json();
            return result.photoId;
        } catch (error) {
            console.error('Ошибка при загрузке фото',error);
            throw error;
        }
    },

    /**
     * Добавление записи
     * @param {*} pointId 
     * @param {*} recordData 
     * @param {*} photoFile 
     * @returns 
     */
    async addPointRecord(pointId, recordData, photoFile) {
        try {
            const formData = new FormData();

            if(photoFile){
                formData.append("photoFile", photoFile);
            }

            formData.append("pointId", pointId);
            formData.append("Info", recordData.info);
            formData.append("MaterialName", recordData.materialName);
            formData.append("CheckupDate", recordData.checkupDate);
            formData.append("BuildingId", selectedBuildingId);

            const response = await fetch(`${API_BASE_URL}/point/${pointId}/records`,{
                method: 'POST',
                body: formData
            });

            if(!response.ok){
                throw new Error('Не удалось добавить новую запись');
            }

            return await response.json();
        } catch (error) {
            console.error("Ошибка при добавлении записи точки:", error);
            throw error;
        }
    },

    /**
     * Обновление записи
     * @param {*} recordId 
     * @param {*} recordData 
     * @param {*} photoId 
     */
    async updatePointRecord(recordId, recordData, photoId){
        try {
            if(photoId !== undefined) {
                recordData.photoId = photoId;
            }

            const response = await fetch(`${API_BASE_URL}/pointRecord/${recordId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(recordData)
            });

            if(!response.ok){
                throw new Error('Не удалось обновить запись точки')
            }
        } catch (error) {
            throw new Error("Ошибка при обновлении записи точки:", error);
            
        }
    },
    
    async getPointsByBuilding(){
        try {
            const response = await fetch(`${API_BASE_URL}/points/byBuilding/${selectedBuildingId}`);
            if(!response.ok){
                throw new Error(`Проблема при получении записей: ${response.statusText}`);
            }
            return response.json();
        } catch (error) {
            throw new Error("Ошибка при получении записей:", error);
        }
    }
}