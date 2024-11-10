/**
 * Импорт необходимых библиотек
 */
import * as BABYLON from 'babylonjs';
import "@babylonjs/loaders/glTF";
import 'babylonjs-loaders'
import {convertRatioToExpression,GetDistance} from "./functions";
import {buildingsList, fetchAllBuildings,selectedBuildingId} from"./buildingSelect";
import {fetchAllFormats} from "./formatSelect";

//let divFps = document.getElementById("fps");
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
        const fly = BABYLON.SceneLoader.ImportMesh("", "/assets/models/","drone.glb", scene, function (newMeshes) {
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
           // divFps.innerHTML = engine.getFps().toFixed() + " fps";
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
            const point = BABYLON.MeshBuilder.CreateSphere("point", { diameter: 0.2 }, scene);
            point.position = position;
    
            openModal(async (photoData, info, materialName, checkupDate) => {
                point.material = createMaterial(materialName);
    
                const pointData = {
                    position: point.position.asArray(),
                    photoData: photoData,
                    info: info,
                    materialName: materialName,
                    model: currentModel,
                    buildingId: selectedBuildingId,
                    checkupDate : checkupDate
                };
    
                try {
                    const response = await fetch('http://localhost:5141/api/Points/point', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(pointData)
                    });
    
                    if (!response.ok) throw new Error('Не удалось создать точку');
    
                    const createdPoint = await response.json();
                    
                    // Обновление названия точки
                    point.name = `point_${createdPoint.id}`;
                    
                    // Сохранение данных о точке 
                    point.pointData = {
                        id: createdPoint.id,
                        photoData: photoData,
                        info: info,
                        materialName: materialName,
                        checkupDate: checkupDate,
                        position: position.asArray()
                    };
    
                    console.log('Точка создана:', createdPoint);
                } catch (error) {
                    console.error('Ошибка при создании:', error);
                    // Удаление точки, если не удалось создать
                    point.dispose();
                }
            });
        } else {
            openModalForExisting(existingPoint);
        }
    };
    
    /**
     * Функция для проверки существует ли точка по близости 
     * @param {*} position Координаты нажатия
     */
    async function checkExistingPoint(position) {
        const response = await fetch(`http://localhost:5141/api/Points/points?x=${position.x}&y=${position.y}&z=${position.z}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
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
     * Функция Расчёта дистанции между точками
     * @param {*} pos1 Координаты точки 1
     * @param {*} pos2 Координаты точки 2
     * @returns Дистанция между точками
     */
    function calculateDistance(pos1, pos2) {
        return Math.sqrt(
            Math.pow(pos1[0] - pos2[0], 2) +
            Math.pow(pos1[1] - pos2[1], 2) +
            Math.pow(pos1[2] - pos2[2], 2)
        );
    }

    /**
     * Функция Удаления Точки из базы
     * @param {*} pointId id Удаляемой точки
     */
    async function deletePoint(pointId) {
        try {
            const response = await fetch(`http://localhost:5141/api/Points/point/${pointId}`, {
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
        
        if (selectedMesh && selectedMesh.pointData) {
            openModalForExisting(selectedMesh.pointData);
        } else {
            fetch(`http://localhost:5141/api/Points/point/${selectedPointId}`)
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        // Сохраняем данные в меш для будущего использования
                        if (selectedMesh) {
                            selectedMesh.pointData = data;
                        }
                        openModalForExisting(data);
                    } else {
                        console.warn("Point data not found for ID:", selectedPointId);
                    }
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

/**
 * Функция форматирования даты в формат dd.mm.yyyy
 * @param {string} dateString Строка с датой
 * @returns {string} Отформатированная дата
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

/**
 * Функция открытия модального окна
 * @param {*} callback callback-функция
 * @param {*} pointData Данные точки
 */
function openModal(callback, pointData) {
    const insert = document.getElementById("insert");
    const modal = document.getElementById("myModal");
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


    photoInput.value = '';
    infoInput.value = '';
    dateInput.value = '';
    materialInputs.forEach(input => input.checked = false);
    
    // Для существующей точки
    if (callback === null) {
        modalContent.style.height = "60%";
        insert.style.display = 'none';
        updateBtn.style.display = 'inline-block';
        saveBtn.style.display = 'none';
        deleteBtn.style.display = 'inline-block';
        addBtn.style.display = 'inline-block';
    }
    // Для новой точки 
    else {
        modalContent.style.height = "30%";
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

    // Отображение данных точки если они доступны
    if (pointData) {
        if (pointData.photoData) {
            photoDisplay.src = pointData.photoData;
            photoDisplay.style.display = 'block';
            photoDisplay.style.height = "50%";
            photoDisplay.style.width = "50%";
            photoViewer.style.display = 'flex';
        } else {
            photoDisplay.style.display = 'none';
            infoDisplay.style.display = 'none';
            dateDisplay.style.display = 'none';
            photoViewer.style.display = 'none';
        }
        
        if (pointData.info) {
            infoDisplay.innerHTML = pointData.info;
            infoDisplay.style.display = 'block';
            dateDisplay.innerHTML = `Дата осмотра: ${formatDate(pointData.checkupDate)}`;
            dateDisplay.style.display = 'block';
        } else {
            photoViewer.style.display = 'none';
            photoDisplay.style.display = 'none';
            infoDisplay.style.display = 'none';
            dateDisplay.style.display = 'none';
        }

        if (pointData.materialName) {
            const selectedMaterial = Array.from(materialInputs)
                .find(input => input.value === pointData.materialName);
            if (selectedMaterial) {
                selectedMaterial.checked = true;
            }
        }

        if (pointData.checkupDate) {
            dateInput.value = pointData.checkupDate;
        }
    }

    /**
     * Обратчик для нажатия на кнопку удаления Точки
     */
    deleteBtn.onclick = async () => {
        if (pointData && pointData.id) {
            await deletePoint(pointData.id);
            modal.style.display = 'none';
        }
    };

    /**
     * Обработчик для нажатия на кнопку Обновления данных
     */
    updateBtn.onclick = () => {
        modalContent.style.height = "30%";
        insert.style.display = 'block';
        infoBlock.style.display = 'none';
        
        // Заполняем поля формы текущими данными
        if (pointData) {
            infoInput.value = pointData.info || '';
            dateInput.value = pointData.checkupDate || '';
            if (pointData.materialName) {
                const materialInput = Array.from(materialInputs)
                    .find(input => input.value === pointData.materialName);
                if (materialInput) {
                    materialInput.checked = true;
                }
            }
        }

        // Перенастраиваем кнопку сохранения для обновления
        saveBtn.style.display = 'inline-block';
        deleteBtn.style.display = 'none';
        saveBtn.onclick = () => {
            const file = photoInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    updatePointData(pointData.id, reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                updatePointData(pointData.id, pointData.photoData);
            }
        };
    };

    async function updatePointData(pointId, photoData) {
        const info = infoInput.value;
        const selectedMaterial = Array.from(materialInputs).find(input => input.checked);
        const materialName = selectedMaterial ? selectedMaterial.value : null;
        const checkupDate = dateInput.value;

        const updatedPointData = {
            id: pointId,
            position: pointData.position,
            photoData: photoData,
            info: info,
            materialName: materialName,
            model: currentModel,
            buildingId: selectedBuildingId,
            checkupDate: checkupDate
        };

        try {
            const response = await fetch(`http://localhost:5141/api/Points/point/${pointId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPointData)
            });

            if (!response.ok) {
                throw new Error('Failed to update point');
            }

            // Обновляем визуальное представление точки
            const pointMesh = scene.getMeshByName(`point_${pointId}`);
            if (pointMesh) {
                pointMesh.material = createMaterial(materialName);
                pointMesh.pointData = updatedPointData;
            }

            // Обновляем отображение в модальном окне
            photoDisplay.src = photoData;
            photoDisplay.style.display = 'block';
            infoDisplay.innerHTML = info;
            infoDisplay.style.display = 'block';
            
            // Возвращаем модальное окно в режим просмотра
            modalContent.style.height = "55%";
            insert.style.display = 'none';
            infoBlock.style.display = 'block';
            updateBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';

            console.log('Point updated successfully');
        } catch (error) {
            console.error('Error updating point:', error);
            alert('Failed to update point. Please try again.');
        }
    }
    if (callback) {
        saveBtn.onclick = () => {
            const file = photoInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    savePointData(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                savePointData(null);
            }
        };
    }

    /**
     * Обработчик для нажатия на кнопку Сохранения данных
     */
    saveBtn.onclick = () => {
        const file = photoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                savePointData(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            savePointData(pointData ? pointData.photoData : null);
        }
    };

    /**
     * Функция сохранения данных точки
     * @param {*} photoData Информация о фото
     */
    function savePointData(photoData) {
        const info = infoInput.value;
        const selectedMaterial = Array.from(materialInputs).find(input => input.checked);
        const materialName = selectedMaterial ? selectedMaterial.value : null;
        const checkupDate = dateInput.value;

        if (callback) {
            callback(photoData, info, materialName, checkupDate);
        }

        infoBlock.style.display = 'block';
        modal.style.display = 'none';
    }

    modal.style.display = 'flex';
}

    
    /**
     * Функция открытия модального окна для существующих точек
     * @param {*} existingPoint 
     */
    function openModalForExisting(existingPoint) {
        openModal(null, existingPoint);
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
    
    
    const modal = document.getElementById('myModal');
    const closeModalBtn = document.querySelector('.close');
    if (modal && closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }


    let currentModel;
    /**
     * Функция загрузки точек на сцену
     */
    async function loadPoints() {
        try {
            console.log("Загрузка точек для здания:", selectedBuildingId);
            
            const response = await fetch(`http://localhost:5141/api/Points/points/byBuilding/${selectedBuildingId}`);
            if(!response.ok) throw new Error('Не удалось загрузить точки');
            
            const pointsData = await response.json();
            
            pointsData.forEach(pointData => {
                if (pointData.buildingId === selectedBuildingId) {
                    const point = BABYLON.MeshBuilder.CreateSphere(
                        `point_${pointData.id}`, 
                        {diameter: 0.2}, 
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
                    
                    point.material = createMaterial(pointData.materialName);
                    
                    point.pointData = pointData;
                }
            });
    
        } catch(error) {
            console.error("Ошибка загрузки точек:", error);
        }
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
    
        BABYLON.SceneLoader.ImportMesh('', '/assets/models/', modelPath, scene, function (meshes) {
            loadedModel = meshes[0];
            loadedModel.position = new BABYLON.Vector3(0, 0.5, 20);
            
            currentModel = modelPath;
            console.log("Установлена currentModel:", currentModel);
            
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
