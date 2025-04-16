/**
 * Импорт необходимых библиотек
 */
import * as BABYLON from 'babylonjs';
import "@babylonjs/loaders/glTF";
import 'babylonjs-loaders'
import {convertRatioToExpression,GetDistance,calculateDistance, formatDate} from "./functions";
import {buildingsList, fetchAllBuildings,selectedBuildingId} from"./buildingSelect";
import {fetchAllFormats} from "./formatSelect";
import { showLoadingScreen } from './loadingScreen';
import { KEYMAP } from './keymap';
import { showError } from './showError';
import {MIN_BOUNDARY, MAX_BOUNDARY, DEFAULT_FORMAT, DEFAULT_FOV_ANGLE, API_BASE_URL, MINIO_URL} from './constants'

/**
 * Переменные
 */
let divFps = document.getElementById("fps");
let droneMesh ;
let visibilityAngel = 72;
let visibilityFormat = convertRatioToExpression('1:1');
let FOV = BABYLON.Tools.ToRadians(visibilityAngel);
let isControlsBlocked = false;
let currentModel;
const errorMessage = document.getElementById('errorMessage');

function lockControls(){
    isControlsBlocked = true;

    Object.keys(scene.inputStates).forEach(k => scene.inputStates[k] = false);
  }

  function unlockControls(){
    isControlsBlocked = false;
  }

document.addEventListener("DOMContentLoaded",showLoadingScreen);


const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
/**
 * Функция создания сцены
 * @returns Сцена
 */
const createScene = function(){
    const scene = new BABYLON.Scene(engine);

/**
 * Создание и настройка Камеры
 */
  //const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/2,Math.PI/2, 5,new BABYLON.Vector3() , scene);
    const camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(),scene,droneMesh);
    camera.attachControl(true);
    camera.upperBetaLimit = Math.PI / 2.2;
    camera.radius = 5; 
    camera.heightOffset = 3; 
    camera.rotationOffset = 180; 

/**
 * Создание и настройка Плоскости области видимости
 */
    let planeWidth = 0.1;
    let planeHeight = 0.1;
    const visibilityPlane = BABYLON.MeshBuilder.CreatePlane("plane", { width: planeWidth, height: planeHeight, updatable:true}, scene);
    const greenMaterial = new BABYLON.StandardMaterial("greenMaterial", scene);
    visibilityPlane.visibility = 0;
    greenMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
    visibilityPlane.material = greenMaterial;
    visibilityPlane.material.alpha = 0.5;

 /**
  * Создание и настройка Света
  */
    const  light = new BABYLON.HemisphericLight("light",new BABYLON.Vector3(0,1,0),scene);
    light.intensity = 0.5;
    light.groundColor = new BABYLON.Color3(0,0,1);
    scene.clearColor = BABYLON.Color3.Black();

/**
 * Создание и настройка Скайбоксов
 */
    const  skyboxMaterial = new BABYLON.StandardMaterial('skyboxMaterial',scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.specularColor = BABYLON.Color3.Black();
    skyboxMaterial.diffuseColor = BABYLON.Color3.Black();
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('http://localhost:9000/assets/images/skybox/sky',scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    const  skybox = BABYLON.MeshBuilder.CreateBox('skybox',{
        size:500
    },scene)
    skybox.material = skyboxMaterial;

/**
 * Создание и настройка Плоскости Земли
 */
    let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 500, height: 500 });
    let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("http://localhost:9000/assets/images/ground/123.jpg", scene);
    ground.material = groundMaterial;


/**
 * Создание, загрузка и настройка модели БПЛА
 */
         BABYLON.SceneLoader.ImportMesh("", "http://localhost:9000/assets/models/","drone.glb", scene, function (newMeshes) {

        droneMesh = newMeshes[0];

        droneMesh.rotationQuaternion = null;

        droneMesh.position.y = 2;
        droneMesh.position.x = -10;
        droneMesh.position.z = 0;

        droneMesh.scaling.z = 0.1;
        droneMesh.scaling.x = 0.1;
        droneMesh.scaling.y = 0.1;

        camera.parent = droneMesh;
    
        let movingSpeed = 0.3;
        let rotationSpeed = 0.02;
        let movingDirection = new BABYLON.Vector3(0, 0, 1);

        /** 
         * Блок для настройки движения БПЛА
         */
          scene.inputStates = Object.fromEntries(
            [...new Set(Object.values(KEYMAP))].map(k => [k, false])
          );
          
          const handleKeyEvent = (event, isPressed) => {
            if (isControlsBlocked) return;
            const action = KEYMAP[event.code];
            if (action) {
              scene.inputStates[action] = isPressed;
              
              if (['Space', 'ControlLeft'].includes(event.code)) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          };
          
          window.addEventListener('keydown', e => handleKeyEvent(e, true));
          window.addEventListener('keyup', e => handleKeyEvent(e, false));
          
          scene.onBeforeRenderObservable.add(() => {
            if (droneMesh.position.y < 1) { 
                console.log("Нельзя опуститься ниже земли");
                droneMesh.position.y = 1;
            }
            const minBoundary = -250; // половина размера skybox
            const maxBoundary = 250;
        
            droneMesh.position.x = BABYLON.Scalar.Clamp(droneMesh.position.x, minBoundary+1, maxBoundary-1);
            droneMesh.position.y = BABYLON.Scalar.Clamp(droneMesh.position.y, minBoundary+1, maxBoundary-1);
            droneMesh.position.z = BABYLON.Scalar.Clamp(droneMesh.position.z, minBoundary+1, maxBoundary-1);
            if (isControlsBlocked) return;
            const {inputStates} = scene;
            const {rotation, position} = droneMesh;
            
            if (inputStates.rotateLeft || inputStates.rotateRight) {
              const angle = rotationSpeed * (inputStates.rotateLeft ? -1 : 1);
              rotation.y += angle;
              movingDirection = BABYLON.Vector3.TransformCoordinates(
                movingDirection, 
                BABYLON.Matrix.RotationY(angle)
              );
            }
          
            const MOVE_FORWARD_VECTOR = new BABYLON.Vector3(
              movingDirection.x, 
              0, 
              movingDirection.z
            ).normalize();
            
            const RIGHT = new BABYLON.Vector3(-MOVE_FORWARD_VECTOR.z, 0, MOVE_FORWARD_VECTOR.x);
            const movement = BABYLON.Vector3.Zero();
          
            if (inputStates.forward) movement.addInPlace(MOVE_FORWARD_VECTOR);
            if (inputStates.backward) movement.subtractInPlace(MOVE_FORWARD_VECTOR);
            if (inputStates.left) movement.addInPlace(RIGHT);
            if (inputStates.right) movement.subtractInPlace(RIGHT);
            
            if (inputStates.ascend) movement.y += 1;
            if (inputStates.descend) movement.y -= 1;
          
            if (!movement.equalsToFloats(0, 0, 0)) {
              position.addInPlace(movement.scale(movingSpeed));
            }
          });

        let distanceValue;
        let outputDistanseElement = document.getElementById('distance');
        let dronePosition =  droneMesh.position.clone();

        /**
         * Функция для обработки действий во время Рендеринга
         */
        scene.registerBeforeRender(function (){
            divFps.innerText = engine.getFps().toFixed() + " fps";
                dronePosition =  droneMesh.position.clone();
                let forwardVector = new BABYLON.Vector3(0, 0, 1); 
                let rotatedForwardVector = BABYLON.Vector3.TransformNormal(forwardVector, droneMesh.getWorldMatrix());
                let pickRay = new BABYLON.Ray(dronePosition, rotatedForwardVector, 600);
                let hit = scene.pickWithRay(pickRay);

                if (hit.pickedMesh && hit.pickedMesh !== visibilityPlane) {
                     distanceValue = BABYLON.Vector3.Distance(droneMesh.position,hit.pickedPoint);
                    visibilityPlane.scaling.y = 2 * distanceValue * Math.tan(FOV/2); 
                     if (visibilityFormat === 1){
                         visibilityPlane.scaling.x = visibilityPlane.scaling.y;   
                     }
                     else {
                         visibilityPlane.scaling.x =  visibilityPlane.scaling.y * (visibilityFormat);
                     }
                    visibilityPlane.visibility = 1;
                    visibilityPlane.position = hit.pickedPoint;
                    visibilityPlane.rotation.y = droneMesh.rotation.y;
                    GetDistance(outputDistanseElement, distanceValue);
                   
                }
                else {
                    visibilityPlane.visibility = 0;
                }
               
        })
    });

/**
 * Функция создания точки
 * @param {*} position Координаты для создания
 */
const createPoint = async (position) => {
    let existingPoint = await checkExistingPoint(position);

    if (!existingPoint) {
        const point = BABYLON.MeshBuilder.CreateSphere("point", { diameter: 0.5 }, scene);
        point.position = position;

        openModalforPoint(async () => {
            lockControls();
            try {
                // Создание данных для точки
                const pointData = {
                    buildingId: selectedBuildingId,
                    position: position.asArray()
                };

                // Сначала создаем точку
                const pointResponse = await fetch('http://localhost:5141/api/point', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pointData)
                });

                if (!pointResponse.ok) throw new Error('Не удалось создать точку');

                const createdPoint = await pointResponse.json();

                // Создание записи для точки
                const createdRecord = await addNewPointRecord(createdPoint.id);

               // console.log('Точка создана:', createdPoint);
               // console.log('Запись точки создана:', createdRecord);

                unlockControls();
            } catch (error) {
                console.error('Ошибка при создании:', error);
                point.dispose();
                unlockControls();
            }
        }, null, null);

    } else {
        openModalForExisting(existingPoint);
    }
};


/**
 * Функция для проверки существует ли точка по близости
 * @param {*} position Координаты нажатия
 */
async function checkExistingPoint(position) {
    const response = await fetch(`http://localhost:5141/api/points?x=${position.x}&y=${position.y}&z=${position.z}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        console.error('Ошибка при проверке существующих точек:', response.statusText);
        return true;
    }

    const existingPoints = await response.json();
    return existingPoints.some(existingPoint => {
        const distance = calculateDistance(existingPoint.position, position.asArray());
        return distance < 0.5;
    });
}
   
    /**
     * Функция Удаления Точки из базы
     * @param {*} pointId id Удаляемой точки
     */
    async function deletePoint(pointId) {
        try {
            const response = await fetch(`http://localhost:5141/api/point/${pointId}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                removePointFromScene(pointId); 
            } else {
                console.error(`Не удалось удалить точку с ID: ${pointId}. Статус: ${response.status}`);
            }
        } catch (error) {
            console.error('Ошибка во время удаления:', error);
        }
    }
    
    /**
     * Функция удаления Точки со Сцены
     * @param {*} pointId id Удаляемой точки
     */
    function removePointFromScene(pointId) {
        const pointMesh = scene.meshes.find(mesh => mesh.id === `point_${pointId}`);
        if (pointMesh) {
            scene.removeMesh(pointMesh);
            console.log(` Точка с  ID ${pointId} удалена со сцены.`);
        } else {
            console.warn(` Точка с ID ${pointId} не найдена на сцене.`);
        }
    }

    /**
     * Функция работы с существующей точкой
     * @param {*} selectedPointId id Выбранной точки
     */
    function onPointSelected(selectedPointId) {
        const selectedMesh = scene.getMeshByName(`point_${selectedPointId}`);
    
        if (selectedMesh && selectedMesh.pointData && selectedMesh.pointRecords) {
            openModalForExisting(selectedMesh.pointData, selectedMesh.pointRecords);
        } else {
   
            fetch(`http://localhost:5141/api/point/${selectedPointId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Ошибка получения данных: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(pointData => {
                    if (!pointData) {
                        console.warn(`Данные точки с id: ${selectedPointId} не найдены`);
                        return;
                    }
    

                    fetch(`http://localhost:5141/api/point/${selectedPointId}/records`)
                        .then(recordResponse => {
                            if (!recordResponse.ok) {
                                throw new Error(`Проблемы при получении записи: ${recordResponse.statusText}`);
                            }
                            return recordResponse.json();
                        })
                        .then(recordsData => {
                            if (selectedMesh) {
                                selectedMesh.pointData = pointData;
                                selectedMesh.pointRecords = recordsData;
                            }
    
                            // Open modal with both point and records data
                            openModalForExisting(pointData, recordsData);
                        })
                        .catch(error => console.error(" Ошибка получения записи:", error));
                })
                .catch(error => console.error(" Ошибка получения данных точки:", error));
        }}
    
/**
 * Функция обработки нажатия курсором на сцену
*/
// TODO: Сделать так, чтобы нормально обрабатывались только нажатия на модель здания 
scene.onPointerDown = () => {
    const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
    const pickedMesh = pickInfo.pickedMesh;
    if (pickedMesh && pickedMesh.name.startsWith("point_")) {
        const selectedPointId = pickedMesh.name.replace("point_", "");
        onPointSelected(selectedPointId); 
    }
    else if (pickInfo.hit && pickedMesh.name !=="ground" && pickedMesh.name !=="skybox" && !pickedMesh.name.startsWith("point_") && pickedMesh.name !=="Object_2" ) {
        createPoint(pickInfo.pickedPoint);
    }
};

/**
 * Загрузка элемента с информацией о здании
 */
document.addEventListener('DOMContentLoaded', () => {
    const aboutBuildingDiv = document.getElementById('aboutBuilding');

    if (!aboutBuildingDiv) {
        console.error("Элемент aboutBuilding не найден в DOM.");
        return;
    }

    
    aboutBuildingDiv.addEventListener('click', () => {
        if(currentModel != undefined){
        openInfoModal();
    }
    });
});

/**
 * Загрузка информации о здании
 * @returns Информация о здании
 */
async function loadBuildingInfo() {
    try {
        const response = await fetch(`http://localhost:5141/api/buildingInfo/byBuilding/${selectedBuildingId}`);
        if (!response.ok) throw new Error('Не удалось загрузить данные здания');
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

/**
 * Открытие модального окна с информацией о здании
 */
async function openInfoModal() {
    lockControls();
    const infoModal = document.getElementById('infoModal');
    const modalContent = document.getElementById('infoModal-content');
    const projectNameInput = document.getElementById('project_name');
    const projectAddressInput = document.getElementById('project_adress');
    const buildingInfoBlock = document.getElementById('building_info_container');
    const saveButton = document.getElementById('infoModal_saveBtn');
    const deleteButton = document.getElementById('infoModal_deleteBtn');
    const updateButton = document.getElementById('infoModal_updateBtn');
    const closeInfoModalBtn = document.querySelector('#infoModal .close');
    const buildingInfoDisplay = document.getElementById('buildingInfoDisplay');
    const projectNameDisplay = document.getElementById('buildingInfoDisplay_project_name');
    const projectAddressDisplay = document.getElementById('buildingInfoDisplay_project_adress');

    let isEditing = false; 
    let currentRecordId = null; 

    if (!infoModal || !modalContent) {
        console.error("Не удалось найти модальное окно или его содержимое.");
        return;
    }

    /**
     * Сборс полей
     */
    function resetInputs() {
        projectNameInput.value = '';
        projectAddressInput.value = '';
    }

    /**
     * Переключения режима модального окна в режим редактирования
     */
    function switchToEditMode() {
        isEditing = true;
        buildingInfoDisplay.style.display = 'none';
        buildingInfoBlock.style.display = 'flex';
        saveButton.style.display = 'inline-block';
        deleteButton.style.display = 'none';
        updateButton.style.display = 'none';
    }

    /**
     * Переключение режима модального окна в режим просмотра
     */
    function switchToViewMode() {
        isEditing = false;
        buildingInfoDisplay.style.display = 'block';
        buildingInfoBlock.style.display = 'none';
        saveButton.style.display = 'none';
        deleteButton.style.display = 'inline-block';
        updateButton.style.display = 'inline-block';
        projectNameDisplay.style.display = `block`;
        projectAddressDisplay.style.display = `block`;
    }

    
    const buildingData = await loadBuildingInfo();

    if (buildingData) {
        
        currentRecordId = buildingData.id;
        projectNameInput.value = buildingData.projectName || '';
        projectAddressInput.value = buildingData.areaAdress || '';

        projectNameDisplay.textContent = `Наименование проекта: ${buildingData.projectName}`;
        projectAddressDisplay.textContent = `Адрес участка: ${buildingData.areaAdress}`;

        switchToViewMode();

        updateButton.onclick = () => {
            switchToEditMode();
        };

        deleteButton.onclick = () => deleteBuildingInfo(currentRecordId);
    } else {
    
        resetInputs();
        currentRecordId = null;
        switchToEditMode();
    }

    infoModal.style.display = 'flex';
    modalContent.style.height = '40vh';
    modalContent.style.width = '20vw';

    /**
     * Функция сохранения информации о здании
     */
    async function saveBuildingInfo() {
        const newRecord = {
            id:currentRecordId, 
            projectName: projectNameInput.value,
            areaAdress: projectAddressInput.value,
            buildingId: selectedBuildingId,
        };

        try {
            let response;
            if (isEditing && currentRecordId) {
                response = await fetch(`http://localhost:5141/api/buildingInfo/${currentRecordId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newRecord),
                });

                if (!response.ok) throw new Error('Не удалось обновить запись');
                console.log('Запись успешно обновлена');

            } else {
                // Создание новой записи
                response = await fetch(`http://localhost:5141/api/buildingInfo`, {
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
            unlockControls();
        }
    }

   /**
    * Удаление информации о здании
    * @param {*} recordId id Записи
    */
    async function deleteBuildingInfo(recordId) {
        try {
            const response = await fetch(`http://localhost:5141/api/buildingInfo/${recordId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Не удалось удалить запись');
            console.log('Запись успешно удалена');

            infoModal.style.display = 'none';
        } catch (error) {
            console.error('Ошибка удаления записи:', error);
        }
        finally {
            unlockControls();
          }
    }

    saveButton.onclick = saveBuildingInfo;

    if (closeInfoModalBtn) {
        closeInfoModalBtn.onclick = () => {
            infoModal.style.display = 'none';
            unlockControls();
        };
    }
}

/**
 * Функция открытия модального окна для точки
 * @param {*} callback callback-функция
 * @param {*} pointData Данные точки
 */
function openModalforPoint(callback, pointRecord, pointData) {
    lockControls();
    const insert = document.getElementById("insert");
    const pointModal = document.getElementById("pointModal");
    const modalContent = document.getElementById("modal-content");
    const infoBlock = document.getElementById('info');
    const dateInput = document.getElementById('date');
    const infoInput = document.getElementById("infoInput");
    const photoInput = document.getElementById("photoInput");
    const materialInputs = document.querySelectorAll('input[name="material"]');
    const photoDisplay = document.getElementById("photoDisplay");
    const infoDisplay = document.getElementById("infoDisplay");
    const dateDisplay = document.getElementById('dateDisplay');
    const addBtn = document.getElementById('addBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const updateBtn = document.getElementById('updateBtn');
    const saveBtn = document.getElementById("saveBtn");
    const photoViewer = document.getElementById("photo-viewer");
    const prevBtn = document.getElementById("previosly");
    const nextBtn = document.getElementById("next");

    let currentRecords = [];
    let currentRecordIndex = 0;

    function validateForm() {
        let isValid = true;
        const errors = [];
        
        const materialSelected = Array.from(materialInputs).some(input => input.checked);
        if (!materialSelected) {
          errors.push('Выберите степень повреждения');
          document.querySelector('.color').classList.add('invalid-border');
        } else {
          document.querySelector('.color').classList.remove('invalid-border');
        }
      
        const fields = [
          {element: photoInput, error: 'Загрузите фотографию', condition: () => !photoInput.files.length},
          {element: infoInput, error: 'Введите описание', condition: () => !infoInput.value.trim()},
          {element: dateInput, error: 'Укажите дату', condition: () => !dateInput.value}
        ];
      
        fields.forEach(({element, error, condition}) => {
          if (condition()) {
            errors.push(error);
            element.classList.add('invalid');
            isValid = false;
          } else {
            element.classList.remove('invalid');
          }
        });
      
        if (errors.length > 0) {
          showError(errors[0]);
          const firstErrorElement = [materialInputs[0].parentElement, photoInput, infoInput, dateInput]
            .find(el => el.classList.contains('invalid') || el.classList.contains('invalid-border'));
          
          firstErrorElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      
        return isValid;
      }

    /**
     * Обновление информации о записи
     * @param {*} record Записи
     */
    function updateRecordDisplay(record) {
        photoDisplay.src = `http://localhost:9000${record.photoUrl}`
        photoDisplay.style.display = "block";
        photoDisplay.style.height = "40vh";
        photoDisplay.style.width = "20vw";
        photoViewer.style.display = "flex";

        infoDisplay.innerHTML = record.info || '';
        infoDisplay.style.display = 'block';

        dateDisplay.innerHTML = `Дата осмотра: ${formatDate(record.checkupDate)}`;
        dateDisplay.style.display = 'block';

        const selectedMaterial = Array.from(materialInputs)
            .find(input => input.value === record.materialName);
        if (selectedMaterial) {
            selectedMaterial.checked = true;
        }

    if (currentRecordIndex > 0) {
        prevBtn.classList.remove('disabled');
    } else {
       prevBtn.classList.add('disabled');
    }

    if (currentRecordIndex < currentRecords.length - 1) {
        nextBtn.classList.remove('disabled');
    } else {
        nextBtn.classList.add('disabled');
    }
    }

    prevBtn.onclick = () => {
        if (!prevBtn.classList.contains('disabled')) {
            currentRecordIndex--;
            updateRecordDisplay(currentRecords[currentRecordIndex]);
        }
    };
    
    nextBtn.onclick = () => {
        if (!nextBtn.classList.contains('disabled')) {
            currentRecordIndex++;
            updateRecordDisplay(currentRecords[currentRecordIndex]);
        }
    };
    

   /**
    * Сброс полей
    */
    function resetInputs() {
        photoInput.value = '';
        infoInput.value = '';
        dateInput.value = '';
        materialInputs.forEach(input => input.checked = false);
        photoDisplay.src = ``;
        photoDisplay.style.display = 'none';
        photoDisplay.style.height = "40vh";
        photoDisplay.style.width = "20vw";
        photoViewer.style.display = 'flex';
        infoDisplay.innerHTML = '';
        dateDisplay.innerHTML = '';
    }
    resetInputs();

    /**
     * Настройка внешнего вида модального окна
     * @param {*} isExistingPoint Существует ли точка
     */
    function configureModalLayout(isExistingPoint) {
        if (isExistingPoint) {
            modalContent.style.height = '80vh';
            modalContent.style.width = '25vw';
            modalContent.style.paddingBottom = '15px';
            insert.style.display = 'none';
            updateBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
            deleteBtn.style.display = 'inline-block';
            addBtn.style.display = 'inline-block';

            if (pointRecord) {

                    photoDisplay.src = `http://localhost:9000${pointRecord.photoUrl}`;
                    photoDisplay.style.display = 'block';
                    photoDisplay.style.height = "40vh";
                    photoDisplay.style.width = "20vw";
                    photoViewer.style.display = 'flex';

                    infoDisplay.innerText = pointRecord.info;
                    infoDisplay.style.display = 'block';

                    dateDisplay.innerText = `Дата осмотра: ${formatDate(pointRecord.checkupDate)}`;
                    dateDisplay.style.display = 'block';

                    const selectedMaterial = Array.from(materialInputs)
                        .find(input => input.value === pointRecord.materialName);
                    if (selectedMaterial) {
                        selectedMaterial.checked = true;
                    }

                infoInput.value = pointRecord.info || '';
                dateInput.value = pointRecord.checkupDate || '';
            }
        } else {
            modalContent.style.height = "40vh";
            updateBtn.style.display = 'none';
            insert.style.display = 'block';
            addBtn.style.display = 'block';
            saveBtn.style.display = 'block';
            deleteBtn.style.display = 'none';
            infoDisplay.style.display = 'none';
            dateDisplay.style.display = 'none';
            photoDisplay.src = ``;
            photoDisplay.style.display = 'none';
            photoDisplay.style.height = "40vh";
            photoDisplay.style.width = "20vw";
            photoViewer.style.display = 'flex';
        }
    }
    configureModalLayout(callback === null);

    if (pointRecord && pointData) {
        fetch(`http://localhost:5141/api/point/${pointData.pointId}/records`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Не удалось получить записи точки');
                }
                return response.json();
            })
            .then(records => {
                currentRecords = records;
                currentRecordIndex = records.findIndex(r => r.id === pointRecord.id);
                
                if (currentRecordIndex === -1) {
                    currentRecordIndex = 0;
                }

                updateRecordDisplay(currentRecords[currentRecordIndex]);
            })
            .catch(error => {
                console.error('Ошибка при получении записей:', error);
            });
    }

    /**
     * Загружает файл на сервер и возвращает идентификатор фото
     * @param {File} file Файл для загрузки
     * @returns {Promise<string>} Id загруженного фото
     */
    async function uploadPhotoFile(file) {
        const formData = new FormData();
        formData.append("file",file);

        const response = await fetch('http://localhost:5141/api/photos/upload', {
            method: "POST",
            body: formData
        });

        if(!response.ok){
            throw new Error ("Ошибка при загрузке фото");
        }

        const result = await response.json();
        return result.photoId;
    }

    /**
     * Создание записи
     * @param {*} pointId id Точки
     */
    async function addNewPointRecord(pointId) {
        const materialInputs = document.querySelectorAll('input[name="material"]');
        const file = photoInput.files[0];
        const formData = new FormData();

        if(file){
            try{
                formData.append("photoFile", file);
            } catch (error){
                console.error("Ошибка загрузки фото:", error);

                return;
            }
        }
    
        formData.append("PointId",pointId);
        formData.append("Info",info);
        formData.append("MaterialName",Array.from(materialInputs).find(input=>input.checked)?.value || "");
        formData.append("CheckupDate",dateInput.value);
        formData.append("BuildingId",selectedBuildingId);
        console.log("PointId:", pointId);


        try {
            const response = await fetch(`http://localhost:5141/api/point/${pointId}/records`, {
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                throw new Error('Не удалось добавить новую запись');
            }
    
            const createdRecord = await response.json();
            console.log('Новая запись добавлена:', createdRecord);
    
            resetInputs();
            
            insert.style.display = 'none';
            infoBlock.style.display = 'block';
            modalContent.style.height = '80vh';
            saveBtn.style.display = 'inline-block';
            updateBtn.style.display = 'inline-block';
            addBtn.style.display = 'inline-block';
    
        } catch (error) {
            console.error('Ошибка при добавлении новой записи:', error);
            alert('Не удалось добавить новую запись. Пожалуйста, попробуйте снова.');
        } finally {
            unlockControls();
          }
    }

/**
 * Обновление существующей записи
 * @param {string|null} photoId ID фотографии (null если фото не менялось)
 * @returns 
 */
async function updatePointRecord(photoId) {
    if (!pointRecord) {
        console.error('Нет точки для обновления');
        return;
    }

    pointRecord.info = infoInput.value;
    pointRecord.checkupDate = dateInput.value;
    pointRecord.materialName = Array.from(materialInputs).find(input => input.checked)?.value || null;
    if(photoId !== undefined){
        pointRecord.photoId = photoId;
    }

    try {
        const response = await fetch(`http://localhost:5141/api/pointRecord/${pointRecord.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pointRecord)
        });

        if (!response.ok) {
            throw new Error('Failed to update point record');
        }

        if(photoRecord.photoId){
            photoDisplay.src = `http://localhost:9000${pointRecord.photoUrl}`;
            photoDisplay.style.display = 'flex';
            photoDisplay.style.height = "40vh";
            photoDisplay.style.width = "20vw";
        } else {
            photoDisplay.src = '';
            photoDisplay.style.display = 'none';
            photoDisplay.style.height = "40vh";
            photoDisplay.style.width = "20vw";
        }

        photoViewer.style.display = 'flex';

        infoDisplay.innerText = pointRecord.info;
        infoDisplay.style.display = 'block';

        dateDisplay.innerText = `Дата осмотра: ${formatDate(pointRecord.checkupDate)}`;
        dateDisplay.style.display = 'block';

        insert.style.display = 'none';
        infoBlock.style.display = 'block';
        photoViewer.style.display = 'flex';
        modalContent.style.height = '80vh';
        saveBtn.style.display = 'inline-block';
        updateBtn.style.display = 'none';
        deleteBtn.style.display = 'inline-block';
        addBtn.style.display = 'block';

        console.log('Запись точки успешно обновлена');
    } catch (error) {
        console.error('Ошибка при обновления записи точки:', error);
        alert('Не удалось обновить данные записи. Пожалуйста, попробуйте ещё раз.');
    } finally {
        unlockControls();
      }
    
}

updateBtn.onclick = () => {
    modalContent.style.height = "30vh";
    insert.style.display = 'block';
    infoBlock.style.display = 'none';
    
    infoDisplay.style.display = 'none';
    dateDisplay.style.display = 'none';
    photoDisplay.style.display = 'none';
    photoViewer.style.display = 'flex';

    saveBtn.style.display = 'inline-block';
    deleteBtn.style.display = 'none';

    saveBtn.onclick = async () => {
        const file = photoInput.files[0];
        if (file) {
           try{
            const photoId = await uploadPhotoFile(file);
            await updatePointRecord(photoId);
           } catch(error) {
            console.error('Ошибка загрузки фото:',error);
           }
        } else {
            await updatePointRecord(null);
        }
    };
};

    deleteBtn.onclick = async () => {
        if (pointData && pointData.pointId) {
            try {
                
                await deletePoint(pointData.pointId);
    
                
                pointModal.style.display = 'none';
    
                
                const pointMesh = scene.getMeshByName(`point_${pointData.pointId}`);
                if (pointMesh) {
                    scene.removeMesh(pointMesh);
                }
    
                console.log("Точка успешно удалена.");
                resetInputs();
            } catch (error) {
                console.error("Ошибка удаления точки:", error);
                alert("Не удалось удалить точку. Пожалуйста, попробуйте ещё раз.");
            }
        } else {
            console.error("Точка с таким id не найдена.");
            alert("id точки необходимо для удаления");
        }
    };

    saveBtn.onclick = async () => {
        if (!validateForm()) return;
        
        const file = photoInput.files[0];
        let photoId = null;
    
        if (file) {
            try {
                photoId = await uploadPhotoFile(file);
            } catch (error) {
                console.error('Ошибка загрузки фото:', error);
                alert('Не удалось загрузить фото. Пожалуйста, попробуйте еще раз.');
                return; // Прерываем выполнение при ошибке загрузки
            }
        }
    
        const newRecord = {
            info: infoInput.value,
            checkupDate: dateInput.value,
            materialName: Array.from(materialInputs).find(input => input.checked)?.value || null,
            photoId: photoId,  // Изменил photoData на photoId для согласованности
            buildingId: selectedBuildingId
        };
    
        try {
            if (typeof callback === 'function') {
                await callback(newRecord);
            } else {
                // Вариант 2: Отправка на сервер напрямую, если callback не предоставлен
                const response = await fetch('http://localhost:5141/api/point/{pointId}/records', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newRecord)
                });
    
                if (!response.ok) {
                    throw new Error('Ошибка при сохранении записи');
                }
    
                const result = await response.json();
                console.log('Запись сохранена:', result);
            }
    
            pointModal.style.display = 'none';
            resetInputs();
            
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
            alert('Не удалось сохранить запись. Пожалуйста, попробуйте еще раз.');
        }
    };

    addBtn.onclick = async () => {

      if(pointData && pointData.pointId){
        resetInputs();

        modalContent.style.height = "30vh";
        insert.style.display = "block";
        infoBlock.style.display = "none";

        saveBtn.style.display = "none";
        saveBtn.onclick = () => addNewPointRecord(pointData.pointId);

        updateBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
        addBtn.style.display = 'inline-block';
      }
    }

  [photoInput, infoInput, dateInput].forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('invalid');
      errorMessage.classList.remove('visible');
    });
  });

  materialInputs.forEach(input => {
    input.addEventListener('change', () => {
      document.querySelector('.color').classList.remove('invalid-border');
      errorMessage.classList.remove('visible');
    });
  });

    pointModal.style.display = 'flex';
}

/**
 * Функция открытия модального окна для существующих точек
 * @param {Object} existingPoint Данные точки
 * @param {Object} records Связанные записи
 */
async function openModalForExisting(existingPoint, addRecordCallback) {
    if (!existingPoint || !existingPoint.id) {
        console.error('Invalid existing point data');
        return;
    }

    try {
        const pointData = {
            pointId: existingPoint.id
        };

        const recordResponse = await fetch(`http://localhost:5141/api/point/${pointData.pointId}/records`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!recordResponse.ok) {
            throw new Error('Не удалось получить записи точки');
        }

        const recordData = await recordResponse.json();

        if (recordData.length > 0) {

            openModalforPoint(null, recordData[0], pointData);
        } else {
            openModalforPoint(addRecordCallback, null, pointData);
        }

    } catch (error) {
        console.error('Ошибка при получении записей точки:', error);
        alert('Не удалось загрузить данные точки');
    }
}

    /**
     * Функция создания материала точки
     * @param {*} materialName название материала точки
     * @returns Созданный материал
     */
    function createMaterial(materialName) {
        let material;
        switch (materialName) {
            case 'green':
                material = new BABYLON.StandardMaterial('material1', scene);
                material.diffuseColor = new BABYLON.Color3(0, 1, 0);
                break;
            case 'yellow':
                material = new BABYLON.StandardMaterial('material2', scene);
                material.diffuseColor = new BABYLON.Color3(1, 1, 0);
                break;
            case 'red':
                material = new BABYLON.StandardMaterial('material3', scene);
                material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                break;
            default:
                material = new BABYLON.StandardMaterial('defaultMaterial', scene);
                material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                break;
        }
        return material;
    }
    
    const closePointModalBtn = document.querySelector('#pointModal .close');
    if (pointModal && closePointModalBtn) {
        closePointModalBtn.addEventListener('click', () => {
            pointModal.style.display = 'none';
            unlockControls()
        });
    }



    /**
     * Функция загрузки точек на сцену
     */
    async function loadPoints() {
        try {
            console.log("Загрузка точек для здания:", selectedBuildingId);
            
            const pointsResponse = await fetch(`http://localhost:5141/api/points/byBuilding/${selectedBuildingId}`);
            if (!pointsResponse.ok) throw new Error('Не удалось загрузить точки');
            
            const pointsData = await pointsResponse.json();
            
            const pointRecordsPromises = pointsData.map(async (pointData) => {
                const recordsResponse = await fetch(`http://localhost:5141/api/point/${pointData.id}/records`);
                if (!recordsResponse.ok) {
                    console.warn(`Не удалось загрузить записи для точки ${pointData.id}`);
                    return { pointId: pointData.id, records: [] };
                }
                const records = await recordsResponse.json();
                return { pointId: pointData.id, records };
            });
    
            const pointRecords = await Promise.all(pointRecordsPromises);
            const pointRecordsMap = new Map(pointRecords.map(pr => [pr.pointId, pr.records]));
    
            pointsData.forEach(pointData => {
                if (pointData.buildingId === selectedBuildingId) {
                    const point = BABYLON.MeshBuilder.CreateSphere(
                        `point_${pointData.id}`, 
                        {diameter: 0.5}, 
                        scene
                    );
                    
                    if (Array.isArray(pointData.position)) {
                        point.position = new BABYLON.Vector3(
                            pointData.position[0],
                            pointData.position[1],
                            pointData.position[2]
                        );
                    } else {
                        point.position = new BABYLON.Vector3(
                            pointData.x || pointData.position.x,
                            pointData.y || pointData.position.y,
                            pointData.z || pointData.position.z
                        );
                    }
                    
                    const pointRecordsForPoint = pointRecordsMap.get(pointData.id) || [];
                    
                    const latestRecord = pointRecordsForPoint.length > 0 
                        ? pointRecordsForPoint[pointRecordsForPoint.length - 1] 
                        : null;
                    
                    point.material = latestRecord && latestRecord.materialName 
                        ? createMaterial(latestRecord.materialName) 
                        : createDefaultMaterial();
                    
                    point.pointData = pointData;
                    point.pointRecords = pointRecordsForPoint;
                }
            });
    
        } catch(error) {
            console.error("Ошибка загрузки точек:", error);
        }
    }
    
    /**
     * Вспомогательная функция для создания материала по умолчанию
     */
    function createDefaultMaterial() {
        const defaultMaterial = new BABYLON.StandardMaterial("defaultPointMaterial", scene);
        defaultMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5); 
        return defaultMaterial;
    }

    /**
     * Функция загрузки и Отображения модель на сцене
     * @param {*} modelPath Путь до модели
     */
    function loadAndShowModel(modelPath) {
        if (loadedModel) {
            loadedModel.dispose();
        }
    
        const existingPoints = scene.meshes.filter(mesh => mesh.name.startsWith('point_'));
        existingPoints.forEach(point => point.dispose());

        BABYLON.SceneLoader.ImportMesh('', 'http://localhost:9000/assets/models/', modelPath, scene, function (meshes) {
            loadedModel = meshes[0];
            loadedModel.position = new BABYLON.Vector3(0, 0.5, 20);
            
            currentModel = modelPath;
            console.log("Установлена currentModel:", currentModel);
            loadBuildingInfo();
            loadPoints();
        }, null, function (scene, message, exception) {
            console.error("Ошибка загрузки модели:", message, exception);
        });
        console.log(currentModel);
    }
    
    
    let FOVField = document.getElementById('FOV-input');
    
    /** 
     * Обработчик для Select Угла обзора
     */
    FOVField.addEventListener('change',function(){
       visibilityAngel = this.value;
        FOV =BABYLON.Tools.ToRadians(visibilityAngel);
        this.blur();   
    });

    let formatField = document.getElementById('format-select');

    /**
     * Обработчик для Select формата обзора
     */
    formatField.addEventListener('change', function(){
        visibilityFormat = convertRatioToExpression(this.value);
        this.blur();    
    });

    let loadedModel = null;
    
    /**
     * Обработчки для Select модели
     */
    const modelField = document.getElementById('model-select');
    modelField.addEventListener('change', function() {
        loadAndShowModel(this.value);
        this.blur();   
    });
    

    return scene;
}

const scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener('resize', function(){
    engine.resize();
});

document.addEventListener("DOMContentLoaded", fetchAllBuildings);
document.addEventListener("DOMContentLoaded", fetchAllFormats);


 /**
     * Добавление новой записи
     * @param {*} pointId id Точки
     */
 async function addNewPointRecord(pointId) {
    const materialInputs = document.querySelectorAll('input[name="material"]');
    const dateInput = document.getElementById('date');
    const infoInput = document.getElementById("infoInput");
    const file = photoInput.files[0];
    const formData = new FormData();

    if(file){
        try{
            formData.append("photoFile", file);
        } catch (error){
            console.error("Ошибка загрузки фото:", error);

            return;
        }
    }

    formData.append("PointId",pointId);
    formData.append("Info",infoInput.value);
    formData.append("MaterialName",Array.from(materialInputs).find(input=>input.checked)?.value || "");
    formData.append("CheckupDate",dateInput.value);
    formData.append("BuildingId",selectedBuildingId);
    console.log("PointId:", pointId);


    try {
        const response = await fetch(`http://localhost:5141/api/point/${pointId}/records`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Не удалось добавить новую запись');
        }

        const createdRecord = await response.json();
        console.log('Новая запись добавлена:', createdRecord);

        resetInputs();
        
        insert.style.display = 'none';
        infoBlock.style.display = 'block';
        modalContent.style.height = '80vh';
        saveBtn.style.display = 'none';
        updateBtn.style.display = 'none';
        deleteBtn.style.display = 'inline-block';
        addBtn.style.display = 'block';

    } catch (error) {
        console.error('Ошибка при добавлении новой записи:', error);
        alert('Не удалось добавить новую запись. Пожалуйста, попробуйте снова.');
    } finally {
        unlockControls();
      }
}