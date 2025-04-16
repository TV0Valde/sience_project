import { API_BASE_URL, MINIO_URL } from "./constants";
export const apiService = {
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

    async saveBuldingInfo(date){
        try{
            const method = data.id ? 'PUT' : 'POST';
            const url = data.id ? 
            `${API_BASE_URL}/buildingInfo/${data.id}`:
            `${API_BASE_URL}/buildingInfo`;

            const response = await fetch(url, {
                method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });

            if(!response.ok) throw new Error('Не удалось сохранить данные здания');
            return await response.json();
        } catch(error) {
            console.error('Ошибка при сохранении информации о здании:', error);
            throw error;
        }
    },
    
    async deleteBuildingInfo (recordId){
        try {
            const response = await fetch (`${API_BASE_URL}/buildingId/${recordId}`,{
                method: 'DELETE'
            });

            if(!response.ok) throw new Error('Не удалось удалить запись');
        } catch (error){
            console.error("Ошибка при удалении записи информации о здании:", error);
            throw error;
        }
    },

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
                const distance = calculateDistance(existingPoint.position, position.asArray());
                return distance < 0.5;
            });
        } catch(error){
            console.error('Ошибка при проверки существующих точек:', error);
            return true;
        }
    },

    async createPoint(position) {
        try{
            const pointData = {
                buildingId : selectedBuildingId,
                position: position.asArray()
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
            throw error;
            
        }
    }
}