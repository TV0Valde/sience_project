/**
 * Импорт необходимых библиотек
 */
import * as BABYLON from 'babylonjs';
import "@babylonjs/loaders/glTF";
import 'babylonjs-loaders'
import {convertRatioToExpression,GetDistance,calculateDistance, formatDate} from "./functions/distanseModule";
import {buildingsList, fetchAllBuildings,selectedBuildingId} from"./buildingSelect";
import {fetchAllFormats} from "./formatSelect";
import { showLoadingScreen } from './functions/loadingScreen';
import { KEYMAP } from './constants/keymap';
import { showError } from './showError';
import {MIN_BOUNDARY, MAX_BOUNDARY, DEFAULT_FORMAT, DEFAULT_FOV_ANGLE, API_BASE_URL, MINIO_URL} from './constants/constants'


const divFps = document.getElementById("fps");
const canvas = document.getElementById("renderCanvas");
const infoMessage = document.getElementById("infoMessage");
const FOVField = document.getElementById("FOV-input");
const formatField = document.getElementById("format-select");
const modelField = document.getElementById("model-select");
const projectNameInput = document.getElementById("project_name");
const projectAddressInput = document.getElementById("project_adress");
const materialInputs = document.querySelectorAll('input[name="material"]');
const dateInput = document.getElementById('date');
const infoInput = document.getElementById("infoInput");
const photoInput = document.getElementById("photoInput");
let currentModel;

const appState = {
    droneMesh: null,
    visibilityAngel: DEFAULT_FOV_ANGLE,
    visibilityFormat: convertRatioToExpression(DEFAULT_FORMAT),
    FOV: BABYLON.Tools.ToRadians(DEFAULT_FOV_ANGLE),
    isControlsBlocked: false,
    currentModel: null,
    loadedModel: null
};

const engine = new BABYLON.Engine(canvas,true, {
    preserveDrawingBuffer: true,
    stencil: true
});

const controlsManager =  {
    lock() {
        appState.isControlsBlocked = true;
        if(window.scene) {
            Object.keys(window.scene.inputStates || {}).forEach(x => window.scene.inputStates[x] = false);        
    }
},
    unlock() {
        appState.isControlsBlocked = false;
    }
}

const formValidator = {
    validateForm(materialInputs, photoInput, infoInput, dateInput) {
        let isValid = true;
        const errors = [];

        const materialSelected = Array.from(materialInputs).some(input => input.checked);
        if(!materialSelected){
            errors.push('Выберите степень повреждения');
            document.querySelector('.color').classList.add('invalid-border');
        } else {
            document.querySelector('.color').classList.remove('invalid-border');
        }

        const fields = [
            {element: photoInput, error: 'Загрузите фотографию', condition: ()=> !photoInput.files.length},
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

        if(errors.length > 0) {
            showError(errors[0]);
            const firstErrorElement = [materialInputs[0].parentElement, photoInput, infoInput, dateInput]
            .find(el => el.classList.contains('invalid') || el.classList.contains('invaid-border'));

            if(firstErrorElement){
                firstErrorElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
        return isValid;
    },

    setupFormListeners(inputs, materialInputs) {
        inputs.forEach(field => {
            field.addEventListener('input', () => {
                field.classList.remove('invalid');
                infoMessage.classList.remove('visible');
            });
        });

        materialInputs.forEach(input => {
            input.addEventListener('change', () => {
                document.querySelector('.color').classList.remove('invalid-border');
                infoMessage.classList.remove('visible');
            });
        });
    }
};

const apiService = {
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

    async saveBuildingInfo() {
        const newRecord = {
            id:buildingInfoManager.currentRecordId, 
            projectName: projectNameInput.value,
            areaAdress: projectAddressInput.value,
            buildingId: selectedBuildingId,
        };

        try {
            let response;
            console.log(buildingInfoManager.isEditing);
            console.log(buildingInfoManager.currentRecordId);
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
                const distance = calculateDistance(existingPoint.position, position);
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

const sceneManager = {
    createScene() {
        const scene = new BABYLON.Scene(engine);
        window.scene = scene;

        this.setupCamera(scene);
        this.setupVisibiblityPlane(scene);
        this.setupLight(scene);
        this.setupSkybox(scene);
        this.setupGround(scene);
        this.loadDroneMesh(scene);

        this.setupPointInteraction(scene);

       scene.registerBeforeRender(() => this.beforeRenderUpdate(scene));

        return scene;
    },

    setupCamera(scene){
        const camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(), scene, appState.droneMesh);
        camera.attachControl(true);
        camera.upperBetaLimit = Math.PI/ 2.2;
        camera.radius = 5;
        camera.heightOffset = 3;
        camera.rotationOffset = 180;
        scene.activeCamera = camera;
    },

    setupVisibiblityPlane(scene){
        const visibilityPlane = BABYLON.MeshBuilder.CreatePlane(
            "plane",
            {width: 0.1, height: 0.1, updatable: true},
            scene
        );

        const greenMaterial = new BABYLON.StandardMaterial("greenMaterial", scene);
        visibilityPlane.visibility = 0;
        greenMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        visibilityPlane.material = greenMaterial;
        visibilityPlane.material.alpha = 0.5;

        scene.visibilityPlane = visibilityPlane;
    },

    setupLight(scene) {
        const light = new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(0, 1, 0),
            scene
        );
        light.intensity = 0.5;
        light.groundColor = new BABYLON.Color3(0,0,1);
        scene.clearColor = BABYLON.Color3.Black();
    },

    setupSkybox(scene) {
        const skyboxMaterial = new BABYLON.StandardMaterial('skyboxMaterial', scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.specularColor = BABYLON.Color3.Black();
        skyboxMaterial.diffuseColor = BABYLON.Color3.Black();
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
            `${MINIO_URL}/assets/images/skybox/sky`,
            scene
        );
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

        const skybox = BABYLON.MeshBuilder.CreateBox('skybox', {size: 500}, scene);
        skybox.material= skyboxMaterial;
    },

    setupGround(scene){
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 500, height: 500});
        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture(
            `${MINIO_URL}/assets/images/ground/123.jpg`,
            scene
        );
        ground.material = groundMaterial;
    },

    loadDroneMesh(scene) {
        BABYLON.SceneLoader.ImportMesh(
            "",
            `${MINIO_URL}/assets/models/`,
            'drone.glb',
            scene,
            (newMeshes) => {
                const droneMesh = newMeshes[0];
                droneMesh.rotationQuaternion = null;

                droneMesh.position.y = 2;
                droneMesh.position.x = -10;
                droneMesh.position.z = 0;

                droneMesh.scaling.z = 0.1;
                droneMesh.scaling.x = 0.1;
                droneMesh.scaling.y = 0.1;

                scene.activeCamera.parent = droneMesh;
                appState.droneMesh = droneMesh

                this.setupDroneMovement(scene, droneMesh);
            }
        );
    },

    setupDroneMovement(scene, droneMesh){
        const movingSpeed = 0.3;
        const rotationSpeed = 0.02;
        let movingDirection = new BABYLON.Vector3(0, 0, 1);

        scene.inputStates = Object.fromEntries(
            [...new Set(Object.values(KEYMAP))].map(k => [k,false])
        );

        const handleKeyEvent = (event, isPressed) => {
            if (appState.isControlsBlocked) return;

            const action = KEYMAP[event.code];
            if(action){
                scene.inputStates[action] = isPressed;

                if(['Space','ControlLeft'].includes(event.code)) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        };

        window.addEventListener('keydown', e => handleKeyEvent(e, true));
        window.addEventListener('keyup', e => handleKeyEvent(e, false));

        scene.onBeforeRenderObservable.add(() => {
            if(!droneMesh) return;

            if(droneMesh.position.y < 1){
                droneMesh.position.y = 1;
            }

            droneMesh.position.x = BABYLON.Scalar.Clamp(
                droneMesh.position.x,
                MIN_BOUNDARY + 1,
                MAX_BOUNDARY - 1
            );
            droneMesh.position.y = BABYLON.Scalar.Clamp(
                droneMesh.position.y,
                1,
                MAX_BOUNDARY - 1
            );
            droneMesh.position.z = BABYLON.Scalar.Clamp(
                droneMesh.position.z,
                MIN_BOUNDARY + 1,
                MAX_BOUNDARY - 1
            );

            if(appState.isControlsBlocked) return;

            const {inputStates} =scene;
            const {rotation, position} = droneMesh;

            if(inputStates.rotateLeft || inputStates.rotateRight) {
                const angle = rotationSpeed * (inputStates.rotateLeft ? -1: 1);
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

            if(inputStates.forward) movement.addInPlace(MOVE_FORWARD_VECTOR);
            if(inputStates.backward) movement.subtractInPlace(MOVE_FORWARD_VECTOR);
            if(inputStates.left) movement.addInPlace(RIGHT);
            if(inputStates.right) movement.subtractInPlace(RIGHT);

            if(inputStates.ascend) movement.y += 1;
            if(inputStates.descend) movement.y -= 1;

            if(!movement.equalsToFloats(0,0,0)){
                position.addInPlace(movement.scale(movingSpeed));
            }
        });
    },

    beforeRenderUpdate(scene){
        if(divFps){
            divFps.innerText = engine.getFps().toFixed() + " fps";
            
        }

        this.updateVisibilityPlane(scene);
    },

    updateVisibilityPlane(scene){
        const droneMesh = appState.droneMesh;
        const visibilityPlane = scene.visibilityPlane;

        if(!droneMesh || !visibilityPlane) return;

        const dronePosition = droneMesh.position.clone();
        const forwardVector = new BABYLON.Vector3(0,0,1);
        const rotatedForwardVector = BABYLON.Vector3.TransformNormal(
            forwardVector,
            droneMesh.getWorldMatrix()
        );

        const pickRay = new BABYLON.Ray(dronePosition, rotatedForwardVector, 600);
        const hit = scene.pickWithRay(pickRay);

        const outputDistanseElement =  document.getElementById('distance');

        if(hit.pickedMesh && hit.pickedMesh !== visibilityPlane){
            const distanceValue = BABYLON.Vector3.Distance(droneMesh.position, hit.pickedPoint);

            visibilityPlane.scaling.y = 2 * distanceValue * Math.tan(appState.FOV/2);

            if(appState.visibilityFormat === 1){
                visibilityPlane.scaling.x = visibilityPlane.scaling.y;
            }   else{
                visibilityPlane.scaling.x = visibilityPlane.scaling.y * appState.visibilityFormat;
            }

            visibilityPlane.visibility = 1;
            visibilityPlane.position = hit.pickedPoint;
            visibilityPlane.rotation.y = droneMesh.rotation.y;


            if(outputDistanseElement){
                GetDistance(outputDistanseElement, distanceValue);
            }
        } else{
            visibilityPlane.visibility = 0;
        }
    },

    setupPointInteraction(scene) {
        scene.onPointerDown = () => {
            const pickInfo =  scene.pick(scene.pointerX, scene.pointerY);
            const pickedMesh = pickInfo.pickedMesh;

            if(!pickedMesh) return;

            if(pickedMesh.name.startsWith("point_")) {
                const selectedPointId = pickedMesh.name.replace("point_", "");
                pointsManager.handlePointSelection(selectedPointId);
            }    else if(
                pickedMesh.name !== "ground" &&
                pickedMesh.name !== "skubox" &&
                !pickedMesh.name.startsWith("point_") &&
                pickedMesh.name !== "Object_2"
            ) {
                console.log(pickInfo.pickedPoint);
                pointsManager.createNewPoint(pickInfo.pickedPoint);
            }
        };
    },

    loadAndShowModel(modelPath){
        if(appState.loadedModel) {
            appState.loadedModel.dispose();
        }

        const existingPoints = window.scene.meshes.filter(mesh => mesh.name.startsWith('point_'));
        existingPoints.forEach(point => point.dispose());

        BABYLON.SceneLoader.ImportMesh(
            '',
            `${MINIO_URL}/assets/models/`,
            modelPath,
            window.scene,
            function(meshes){
                appState.loadedModel = meshes[0];
                appState.loadedModel.position = new BABYLON.Vector3(0, 0.5, 20);

                appState.currentModel = appState.loadedModel;

                buildingInfoManager.loadBuildingInfo();
                pointsManager.loadPoints();
            },
            null,

        );
        currentModel = modelPath;
    },

    createMaterial(materialName){
        let material;
         switch (materialName) {
            case 'green':
                material = new BABYLON.StandardMaterial("green", window.scene);
                material.diffuseColor = new BABYLON.Color3(0,1,0);
                break;

            case 'yellow':
                material = new BABYLON.StandardMaterial('yellow', window.scene);
                material.diffuseColor = new BABYLON.Color3(1,1,0);
                break;

            case 'red':
                material = new BABYLON.StandardMaterial('red', window.scene);
                material.diffuseColor = new BABYLON.Color3(1,0,0);
                break;
         
            default:
                material = new BABYLON.StandardMaterial('defaultMaterial', window.scene);
                material.diffuseColor = new BABYLON.Color3(1,1,1);
                break;
         }
         return material;
    }
};

const buildingInfoManager = {
    isEditing:true,
    currentRecordId: null,
    async loadBuildingInfo() {
        return await apiService.fetchBuildingInfo(selectedBuildingId);
    },

    async openModal(pointRecord) {
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
                    await apiService.deleteBuildingInfo(currentRecordId);
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


document.addEventListener('DOMContentLoaded', () => {
    const aboutBuildingDiv = document.getElementById('aboutBuilding');

    if (!aboutBuildingDiv) {
        console.error("Элемент aboutBuilding не найден в DOM.");
        return;
    }

    
    aboutBuildingDiv.addEventListener('click', () => {
        if(currentModel != undefined){
            buildingInfoManager.openModal();
    }

    });
});

sceneManager.createScene();
engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener('resize', function(){
    engine.resize();
});

document.addEventListener("DOMContentLoaded", fetchAllBuildings);
document.addEventListener("DOMContentLoaded", fetchAllFormats);


/** 
 * Обработчик для Select Угла обзора
 */
FOVField.addEventListener('change',function(){
    appState.visibilityAngel = this.value;
     FOV = BABYLON.Tools.ToRadians(appState.visibilityAngel);
     this.blur();   
 });

 /**
  * Обработчик для Select формата обзора
  */
 formatField.addEventListener('change', function(){
     appState.visibilityFormat = convertRatioToExpression(this.value);
     this.blur();    
 });

modelField.addEventListener('change', function() {
    sceneManager.loadAndShowModel(this.value);
    this.blur();   
});

const pointsManager = {
    async createNewPoint(position) {
        let existingPoint = await apiService.checkExistingPoint(position);

        if(!existingPoint){
            const point = BABYLON.MeshBuilder.CreateSphere("point", {diameter:0.5}, scene);
            point.position = position;
            console.log(point.position);
         try {
            const createdPoint = await apiService.createPoint();
            const recordData = {
                info:infoInput.value,
                checkupDate:dateInput.value,
                materialName:Array.from(materialInputs).find(input => input.checked)?.value || null
            }
            const createdRecord = await apiService.addPointRecord(createdPoint.id,recordData, photoInput.files[0]);
            controlsManager.unlock();
        
        } catch (error) {
            console.error("Ошибка при создании:",error);
            point.dispose();
            controlsManager.unlock();
        }}
    },
    async openModal() {
        controlsManager.lock();
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
        const isUpdateMode = false;
        let currentRecords = [];
        let currentRecordIndex = 0;

        function updateRecordDisplay(record){
            photoDisplay.src = `${MINIO_URL}/${record.photoUrl}`;
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
        };

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
        };
        resetInputs();

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

        if (pointRecord && pointData) {
            fetch(`${API_BASE_URL}/point/${pointData.pointId}/records`)
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
        };

        async function addNewPointRecord(pointId){
            const recordData = {
                info:infoInput.value,
                checkupDate:dateInput.value,
                materialName:Array.from(materialInputs).find(input => input.checked)?.value || null
            };
           const createdRecord = apiService.addPointRecord(pointId,recordData,photoInput.files[0]);
            resetInputs();

            insert.style.display = 'none';
            infoBlock.style.display = 'block';
            modalContent.style.height = '80vh';
            saveBtn.style.display = 'inline-block';
            updateBtn.style.display = 'inline-block';
            addBtn.style.display = 'inline-block';
        }

        async function updatePointRecord(photoId){
            const recordData = {
                info:infoInput.value,
                checkupDate:dateInput.value,
                materialName:Array.from(materialInputs).find(input => input.checked)?.value || null
            };
            apiService.updatePointRecord(pointRecord.id,recordData,photoId);
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
    
        }
        updateBtn.onclick = () => {
            modalContent.style.height = "30vh";
            insert.style.display = 'block';
            infoBlock.style.display = 'none';
            isUpdateMode = true;
            infoDisplay.style.display = 'none';
            dateDisplay.style.display = 'none';
            photoDisplay.style.display = 'none';
            photoViewer.style.display = 'flex';
        
            saveBtn.style.display = 'inline-block';
            deleteBtn.style.display = 'none';
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
            if(!isUpdateMode){
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
        }
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
    }

}