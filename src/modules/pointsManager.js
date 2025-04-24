import * as BABYLON from 'babylonjs';
import { apiService } from './apiService';
import { sceneManager } from './sceneManager';
import { controlsManager } from './controlsManager';

const materialInputs = document.querySelectorAll('input[name="material"]');
const dateInput = document.getElementById('date');
const infoInput = document.getElementById("infoInput");
const photoInput = document.getElementById("photoInput");

export const pointsManager = {
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

        point.material = latestRecord?.materialName ?
             sceneManager.createMaterial(latestRecord.materialName)
             :sceneManager.createDefaultMaterial();

        point.pointData = pointData;
        point.pointRecords = records;

        return point;

    },

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

    async createNewPoint(position) {
        let existingPoint = await apiService.checkExistingPoint(position);

        if(!existingPoint){
            const point = BABYLON.MeshBuilder.CreateSphere("point", {diameter:0.5}, scene);
            point.position = position;
            console.log(point.position);
         try {
            const createdPoint = await apiService.createPoint(point.position);
            const recordData = {
                info:infoInput.value,
                checkupDate:dateInput.value,
                materialName:Array.from(materialInputs).find(input => input.checked)?.value || null
            }
            const createdRecord = await apiService.addPointRecord(createdPoint.id,recordData, photoInput.files[0]);
            this.openModal();
        
        } catch (error) {
            console.error("Ошибка при создании:",error);
            point.dispose();
            controlsManager.unlock();
        }}
    },

    async openModal(callback, pointRecord, pointData) {
        controlsManager.lock();
    
        const el = {
          insert: document.getElementById("insert"),
          modal: document.getElementById("pointModal"),
          modalContent: document.getElementById("modal-content"),
          infoBlock: document.getElementById("info"),
          dateInput: document.getElementById("date"),
          infoInput: document.getElementById("infoInput"),
          photoInput: document.getElementById("photoInput"),
          materialInputs: document.querySelectorAll('input[name="material"]'),
          photoDisplay: document.getElementById("photoDisplay"),
          infoDisplay: document.getElementById("infoDisplay"),
          dateDisplay: document.getElementById('dateDisplay'),
          addBtn: document.getElementById('addBtn'),
          deleteBtn: document.getElementById('deleteBtn'),
          updateBtn: document.getElementById('updateBtn'),
          saveBtn: document.getElementById("saveBtn"),
          photoViewer: document.getElementById("photo-viewer"),
          prevBtn: document.getElementById("previosly"),
          nextBtn: document.getElementById("next")
        };
    
        let currentRecords = [];
        let currentRecordIndex = 0;
    
        function resetInputs() {
          el.photoInput.value = '';
          el.infoInput.value = '';
          el.dateInput.value = '';
          el.materialInputs.forEach(input => input.checked = false);
          el.photoDisplay.style.display = 'none';
          el.photoViewer.style.display = 'flex';
          el.infoDisplay.innerHTML = '';
          el.dateDisplay.innerHTML = '';
        }
    
        function configureModalLayout(isExistingPoint) {
          if (!isExistingPoint) {
            el.modalContent.style.height = '80vh';
            el.modalContent.style.width = '25vw';
            el.insert.style.display = 'none';
            el.updateBtn.style.display = 'inline-block';
            el.saveBtn.style.display = 'none';
            el.deleteBtn.style.display = 'inline-block';
            el.addBtn.style.display = 'inline-block';
            el.photoViewer.style.display = 'flex';
            el.infoBlock.style.display = 'block';
          } else {
            el.modalContent.style.height = '40vh';
            el.insert.style.display = 'block';
            el.addBtn.style.display = 'block';
            el.saveBtn.style.display = 'block';
            el.deleteBtn.style.display = 'none';
            el.infoDisplay.style.display = 'none';
            el.dateDisplay.style.display = 'none';
            el.photoDisplay.style.display = 'none';
            el.photoViewer.style.display = 'flex';
          }
        }
    
        function updateRecordDisplay(record) {
          el.photoDisplay.src = `http://localhost:9000${record.photoUrl}`;
          el.photoDisplay.style.display = 'block';
          el.infoDisplay.textContent = record.info || '';
          el.dateDisplay.textContent = `Дата осмотра: ${formatDate(record.checkupDate)}`;
    
          const selectedMaterial = Array.from(el.materialInputs).find(input => input.value === record.materialName);
          if (selectedMaterial) selectedMaterial.checked = true;
    
          el.prevBtn.classList.toggle('disabled', currentRecordIndex <= 0);
          el.nextBtn.classList.toggle('disabled', currentRecordIndex >= currentRecords.length - 1);
        }
    
        async function uploadPhotoFile(file) {
          const formData = new FormData();
          formData.append("file", file);
    
          const response = await fetch('http://localhost:5141/api/photos/upload', {
            method: "POST",
            body: formData
          });
    
          if (!response.ok) throw new Error("Ошибка при загрузке фото");
    
          const result = await response.json();
          return result.photoId;
        }
    
        async function updatePointRecord(photoId) {
          if (!pointRecord) return;
    
          pointRecord.info = el.infoInput.value;
          pointRecord.checkupDate = el.dateInput.value;
          pointRecord.materialName = Array.from(el.materialInputs).find(i => i.checked)?.value || null;
          if (photoId !== undefined) pointRecord.photoId = photoId;
    
          const response = await fetch(`http://localhost:5141/api/pointRecord/${pointRecord.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pointRecord)
          });
    
          if (!response.ok) throw new Error('Ошибка при обновлении');
    
          updateRecordDisplay(pointRecord);
          configureModalLayout(true);
        }
    
        async function saveNewPointRecord() {
          if (!formValidator.validateForm(el.materialInputs, el.photoInput, el.infoInput, el.dateInput)) return;
    
          let photoId = null;
          const file = el.photoInput.files[0];
          if (file) {
            try {
              photoId = await uploadPhotoFile(file);
            } catch (err) {
              showError("Не удалось загрузить фото");
              return;
            }
          }
    
          const newRecord = {
            info: el.infoInput.value,
            checkupDate: el.dateInput.value,
            materialName: Array.from(el.materialInputs).find(i => i.checked)?.value || null,
            photoId,
            buildingId: selectedBuildingId
          };
    
          if (typeof callback === 'function') {
            await callback(newRecord);
          } else if (pointData && pointData.pointId) {
            const response = await fetch(`http://localhost:5141/api/point/${pointData.pointId}/records`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newRecord)
            });
            if (!response.ok) throw new Error('Ошибка при сохранении записи');
          }
    
          el.modal.style.display = 'none';
          resetInputs();
        }
    
        el.saveBtn.onclick = saveNewPointRecord;
    
        el.updateBtn.onclick = () => {
          configureModalLayout(false);
          el.saveBtn.onclick = async () => {
            const file = el.photoInput.files[0];
            const photoId = file ? await uploadPhotoFile(file) : null;
            await updatePointRecord(photoId);
          };
        };
    
        el.deleteBtn.onclick = async () => {
          if (!pointData?.pointId) return;
    
          try {
            await deletePoint(pointData.pointId);
            const mesh = scene.getMeshByName(`point_${pointData.pointId}`);
            if (mesh) scene.removeMesh(mesh);
            el.modal.style.display = 'none';
            resetInputs();
          } catch (err) {
            showError("Не удалось удалить точку");
          }
        };
    
        el.addBtn.onclick = () => {
          if (!pointData?.pointId) return;
          resetInputs();
          configureModalLayout(false);
          el.saveBtn.onclick = () => addNewPointRecord(pointData.pointId);
        };
    
        el.prevBtn.onclick = () => {
          if (currentRecordIndex > 0) updateRecordDisplay(currentRecords[--currentRecordIndex]);
        };
    
        el.nextBtn.onclick = () => {
          if (currentRecordIndex < currentRecords.length - 1) updateRecordDisplay(currentRecords[++currentRecordIndex]);
        };
    
        formValidator.setupFormListeners(
          [el.photoInput, el.infoInput, el.dateInput],
          el.materialInputs
        );
    
        resetInputs();

const isNewPoint = !pointRecord;
configureModalLayout(isNewPoint);

if (!isNewPoint && pointData?.pointId) {
  try {
    const response = await fetch(`http://localhost:5141/api/point/${pointData.pointId}/records`);
    if (!response.ok) throw new Error('Не удалось загрузить записи');
    currentRecords = await response.json();

    if (currentRecords.length > 0) {
      currentRecordIndex = currentRecords.findIndex(r => r.id === pointRecord.id) || 0;
      updateRecordDisplay(currentRecords[currentRecordIndex]);
      configureModalLayout(false); // Сменить layout на просмотр после загрузки
    } else {
      configureModalLayout(true); // Показать форму для добавления
    }
  } catch (err) {
    console.error('Ошибка загрузки записей:', err);
    configureModalLayout(true); // fallback
  }
}

    
        el.modal.style.display = 'flex';
      }
    };