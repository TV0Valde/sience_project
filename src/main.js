/**
 * Импорт необходимых библиотек
 */
import * as BABYLON from 'babylonjs';
import "@babylonjs/loaders/glTF";
import 'babylonjs-loaders'
import {convertRatioToExpression,GetDistance,calculateDistance, formatDate} from "./functions";
import {buildingsList, fetchAllBuildings,selectedBuildingId} from"./buildingSelect";
import {fetchAllFormats} from "./formatSelect";

let divFps = document.getElementById("fps");
let drone ;
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
    const camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(),scene,drone);
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
    const plane = BABYLON.MeshBuilder.CreatePlane("plane", { width: planeWidth, height: planeHeight, updatable:true}, scene);
    const greenMaterial = new BABYLON.StandardMaterial("greenMaterial", scene);
    plane.visibility = 0;
    greenMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
    plane.material = greenMaterial;
    plane.material.alpha = 0.5;

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
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('/assets/images/skybox/sky',scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    const  skybox = BABYLON.MeshBuilder.CreateBox('skybox',{
        size:300
    },scene)
    skybox.infiniteDistance = true;
    skybox.material = skyboxMaterial;

/**
 * Создание и настройка Плоскости Земли
 */
    let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 300, height: 300 });
    let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("/assets/images/ground/123.jpg", scene);
    ground.material = groundMaterial;
    ground.position = new BABYLON.Vector3(0,0,0);


/**
 * Создание, загрузка и настройка модели БПЛА
 */
        const fly = BABYLON.SceneLoader.ImportMesh("", "http://localhost:9000/assets/models/models/","drone.glb", scene, function (newMeshes) {
            drone = newMeshes[0];
            
        drone.rotationQuaternion = null;
        drone.position.y = 2;
        drone.position.x = -10;
        drone.position.z = 0;
        drone.scaling.z = 0.1;
        drone.scaling.x = 0.1;
        drone.scaling.y = 0.1;
        camera.parent = drone;
    
        let speed = 0.3;
        let rotationSpeed = 0.02;
        let direction = new BABYLON.Vector3(0, 0, 1);

        /** 
         * Блок для настройки движения БПЛА
         */
        scene.onBeforeRenderObservable.add(() => {
          
            if (scene.inputStates.rotateLeft) {
                drone.rotation.y -= rotationSpeed;
                direction = BABYLON.Vector3.TransformCoordinates(direction, BABYLON.Matrix.RotationY(-rotationSpeed));
            }

            if (scene.inputStates.rotateRight) {
                drone.rotation.y += rotationSpeed;
                direction = BABYLON.Vector3.TransformCoordinates(direction, BABYLON.Matrix.RotationY(rotationSpeed));
            }

            let forward = direction.clone();
            forward.y = 0;
            forward = forward.normalize();
            let right = new BABYLON.Vector3(-forward.z, 0, forward.x);

            if (scene.inputStates.up) {
                drone.position = drone.position.add(forward.scale(speed)) 
            }
            if (scene.inputStates.down) {
                drone.position = drone.position.subtract(forward.scale(speed)); 
            }
            if (scene.inputStates.left) {
                drone.position = drone.position.add(right.scale(speed)); 
            }
            if (scene.inputStates.right) {
                drone.position = drone.position.subtract(right.scale(speed)); 
            }
            if (scene.inputStates.jump) {
                drone.position.y += speed; 
            }
            if (scene.inputStates.crouch) {
                drone.position.y -= speed; 
            }
        });

        /**
         * Блок для обработки нажатия клавиш для движения БПЛА
         */
        scene.inputStates = {};
        scene.inputStates.up = false;
        scene.inputStates.down = false;
        scene.inputStates.left = false;
        scene.inputStates.right = false;
        scene.inputStates.jump = false;
        scene.inputStates.crouch = false;
        scene.inputStates.rotateLeft = false;
        scene.inputStates.rotateRight = false;

        window.addEventListener("keydown", (event) => {
            switch (event.keyCode) {
                case 38:
                    scene.inputStates.up = true;
                    break;
                case 40:
                    scene.inputStates.down = true;
                    break;
                case 37:
                    scene.inputStates.left = true;
                    break;
                case 39:
                    scene.inputStates.right = true;
                    break;
                case 104:
                    scene.inputStates.jump = true;
                    break;
                case 98:
                    scene.inputStates.crouch = true;
                    break;
                case 100:
                    scene.inputStates.rotateLeft = true;
                    break;
                case 102:
                    scene.inputStates.rotateRight = true;
                    break;
            }
        });

        window.addEventListener("keyup", (event) => {
            switch (event.keyCode) {
                case 38:
                    scene.inputStates.up = false;
                    break;
                case 40:
                    scene.inputStates.down = false;
                    break;
                case 37:
                    scene.inputStates.left = false;
                    break;
                case 39:
                    scene.inputStates.right = false;
                    break;
                case 104:
                    scene.inputStates.jump = false;
                    break;
                case 98:
                    scene.inputStates.crouch = false;
                    break;
                case 100:
                    scene.inputStates.rotateLeft = false;
                    break;
                case 102:
                    scene.inputStates.rotateRight = false;
                    break;
            }
        });

        let angle = 72;
        let FOV = BABYLON.Tools.ToRadians(angle);
        let distance;
        let input_distance = document.getElementById('distance');
        let point =  drone.position.clone();
        let format = convertRatioToExpression('1:1');
        /**
         * Функция для обработки действий во время Рендеринга
         */
        scene.registerBeforeRender(function (){
            let tmp = document.getElementById('model-select').value;
          //  console.log(tmp);
            divFps.innerHTML = engine.getFps().toFixed() + " fps";
                point =  drone.position.clone();
                let forwardVector = new BABYLON.Vector3(0, 0, 1); 
                let rotatedForwardVector = BABYLON.Vector3.TransformNormal(forwardVector, drone.getWorldMatrix());
                let pickRay = new BABYLON.Ray(point, rotatedForwardVector, 600);
                let hit = scene.pickWithRay(pickRay);

                if (hit.pickedMesh && hit.pickedMesh !== plane) {
                     distance = BABYLON.Vector3.Distance(drone.position,hit.pickedPoint);
                    plane.scaling.y = 2* distance * Math.tan(FOV/2); 
                     if (format ===1){
                         plane.scaling.x = plane.scaling.y;   
                     }
                     else {
                         plane.scaling.x =  plane.scaling.y *(format);
                     }
                    plane.visibility = 1;
                    plane.position = hit.pickedPoint;
                    plane.rotation.y = drone.rotation.y;
                    GetDistance(input_distance,distance);
                   
                }
                else {
                    plane.visibility = 0;
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

        openModalforPoint(async (newRecord) => {
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

                // Создаем запись для точки
                const pointRecordData = {
                    photoData: newRecord.photoData,
                    info: newRecord.info,
                    materialName: newRecord.materialName,
                    checkupDate: newRecord.checkupDate,
                    buildingId: selectedBuildingId,
                    pointId: createdPoint.id
                };

                const recordResponse = await fetch(`http://localhost:5141/api/point/${createdPoint.id}/records`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pointRecordData)
                });

                if (!recordResponse.ok) throw new Error('Не удалось создать запись точки');

                const createdRecord = await recordResponse.json();

                // Настройка материала точки
                point.material = createMaterial(newRecord.materialName);
                
                // Обновление названия точки
                point.name = `point_${createdPoint.id}`;

                console.log('Точка создана:', createdPoint);
                console.log('Запись точки создана:', createdRecord);

            } catch (error) {
                console.error('Ошибка при создании:', error);
                point.dispose();
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
                console.error(`Failed to delete point with ID ${pointId}. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error during deletion:', error);
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
            console.log(`Mesh for point ID ${pointId} removed from scene.`);
        } else {
            console.warn(`Mesh for point ID ${pointId} not found in scene.`);
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
            // Fetching point data
            fetch(`http://localhost:5141/api/point/${selectedPointId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch point data: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(pointData => {
                    if (!pointData) {
                        console.warn("Point data not found for ID:", selectedPointId);
                        return;
                    }
    
                    // Fetching associated records for the point
                    fetch(`http://localhost:5141/api/point/${selectedPointId}/records`)
                        .then(recordResponse => {
                            if (!recordResponse.ok) {
                                throw new Error(`Failed to fetch records: ${recordResponse.statusText}`);
                            }
                            return recordResponse.json();
                        })
                        .then(recordsData => {
                            // Cache the point and records data in the mesh
                            if (selectedMesh) {
                                selectedMesh.pointData = pointData;
                                selectedMesh.pointRecords = recordsData;
                            }
    
                            // Open modal with both point and records data
                            openModalForExisting(pointData, recordsData);
                        })
                        .catch(error => console.error("Error fetching point records:", error));
                })
                .catch(error => console.error("Error fetching point data:", error));
        }
    }
    
    
/**
 * Функция обработки нажатия курсором на сцену
*/
scene.onPointerDown = () => {
    const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
    const pickedMesh = pickInfo.pickedMesh;
    if (pickedMesh && pickedMesh.name.startsWith("point_")) {
        const selectedPointId = pickedMesh.name.replace("point_", "");
        onPointSelected(selectedPointId); 
    }
    else if (pickInfo.hit) {
        createPoint(pickInfo.pickedPoint);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const aboutBuildingDiv = document.getElementById('aboutBuilding');

    if (!aboutBuildingDiv) {
        console.error("Элемент aboutBuilding не найден в DOM.");
        return;
    }

    aboutBuildingDiv.addEventListener('click', () => {
        openInfoModal();
    });
});

async function loadBuildingInfo() {
    console.log("Загрузка информации для здания:", selectedBuildingId);
    try {
        const response = await fetch(`http://localhost:5141/api/buildingInfo/byBuilding/${selectedBuildingId}`);
        if (!response.ok) throw new Error('Не удалось загрузить данные здания');
        const data = await response.json();
        console.log("Загруженные данные здания:", data);
        return data;
    } catch (error) {
        console.error("Ошибка загрузки данных здания:", error);
        return null;
    }
}

async function openInfoModal() {
    const infoModal = document.getElementById('infoModal');
    const modalContent = document.getElementById('infoModal-content');
    const projectDesignationInput = document.getElementById('project_designation');
    const projectNameInput = document.getElementById('project_name');
    const projectStageInput = document.getElementById('project_stage');
    const projectAddressInput = document.getElementById('project_adress');
    const buildingInfoBlock = document.getElementById('building_info_container');
    const saveButton = document.getElementById('infoModal_saveBtn');
    const deleteButton = document.getElementById('infoModal_deleteBtn');
    const updateButton = document.getElementById('infoModal_updateBtn');
    const closeInfoModalBtn = document.querySelector('#infoModal .close');
    const buildingInfoDisplay = document.getElementById('buildingInfoDisplay');
    const projectDesignationDisplay = document.getElementById('buildingInfoDisplay_project_designation');
    const projectNameDisplay = document.getElementById('buildingInfoDisplay_project_name');
    const projectStageDisplay = document.getElementById('buildingInfoDisplay_project_stage');
    const projectAddressDisplay = document.getElementById('buildingInfoDisplay_project_adress');

    let isEditing = false; // Флаг для режима редактирования
    let currentRecordId = null; // ID текущей записи

    if (!infoModal || !modalContent) {
        console.error("Не удалось найти модальное окно или его содержимое.");
        return;
    }

    // Сброс полей ввода
    function resetInputs() {
        projectDesignationInput.value = '';
        projectNameInput.value = '';
        projectStageInput.value = '';
        projectAddressInput.value = '';
    }

    // Переключение в режим редактирования
    function switchToEditMode() {
        isEditing = true;
        buildingInfoDisplay.style.display = 'none';
        buildingInfoBlock.style.display = 'flex';
        saveButton.style.display = 'inline-block';
        deleteButton.style.display = 'none';
        updateButton.style.display = 'none';
    }

    // Переключение в режим просмотра
    function switchToViewMode() {
        isEditing = false;
        buildingInfoDisplay.style.display = 'block';
        buildingInfoBlock.style.display = 'none';
        saveButton.style.display = 'none';
        deleteButton.style.display = 'inline-block';
        updateButton.style.display = 'inline-block';
        projectDesignationDisplay.style.display = `block`;
        projectNameDisplay.style.display = `block`;
        projectStageDisplay.style.display = `block`;
        projectAddressDisplay.style.display = `block`;
    }

    // Загрузка данных объекта
    const buildingData = await loadBuildingInfo();

    if (buildingData) {
        // Если запись существует, заполняем поля и отображаем данные
        currentRecordId = buildingData.id;
        projectDesignationInput.value = buildingData.projectDesignation || '';
        projectNameInput.value = buildingData.projectName || '';
        projectStageInput.value = buildingData.stage || '';
        projectAddressInput.value = buildingData.areaAdress || '';

        projectDesignationDisplay.textContent = `Обозначение проекта: ${buildingData.projectDesignation}`;
        projectNameDisplay.textContent = `Наименование проекта: ${buildingData.projectName}`;
        projectStageDisplay.textContent = `Стадия проекта: ${buildingData.stage}`;
        projectAddressDisplay.textContent = `Адрес участка: ${buildingData.areaAdress}`;

        switchToViewMode();

        // Привязка кнопки редактирования
        updateButton.onclick = () => {
            switchToEditMode();
        };

        // Привязка кнопки удаления
        deleteButton.onclick = () => deleteBuildingInfo(currentRecordId);
    } else {
        // Если записи нет, переключаемся в режим создания
        resetInputs();
        currentRecordId = null;
        switchToEditMode();
    }

    // Отображение модального окна
    infoModal.style.display = 'flex';
    modalContent.style.height = '35vh';
    modalContent.style.width = '20vw';

    // Функция сохранения (создание или обновление)
    async function saveBuildingInfo() {
        const newRecord = {
            id:currentRecordId, // Добавляем ID записи (null, если создание)
            projectDesignation: projectDesignationInput.value,
            projectName: projectNameInput.value,
            stage: projectStageInput.value,
            areaAdress: projectAddressInput.value,
            buildingId: selectedBuildingId,
        };

        try {
            let response;
            if (isEditing && currentRecordId) {
                // Обновление записи
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

            // Закрытие окна после сохранения
            infoModal.style.display = 'none';
        } catch (error) {
            console.error('Ошибка при сохранении записи:', error);
        }
    }

    // Функция удаления
    async function deleteBuildingInfo(recordId) {
        try {
            const response = await fetch(`http://localhost:5141/api/buildingInfo/${recordId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Не удалось удалить запись');
            console.log('Запись успешно удалена');

            // Закрыть модальное окно
            infoModal.style.display = 'none';
        } catch (error) {
            console.error('Ошибка удаления записи:', error);
        }
    }

    // Привязка кнопок
    saveButton.onclick = saveBuildingInfo;

    // Закрытие окна
    if (closeInfoModalBtn) {
        closeInfoModalBtn.onclick = () => {
            infoModal.style.display = 'none';
        };
    }
}






/**
 * Функция открытия модального окна
 * @param {*} callback callback-функция
 * @param {*} pointData Данные точки
 */
function openModalforPoint(callback, pointRecord, pointData) {
    // Получение элементов DOM
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

    function updateRecordDisplay(record) {
        photoDisplay.src = record.photoData || '';
        photoDisplay.style.display = record.photoData ? 'block' : 'none';
        photoDisplay.style.height = "50vh";
        photoDisplay.style.width = "20vw";
        photoViewer.style.display = record.photoData ? 'flex' : 'none';

        infoDisplay.innerHTML = record.info || '';
        infoDisplay.style.display = 'block';

        dateDisplay.innerHTML = `Дата осмотра: ${formatDate(record.checkupDate)}`;
        dateDisplay.style.display = 'block';

        const selectedMaterial = Array.from(materialInputs)
            .find(input => input.value === record.materialName);
        if (selectedMaterial) {
            selectedMaterial.checked = true;
        }


       // Управление кнопками навигации
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

    // Обработчики для навигации между записями
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
    
    

    // Сброс полей ввода
    function resetInputs() {
        photoInput.value = '';
        infoInput.value = '';
        dateInput.value = '';
        materialInputs.forEach(input => input.checked = false);
        photoDisplay.src = '';
        photoDisplay.style.display = 'none';
        photoViewer.style.display = 'none';
        infoDisplay.innerHTML = '';
        dateDisplay.innerHTML = '';
    }
    resetInputs();

    // Настройка внешнего вида модального окна
    function configureModalLayout(isExistingPoint) {
        if (isExistingPoint) {
            modalContent.style.height = '70vh';
            modalContent.style.width = '25vw';
            modalContent.style.paddingBottom = '15px';
            insert.style.display = 'none';
            updateBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
            deleteBtn.style.display = 'inline-block';
            addBtn.style.display = 'inline-block';
            // Отображение существующих данных
            if (pointRecord) {

                    photoDisplay.src = pointRecord.photoData;
                    photoDisplay.style.display = 'block';
                    photoDisplay.style.height = "20vh";
                    photoDisplay.style.width = "20vw";
                    photoViewer.style.display = 'flex';

                    infoDisplay.innerHTML = pointRecord.info;
                    infoDisplay.style.display = 'block';

                    dateDisplay.innerHTML = `Дата осмотра: ${formatDate(pointRecord.checkupDate)}`;
                    dateDisplay.style.display = 'block';

                    const selectedMaterial = Array.from(materialInputs)
                        .find(input => input.value === pointRecord.materialName);
                    if (selectedMaterial) {
                        selectedMaterial.checked = true;
                    }

                // Предзаполнение полей ввода
                infoInput.value = pointRecord.info || '';
                dateInput.value = pointRecord.checkupDate || '';
            }
        } else {
            modalContent.style.height = "40vh";
            updateBtn.style.display = 'none';
            insert.style.display = 'block';
            addBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
            deleteBtn.style.display = 'none';
            infoDisplay.style.display = 'none';
            dateDisplay.style.display = 'none';
            photoDisplay.style.display = 'none';
            photoViewer.style.display = 'none';
        }
    }
    configureModalLayout(callback === null);

    if (pointRecord && pointData) {
        // Получаем все записи для точки
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
                
                // Если индекс не найден, устанавливаем на первую запись
                if (currentRecordIndex === -1) {
                    currentRecordIndex = 0;
                }

                updateRecordDisplay(currentRecords[currentRecordIndex]);
            })
            .catch(error => {
                console.error('Ошибка при получении записей:', error);
            });
    }

    // Утилита для получения данных файла
    async function getFileData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function addNewPointRecord(pointId) {
        const file = photoInput.files[0];
        const photoData = file ? await getFileData(file) : null;
    
        const pointRecordData = {
            photoData: photoData,
            info: infoInput.value,
            materialName: Array.from(materialInputs).find(input => input.checked)?.value || null,
            checkupDate: dateInput.value,
            buildingId: selectedBuildingId,
            pointId: pointId
        };
    
        try {
            const response = await fetch(`http://localhost:5141/api/point/${pointId}/records`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pointRecordData)
            });
    
            if (!response.ok) {
                throw new Error('Не удалось добавить новую запись');
            }
    
            const createdRecord = await response.json();
            console.log('Новая запись добавлена:', createdRecord);
    
            // Обновление списка записей в модальном окне
            const recordsResponse = await fetch(`http://localhost:5141/api/point/${pointId}/records`);
            if (recordsResponse.ok) {
                const updatedRecords = await recordsResponse.json();
                
            }
    
            // Сброс полей ввода
            resetInputs();
            
            // Закрытие режима ввода
            insert.style.display = 'none';
            infoBlock.style.display = 'block';
            modalContent.style.height = '70vh';
            saveBtn.style.display = 'none';
            updateBtn.style.display = 'inline-block';
            deleteBtn.style.display = 'inline-block';
            addBtn.style.display = 'inline-block';
    
        } catch (error) {
            console.error('Ошибка при добавлении новой записи:', error);
            alert('Не удалось добавить новую запись. Пожалуйста, попробуйте снова.');
        }
    }

  // Обновление существующей записи
async function updatePointRecord(photoData) {
    if (!pointRecord) {
        console.error('No point record to update');
        return;
    }

    pointRecord.info = infoInput.value;
    pointRecord.checkupDate = dateInput.value;
    pointRecord.materialName = Array.from(materialInputs).find(input => input.checked)?.value || null;
    pointRecord.photoData = photoData || pointRecord.photoData;

    try {
        const response = await fetch(`http://localhost:5141/api/pointRecord/${pointRecord.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pointRecord)
        });

        if (!response.ok) {
            throw new Error('Failed to update point record');
        }

        // Обновляем отображение данных в модальном окне без перезагрузки
        photoDisplay.src = pointRecord.photoData;
        photoDisplay.style.display = 'block';
        photoDisplay.style.height = "20vh";
        photoDisplay.style.width = "20vw";
        photoViewer.style.display = 'flex';

        infoDisplay.innerHTML = pointRecord.info;
        infoDisplay.style.display = 'block';

        dateDisplay.innerHTML = `Дата осмотра: ${formatDate(pointRecord.checkupDate)}`;
        dateDisplay.style.display = 'block';

        // Возвращаем модальное окно в режим просмотра
        insert.style.display = 'none';
        infoBlock.style.display = 'block';
        photoViewer.style.display = 'flex';
        modalContent.style.height = '70vh';
        saveBtn.style.display = 'none';
        updateBtn.style.display = 'inline-block';
        deleteBtn.style.display = 'inline-block';
        addBtn.style.display = 'inline-block';

        console.log('Point record updated successfully');
    } catch (error) {
        console.error('Error updating point record:', error);
        alert('Failed to update point record. Please try again.');
    }
}

// Обработчик кнопки обновления
updateBtn.onclick = () => {
    modalContent.style.height = "30vh";
    insert.style.display = 'block';
    infoBlock.style.display = 'none';
    
    // Скрываем display-блоки
    infoDisplay.style.display = 'none';
    dateDisplay.style.display = 'none';
    photoDisplay.style.display = 'none';
    photoViewer.style.display = 'none';

    // Перенастраиваем кнопку сохранения для обновления
    saveBtn.style.display = 'inline-block';
    deleteBtn.style.display = 'none';
    saveBtn.onclick = async () => {
        const file = photoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                updatePointRecord(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            updatePointRecord(null);
        }
    };
};
    // Обработчик кнопки удаления
    deleteBtn.onclick = async () => {
        if (pointData && pointData.pointId) {
            try {
                // Вызов функции удаления точки
                await deletePoint(pointData.pointId);
    
                // Закрываем модальное окно после успешного удаления
                pointModal.style.display = 'none';
    
                // Удаление точки со сцены
                const pointMesh = scene.getMeshByName(`point_${pointData.pointId}`);
                if (pointMesh) {
                    scene.removeMesh(pointMesh);
                }
    
                console.log("Point successfully deleted.");
                resetInputs();
            } catch (error) {
                console.error("Error deleting point:", error);
                alert("Failed to delete the point. Please try again.");
            }
        } else {
            console.error("Point ID is missing or undefined.");
            alert("Point ID is required to delete the point.");
        }
    };

    // Сохранение новой записи
    saveBtn.onclick = async () => {
        const file = photoInput.files[0];
        const photoData = file ? await getFileData(file) : null;

        const newRecord = {
            info: infoInput.value,
            checkupDate: dateInput.value,
            materialName: Array.from(materialInputs).find(input => input.checked)?.value || null,
            photoData: photoData,
            buildingId: selectedBuildingId
        };

        if (callback) {
            callback(newRecord);
        }

        pointModal.style.display = 'none';
        resetInputs();
    };

    addBtn.onclick = async () => {
      if(pointData && pointData.pointId){
        resetInputs();

        modalContent.style.height = "30vh";
        insert.style.display = "block";
        infoBlock.style.display = "none";

        saveBtn.style.display = "inline-block";
        saveBtn.onclick = () => addNewPointRecord(pointData.pointId);

        updateBtn.style.display = 'none';
        deleteBtn.style.display = 'none';
        addBtn.style.display = 'none';
      }
    }

    // Показываем модальное окно
    pointModal.style.display = 'flex';
}

/**
 * Функция открытия модального окна для существующих точек
 * @param {Object} existingPoint Данные точки
 * @param {Object} records Связанные записи
 */
async function openModalForExisting(existingPoint, addRecordCallback) {
    // Проверяем наличие необходимых данных
    if (!existingPoint || !existingPoint.id) {
        console.error('Invalid existing point data');
        return;
    }

    try {
        // Создаем объект pointData с pointId
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

        // Проверяем, есть ли записи для этой точки
        if (recordData.length > 0) {
            // Если есть записи - открываем модальное окно с последней записью
            openModalforPoint(null, recordData[0], pointData);
        } else {
            // Если записей нет - открываем модальное окно для добавления новой записи
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
            
        });
    }

    let currentModel;
    /**
     * Функция загрузки точек на сцену
     */
    async function loadPoints() {
        try {
            console.log("Загрузка точек для здания:", selectedBuildingId);
            
            const pointsResponse = await fetch(`http://localhost:5141/api/points/byBuilding/${selectedBuildingId}`);
            if (!pointsResponse.ok) throw new Error('Не удалось загрузить точки');
            
            const pointsData = await pointsResponse.json();
            
            // Параллельная загрузка записей для всех точек
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
                    
                    // Преобразование позиции
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
                    
                    // Получаем записи для точки
                    const pointRecordsForPoint = pointRecordsMap.get(pointData.id) || [];
                    
                    // Используем последнюю запись для определения материала и других свойств
                    const latestRecord = pointRecordsForPoint.length > 0 
                        ? pointRecordsForPoint[pointRecordsForPoint.length - 1] 
                        : null;
                    
                    // Установка материала (используем материал из последней записи)
                    point.material = latestRecord && latestRecord.materialName 
                        ? createMaterial(latestRecord.materialName) 
                        : createDefaultMaterial();
                    
                    // Сохраняем полные данные точки и ее записей
                    point.pointData = pointData;
                    point.pointRecords = pointRecordsForPoint;
                }
            });
    
        } catch(error) {
            console.error("Ошибка загрузки точек:", error);
        }
    }
    
    // Вспомогательная функция для создания материала по умолчанию
    function createDefaultMaterial() {
        const defaultMaterial = new BABYLON.StandardMaterial("defaultPointMaterial", scene);
        defaultMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5); // Серый цвет
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
    
        BABYLON.SceneLoader.ImportMesh('', 'http://localhost:9000/assets/models/models/', modelPath, scene, function (meshes) {
            loadedModel = meshes[0];
            loadedModel.position = new BABYLON.Vector3(0, 0.5, 20);
            
            currentModel = modelPath;
            console.log("Установлена currentModel:", currentModel);
            loadBuildingInfo();
            loadPoints();
        }, null, function (scene, message, exception) {
            console.error("Ошибка загрузки модели:", message, exception);
        });
    }
    
    
    let FOVField = document.getElementById('FOV-input');
    
    /** 
     * Обработчик для Select Угла обзора
     */
    FOVField.addEventListener('change',function(){
        angle = this.value;
        FOV =BABYLON.Tools.ToRadians(angle);
    });

    let formatField = document.getElementById('format-select');

    /**
     * Обработчик для Select формата обзора
     */
    formatField.addEventListener('change', function(){
        format = convertRatioToExpression(this.value);})

    let loadedModel = null;
    
    /**
     * Обработчки для Select модели
     */
    const modelField = document.getElementById('model-select');
    modelField.addEventListener('change', function() {
        loadAndShowModel(this.value);
    });
    

    return scene;
}

const scene = createScene();
engine.runRenderLoop(function(){
    scene.render();
});
window.addEventListener('resize', function(){
    engine.resize();
});

document.addEventListener("DOMContentLoaded", fetchAllBuildings);
document.addEventListener("DOMContentLoaded", fetchAllFormats);