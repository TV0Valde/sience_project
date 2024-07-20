// Библиотеки
import * as BABYLON from 'babylonjs';
import "@babylonjs/loaders/glTF";
import 'babylonjs-loaders'
import dat from 'dat.gui';
import * as GUI from 'babylonjs-gui';
import {convertRatioToExpression,GetDistance} from "./functions";
import {options,modelOptions,modelOptionsTest} from"./gui";
//создание переменных
let BuildingInScene;
let loadedModel;
let divFps = document.getElementById("fps");
let drone ;
let angle = 72;
let distance;
let input_distance = document.getElementById('distance');
let FOV = BABYLON.Tools.ToRadians(angle);
let format = convertRatioToExpression('1:1');
const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
//Создание сцены
const createScene = function(){
    const scene = new BABYLON.Scene(engine);
//Камера
    const camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(),scene,drone);
    camera.attachControl(true);
    camera.upperBetaLimit = Math.PI / 2.2;
    camera.radius = 5; 
    camera.heightOffset = 3; 
    camera.rotationOffset = 180; 

   //Плоскость
    let planeWidth = 0.1;
    let planeHeight = 0.1;
    const plane = BABYLON.MeshBuilder.CreatePlane("plane", { width: planeWidth, height: planeHeight, updatable:true}, scene);
    const greenMaterial = new BABYLON.StandardMaterial("greenMaterial", scene);
    plane.visibility = 0;
    greenMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
    plane.material = greenMaterial;
    plane.material.alpha = 0.5;

    //Свет
    const  light = new BABYLON.HemisphericLight("light",new BABYLON.Vector3(0,1,0),scene);
    light.intensity = 0.5;
    light.groundColor = new BABYLON.Color3(0,0,1);
    scene.clearColor = BABYLON.Color3.Black();

    // Скайбоксы
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

    //Земля
    let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 300, height: 300 });
    let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("/assets/images/ground/grass.jpg", scene);
    ground.material = groundMaterial;
    ground.position = new BABYLON.Vector3(0,0,0);


//Модуль БПЛА
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

// Обработка клавиш клавиатуры
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

       
        let point =  drone.position.clone();
        scene.registerBeforeRender(function (){
            let tmp = document.getElementById('model-select').value;
            console.log(tmp);
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

    const points = [];
    let currentModel = document.getElementById('model-select').value;
   
    const createPoint = (position) => {
        const existingPoint = points.find(p => BABYLON.Vector3.Distance(BABYLON.Vector3.FromArray(p.position), position) < 0.1); 
      
        if (!existingPoint) {
            const point = BABYLON.MeshBuilder.CreateSphere("point", { diameter: 0.2 }, scene);
            point.position = position;
            
            openModal((photoData, info, materialName) => {
                point.material = createMaterial(materialName);
                const pointData = {
                    position: point.position.asArray(),
                    photoData: photoData,
                    info: info,
                    materialName: materialName,
                    model: currentModel
                };
                points.push({ mesh: point, ...pointData });   
                savePointsToLocalStorage();
            });
        } else {
            openModalForExisting(existingPoint); 
        }
    };
    
    const onPickingGround = (e) => {
        const pickResult = scene.pick(e.offsetX, e.offsetY);
        if (pickResult.hit) {
            createPoint(pickResult.pickedPoint);
        }
    };
    
    
    const pointsData = JSON.parse(localStorage.getItem("points") || "[]");
    pointsData.forEach((pointData) => {
        const point = BABYLON.MeshBuilder.CreateSphere("point", { diameter: 0.2 }, scene);
        point.position = BABYLON.Vector3.FromArray(pointData.position);
        point.material = createMaterial(pointData.materialName);
        points.push({ mesh: point, ...pointData });
    });
    
    scene.onPointerDown = onPickingGround;
    
    function openModal(callback, pointData = null) {
        const modal = document.getElementById("myModal");
        const modalContent = document.getElementById("modal-content");
        const photoInput = document.getElementById("photoInput");
        const infoInput = document.getElementById("infoInput");
        const saveBtn = document.getElementById("saveBtn");
        const insert = document.getElementById("insert");
        const materialInputs = document.querySelectorAll('input[name="material"]');
        const photoDisplay = document.getElementById("photoDisplay");
        const infoDisplay = document.getElementById("infoDisplay");
        const updateBtn = document.getElementById('updateBtn');
        const infoBlock = document.getElementById('info');
        updateBtn.onclick = ()=>{
            modalContent.style.height = "30%";
            insert.style.display ='block';
            infoBlock.style.display = 'none';
        }
        photoInput.value = '';
        infoInput.value = '';
        materialInputs.forEach(input => input.checked = false);
        if(callback ==null){
            modalContent.style.height = "55%";
            insert.style.display ='none';
        }
        else{
            modalContent.style.height = "30%";
            insert.style.display ='block';
        }
        
        if (pointData) {
            if (pointData.photoData) {
                photoDisplay.src = pointData.photoData;
                photoDisplay.style.display = 'block';
                infoDisplay.style.display = 'block';
            } else {
                photoDisplay.style.display = 'none';
                infoDisplay.style.display = 'none';
            }
            infoDisplay.innerHTML = pointData.info;
            const selectedMaterial = Array.from(materialInputs).find(input => input.value === pointData.materialName);
            if (selectedMaterial) {
                selectedMaterial.checked = true;
            }
        } else {
            photoDisplay.style.display = 'none';
            infoDisplay.style.display = 'none';
        }
    
        saveBtn.onclick = null;
    
        modal.style.display = 'flex';
    
        saveBtn.onclick = () => {
           
            const file = photoInput.files[0];
            let photoData = null;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                photoData = reader.result;
                savePointData(photoData);
            };
            reader.readAsDataURL(file);
        } else {
            photoData = pointData ? pointData.photoData : null;
            savePointData(photoData);
        }

        function savePointData(photoData) {
            const info = infoInput.value;
            const selectedMaterial = Array.from(materialInputs).find(input => input.checked);
            const materialName = selectedMaterial.value;
            if (pointData) {
                
                const index = points.findIndex(p => p.position.every((val, idx) => val === pointData.position[idx]));
                points[index] = {
                    ...points[index],
                    photoData: photoData,
                    info: info,
                    materialName: materialName
                };
                pointData.mesh.material = createMaterial(materialName);
            } else {
                callback(photoData, info, materialName);
            }
            savePointsToLocalStorage();
            infoBlock.style.display = 'block';
            modal.style.display = 'none';
        }
    };
}

function openModalForExisting(existingPoint) {
    openModal(null, existingPoint);
}
    
    function createMaterial(materialName) {
        let material;
        switch (materialName) {
            case 'material1':
                material = new BABYLON.StandardMaterial('material1', scene);
                material.diffuseColor = new BABYLON.Color3(0, 1, 0); // Красный
                break;
            case 'material2':
                material = new BABYLON.StandardMaterial('material2', scene);
                material.diffuseColor = new BABYLON.Color3(0.99, 0.99, 0); // Зеленый
                break;
            case 'material3':
                material = new BABYLON.StandardMaterial('material3', scene);
                material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Синий
                break;
            default:
                material = new BABYLON.StandardMaterial('defaultMaterial', scene);
                material.diffuseColor = new BABYLON.Color3(1, 1, 1); // Белый
                break;
        }
        return material;
    }
    
    function savePointsToLocalStorage() {
        const pointsToSave = points.map(p => ({
            position: p.position,
            photoData: p.photoData,
            info: p.info,
            materialName: p.materialName,
            model:p.model
        }));
        localStorage.setItem("points", JSON.stringify(pointsToSave));
    }

    let modelField = document.getElementById('model-select');
    let FOVField = document.getElementById('FOV-input');
    let formatField = document.getElementById('format-select');
    modelField.addEventListener('change',function(){
        loadAndShowModel(this.value);
    })
    
    FOVField.addEventListener('change',function(){
        angle = this.value;
        FOV =BABYLON.Tools.ToRadians(angle);
    })
    formatField.addEventListener('change', function(){
        format = convertRatioToExpression(this.value);})

    loadAndShowModel(modelField.value);

function loadAndShowModel(modelPath) {
    if (loadedModel) {
        loadedModel.dispose();
    }
    BABYLON.SceneLoader.ImportMesh('', '/assets/models/', modelPath, scene, function (meshes) {

        loadedModel = meshes[0];
        loadedModel.position = new BABYLON.Vector3(0,0.5,20);
      

    });
    currentModel = modelPath;
    updatePointsVisibility();
}
function updatePointsVisibility(){
    points.forEach(p=>{p.mesh.isVisible=(p.model === currentModel);})
}
    
    const modal = document.getElementById('myModal');
    const closeModalBtn = document.querySelector('.close');
    
    if (modal && closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }       
    return scene;
}

const scene = createScene();
engine.runRenderLoop(function(){
    scene.render();
});
window.addEventListener('resize', function(){
    engine.resize();
});

/*const gui = new dat.GUI();
 const parameters = {
    inputValue: angle  ,
    selectedModel: 'build2.glb',
    selectedOption: 'Option1',
};*/

//const modelSelect = gui.add(parameters, 'selectedModel', Object.keys(modelOptions)).name('Выберите модель');
//const inputField = gui.add(parameters, 'inputValue').name('Введите угол');
//const SelectField = gui.add(parameters,'selectedOption',options).name('Формат');

/*modelSelect.onChange(function (value) {
    loadAndShowModel(modelOptions[value]);
});

inputField.onChange(function(value) {
    angle = value;
     FOV = BABYLON.Tools.ToRadians(angle);
});

SelectField.onChange(function (value) {
    format = convertRatioToExpression(value);
})*/

