import * as BABYLON from 'babylonjs';
import { apiService } from './apiService';
import { sceneManager } from './sceneManager';
import { controlsManager } from './controlsManager';
import { API_BASE_URL, MINIO_URL } from '../constants/constants';
import { selectedBuildingId } from './buildingSelect';
import {formatDate} from '../functions/formatDate'


export const pointsManager = {
    
  async loadPoints(selectedBuildingId, scene){
    try {
        const pointsData = await apiService.getPointsByBuilding(selectedBuildingId);
        console.log(pointsData);
        const pointRecordsMap = new Map();

        await Promise.all(pointsData.map(async (pointData) => {
            const records = await apiService.getPointRecords(pointData.id);
            pointRecordsMap.set(pointData.id, records);
        }));

        pointsData.forEach(pointData => {
            if(pointsData.buildingId === selectedBuildingId) {
                const records = pointRecordsMap.get(pointData.id) || [];
                this.createdPointMesh(pointData, records, scene);
            }
        })
    } catch (error) {
        console.error("Во время загрузки точек возникла ошибка", error);
    }

},
    createdPointMesh(pointData, records, scene) {
        const point = BABYLON.MeshBuilder.CreateSphere(
            `point_${pointData.id}`,
            {diameter: 0.5},
            scene
        );
        
        const position =  pointData.position || {};
        point.position = Array.isArray(pointData.position)
        ? new BABYLON.Vector3(...pointData.position)
        : new BABYLON.Vector3(pointData.x ?? position.x, pointData.y ?? position.y, pointData.z ?? position.z);
        
        const latestRecord = records.at(-1) || null;
        point.actionManager = new BABYLON.ActionManager(scene);
        point.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            () => {
                this.openModal(null, point.pointRecords.at(-1), { pointId: pointData.id });
            }
        ));
        
        point.material = latestRecord?.materialName ?
             sceneManager.createMaterial(latestRecord.materialName)
             :sceneManager.createDefaultMaterial();

        point.pointData = pointData;
        point.pointRecords = records;

        return point;

    },

    async createNewPoint(position) {
        let existingPoint = await apiService.checkExistingPoint(position);
    
        if(!existingPoint){
            const point = BABYLON.MeshBuilder.CreateSphere("point", {diameter:0.5}, scene);
            point.position = position;
            
            try {
                const createdPoint = await apiService.createPoint(point.position);
                
                // Сразу переименовываем mesh с правильным ID
                point.name = `point_${createdPoint.id}`;
                
                this.openModal(async (newRecord) => {
                    try {
                        // Добавляем запись к точке
                        const createdRecord = await apiService.addPointRecord(createdPoint.id, newRecord, newRecord.file);
                        
                        // Получаем все записи для точки
                        const allRecords = await apiService.getPointRecords(createdPoint.id);
                        
                        // Обновляем материал точки
                        const updatedMaterial = sceneManager.createMaterial(newRecord.materialName);
                        point.material = updatedMaterial;
                        
                        // Сохраняем данные точки и записи в mesh
                        point.pointData = createdPoint;
                        point.pointRecords = allRecords;
                        
                        // Добавляем ActionManager для взаимодействия
                        point.actionManager = new BABYLON.ActionManager(scene);
                        point.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                            BABYLON.ActionManager.OnPickTrigger,
                            () => {
                                this.openModal(null, point.pointRecords.at(-1), { pointId: createdPoint.id });
                            }
                        ));
                    } catch (error) {
                        console.error("Ошибка при создании записи:", error);
                    }
                }, 'create', { pointId: createdPoint.id });
                
            } catch (error) {
                console.error("Ошибка при создании:", error);
                point.dispose();
                controlsManager.unlock();
            }
        }
    },
    
    async  openModal(callback, pointRecord, pointData) {
      controlsManager.lock();
      const $ = id => document.getElementById(id);
      const closePointModalBtn = document.querySelector('#pointModal .close');
      const insert = $("insert"), pointModal = $("pointModal"), modalContent = $("modal-content");
      const infoBlock = $("info"), dateInput = $("date"), infoInput = $("infoInput"), photoInput = $("photoInput");
      const materialInputs = document.querySelectorAll('input[name="material"]');
      const photoDisplay = $("photoDisplay"), infoDisplay = $("infoDisplay"), dateDisplay = $("dateDisplay");
      const addBtn = $("addBtn"), deleteBtn = $("deleteBtn"), updateBtn = $("updateBtn"), saveBtn = $("saveBtn");
      const photoViewer = $("photo-viewer"), prevBtn = $("previosly"), nextBtn = $("next");
  
      let currentRecords = [], currentRecordIndex = 0;
      let mode = 'create'; 
      let addingToExistingPoint = pointData && pointData.pointId && !callback;
  
      const resetInputs = () => {
          photoInput.value = '';
          infoInput.value = '';
          dateInput.value = '';
          materialInputs.forEach(input => input.checked = false);
          photoDisplay.src = '';
          photoDisplay.style.display = 'none';
          infoDisplay.innerHTML = '';
          dateDisplay.innerHTML = '';
          photoViewer.style.display = 'none';
      };
  
 
      const updateRecordDisplay = (record) => {
          photoDisplay.src = `${MINIO_URL}${record.photoUrl}`;
          photoDisplay.style.display = "block";
          photoDisplay.style.height = "40vh";
          photoDisplay.style.width = "20vw";
          photoViewer.style.display = 'flex';
  
          infoDisplay.innerHTML = record.info || '';
          infoDisplay.style.display = 'block';
  
          dateDisplay.innerHTML = `Дата осмотра: ${formatDate(record.checkupDate)}`;
          dateDisplay.style.display = 'block';
  
          materialInputs.forEach(input => input.checked = input.value === record.materialName);
          prevBtn.classList.toggle('disabled', currentRecordIndex === 0);
          nextBtn.classList.toggle('disabled', currentRecordIndex >= currentRecords.length - 1);
      };
  
      const configureModalLayout = (newMode) => {
          mode = newMode;
          insert.style.display = (mode === 'edit' || mode === 'create') ? 'block' : 'none';
          photoViewer.style.display = mode === 'view' ? 'flex' : 'none';
  
          modalContent.style.height = mode === 'view' ? "80vh" : "40vh";
          modalContent.style.width = mode === 'view' ? '25vw' : '20vw';
          saveBtn.style.display = (mode === 'edit' || mode === 'create') ? 'inline-block' : 'none';
          updateBtn.style.display = mode === 'view' ? 'inline-block' : 'none';
          deleteBtn.style.display = mode === 'view' ? 'inline-block' : 'none';
          addBtn.style.display = mode === 'view' ? 'inline-block' : 'none';
          infoBlock.style.display = mode === 'view' ? 'flex' : 'none';
          if (mode === 'edit') {
              infoInput.value = pointRecord.info || '';
              dateInput.value = pointRecord.checkupDate || '';
              infoBlock.style.display = 'none';
          }
  
          if (mode === 'create') {
              resetInputs();
          }
      };
  
  
      const updatePointRecord = async () => {
        if (!pointRecord) return console.error('Нет точки для обновления');
    
        try {
            const file = photoInput.files[0];
            let photoId = pointRecord.photoId; // Старый photoId (если файл не меняется)
    
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
        
                const response = await fetch(`${API_BASE_URL}/photos/upload`, {
                    method: "POST",
                    body: formData
                });
        
                if (!response.ok) throw new Error("Ошибка при загрузке фото");
        
                const result = await response.json();
                photoId = result.fileId;
            }
                
            const newRecord = {
                info: infoInput.value,
                checkupDate: dateInput.value,
                materialName: [...materialInputs].find(input => input.checked)?.value,
                photoId
            };
    
            // Обновляем запись и получаем обновленную запись с сервера
            const updatedRecord = await apiService.updatePointRecord(
                pointRecord.id,       // recordId
                newRecord,            // recordData
                pointData.pointId,    // pointId
                selectedBuildingId,   // buildingId
                file                  // photoFile
            );
    
            photoDisplay.src = `${MINIO_URL}${updatedRecord.photoUrl}`;
            if (updatedRecord) {
                // Обновляем материал меша, если нужно
                const mesh = scene.getMeshByName(`point_${pointData.pointId}`);
                if (mesh && updatedRecord.materialName) {
                    mesh.material = sceneManager.createMaterial(updatedRecord.materialName);
                    mesh.pointRecords = [updatedRecord];
                }
                
            }
    
        } catch (error) {
            console.error("Ошибка:", error);
            alert(`Ошибка при обновлении: ${error.message}`);
        }
        finally {
            pointModal.style.display = 'none';
        }
    };
  
    const createNewPointRecord = async () => {
        const file = photoInput.files[0];
    
        let photoId = null;
    
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
    
            const response = await fetch(`${API_BASE_URL}/photos/upload`, {
                method: "POST",
                body: formData
            });
    
            if (!response.ok) throw new Error("Ошибка при загрузке фото");
    
            const result = await response.json();
            photoId = result.fileId;
        }
    
        const newRecord = {
            info: infoInput.value,
            checkupDate: dateInput.value,
            materialName: [...materialInputs].find(input => input.checked)?.value,
            photoId,
            file,
        };
    
        if (typeof callback === 'function') {
            await callback(newRecord);
        } else if (addingToExistingPoint) {
            // Для добавления новых записей к существующим точкам
            try {
                await apiService.addPointRecord(pointData.pointId, newRecord, newRecord.file);
                // Обновляем записи точки
                const updatedRecords = await apiService.getPointRecords(pointData.pointId);
                
                // Обновляем материал меша, если нужно
                const mesh = scene.getMeshByName(`point_${pointData.pointId}`);
                if (mesh && newRecord.materialName) {
                    mesh.material = sceneManager.createMaterial(newRecord.materialName);
                    mesh.pointRecords = updatedRecords;
                }
            } catch (error) {
                console.error("Ошибка при добавлении записи:", error);
                alert("Не удалось добавить запись к точке.");
            }
        } else {
            console.warn('Callback не задан и информация о точке недоступна');
        }
    
        pointModal.style.display = 'none';
        resetInputs();
    };    
    
 
      const deleteRecord = async () => {
          if (!pointData?.pointId) return alert("id точки необходимо для удаления");
  
          try {
              await apiService.deletePoint(pointData.pointId);
              scene.getMeshByName(`point_${pointData.pointId}`)?.dispose();
              pointModal.style.display = 'none';
              resetInputs();
          } catch (error) {
              console.error("Ошибка удаления точки:", error);
              alert("Не удалось удалить точку. Попробуйте снова.");
          }
      };
  
      prevBtn.onclick = () => {
          if (currentRecordIndex > 0) updateRecordDisplay(currentRecords[--currentRecordIndex]);
      };
  
      nextBtn.onclick = () => {
          if (currentRecordIndex < currentRecords.length - 1) updateRecordDisplay(currentRecords[++currentRecordIndex]);
      };
  
      updateBtn.onclick = () => configureModalLayout('edit');
      deleteBtn.onclick = deleteRecord;
      addBtn.onclick = () => configureModalLayout('create');
  
      saveBtn.onclick = async () => {
          try {
              if (mode === 'edit') {
                  await updatePointRecord();
              } else if (mode === 'create') {
                  await createNewPointRecord();
              }
          } catch (err) {
              console.error('Ошибка сохранения:', err);
          }
          finally{
            controlsManager.unlock();
          }
      };
      
    if (pointModal && closePointModalBtn) {
        closePointModalBtn.addEventListener('click', () => {
            pointModal.style.display = 'none';
            controlsManager.unlock();
        });
    }
  
      if (pointRecord && pointData) {
          try {
              const response = await fetch(`${API_BASE_URL}/point/${pointData.pointId}/records`);
              currentRecords = await response.json();
              currentRecordIndex = currentRecords.findIndex(r => r.id === pointRecord.id) || 0;
              updateRecordDisplay(currentRecords[currentRecordIndex]);
          } catch (error) {
              console.error('Ошибка загрузки записей:', error);
          }
      }
  
      configureModalLayout(callback ? 'create' : 'view');
      pointModal.style.display = 'flex';
  }

    };