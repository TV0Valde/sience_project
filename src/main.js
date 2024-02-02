// Импорт основной библиотеки Babylon.js
import * as BABYLON from 'babylonjs';
import "@babylonjs/loaders/glTF";
import 'babylonjs-loaders'
import dat from 'dat.gui';


let drone ;
let building;

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
const createScene = function(){

    const scene = new BABYLON.Scene(engine);
     const camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(),scene,drone);
     //const camera = new BABYLON.ArcRotateCamera("camera",-Math.PI/2,Math.PI/2, 5, new BABYLON.Vector3());
      camera.attachControl(true);
      camera.upperBetaLimit = Math.PI / 2.2;
      camera.radius = 5; // Радиус области видимости
      camera.heightOffset = 3; // Высота области видимости
      camera.rotationOffset = 180; // Поворот области видимости (в градусах)

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
        size:1000
    },scene)
    skybox.infiniteDistance = true;
    skybox.material = skyboxMaterial;

    //Земля
    let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 500, height: 500 });
    let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("/assets/images/ground/grass.jpg", scene);
    ground.material = groundMaterial;
    ground.position = new BABYLON.Vector3(0,0,0);

    //добавление дрона
    const fly = BABYLON.SceneLoader.ImportMesh("", "/assets/models/","wtf.glb", scene, function (newMeshes) {
         drone = newMeshes[0];
        drone.rotationQuaternion = null;
        drone.position.y = 2;
        drone.position.x = 1;
        drone.position.z = 0;
        drone.scaling.z = 0.1;
        drone.scaling.x = 0.1;
        drone.scaling.y = 0.1;

        camera.parent = drone;

        //задание скорости
        let speed = 0.1;
        let rotationSpeed = 0.02;
        let direction = new BABYLON.Vector3(0, 0, 1);


// Обработка клавиш
        scene.onBeforeRenderObservable.add(() => {
            // Поворот модели
            if (scene.inputStates.rotateLeft) {
                drone.rotation.y -= rotationSpeed;
                // Поворачиваем вектор направления
                direction = BABYLON.Vector3.TransformCoordinates(direction, BABYLON.Matrix.RotationY(-rotationSpeed));
            }
            if (scene.inputStates.rotateRight) {
                drone.rotation.y += rotationSpeed;

                direction = BABYLON.Vector3.TransformCoordinates(direction, BABYLON.Matrix.RotationY(rotationSpeed));
            }

            // Движение модели
            let forward = direction.clone();
            forward.y = 0;
            forward = forward.normalize();

            let right = new BABYLON.Vector3(-forward.z, 0, forward.x);

            if (scene.inputStates.up) {
                drone.position = drone.position.add(forward.scale(speed)) //вперёд
            }
            if (scene.inputStates.down) {
                drone.position = drone.position.subtract(forward.scale(speed)); // назад
            }
            if (scene.inputStates.left) {
                drone.position = drone.position.add(right.scale(speed)); // влево
            }
            if (scene.inputStates.right) {
                drone.position = drone.position.subtract(right.scale(speed)); // вправо
            }
            if (scene.inputStates.jump) {
                drone.position.y += speed; // Подъем
            }
            if (scene.inputStates.crouch) {
                drone.position.y -= speed; //спуск
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
                case 87:
                    scene.inputStates.up = true;
                    break;
                case 83:
                    scene.inputStates.down = true;
                    break;
                case 65:
                    scene.inputStates.left = true;
                    break;
                case 68:
                    scene.inputStates.right = true;
                    break;
                case 84:
                    scene.inputStates.jump = true;
                    break;
                case 71:
                    scene.inputStates.crouch = true;
                    break;
                case 81:
                    scene.inputStates.rotateLeft = true;
                    break;
                case 69:
                    scene.inputStates.rotateRight = true;
                    break;
            }
        });

        window.addEventListener("keyup", (event) => {
            switch (event.keyCode) {
                case 87:
                    scene.inputStates.up = false;
                    break;
                case 83:
                    scene.inputStates.down = false;
                    break;
                case 65:
                    scene.inputStates.left = false;
                    break;
                case 68:
                    scene.inputStates.right = false;
                    break;
                case 84:
                    scene.inputStates.jump = false;
                    break;
                case 71:
                    scene.inputStates.crouch = false;
                    break;
                case 81:
                    scene.inputStates.rotateLeft = false;
                    break;
                case 69:
                    scene.inputStates.rotateRight = false;
                    break;
            }
        });
        let planeWidth = 0.4;
        let planeHeight = 0.3;
        let FOV = BABYLON.Tools.ToRadians(72);
        const plane = BABYLON.MeshBuilder.CreatePlane("plane", { width: planeWidth, height: planeHeight, updatable:true}, scene);

        const greenMaterial = new BABYLON.StandardMaterial("greenMaterial", scene);
        plane.visibility = 0;

        greenMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        plane.material = greenMaterial;
        plane.material.alpha = 1;


        let point =  drone.position.clone();


        scene.registerBeforeRender(function (){

           point =  drone.position.clone();


                let forwardVector = new BABYLON.Vector3(0, 0, 1); // вектор направления вдоль оси Z
                let rotatedForwardVector = BABYLON.Vector3.TransformNormal(forwardVector, drone.getWorldMatrix()); // преобразование вектора в локальные координаты mesh
                let pickRay = new BABYLON.Ray(point, rotatedForwardVector, 1000);
                let hit = scene.pickWithRay(pickRay);


                if (hit.pickedMesh && hit.pickedMesh !== plane) {
                    let distance = BABYLON.Vector3.Distance(drone.position,hit.pickedPoint);
                   plane.scaling.x = 2* distance * Math.tan(FOV/2)*0.3;
                    plane.scaling.y =  plane.scaling.x *(4/3)*0.3 ;
                   //    plane.height = 1;
                   // plane.width = 2 ;
                    plane.visibility = 1;
                    plane.position = hit.pickedPoint;
                    plane.rotation.y = drone.rotation.y;
                    console.log(distance);
                    console.log( plane.scaling.x);
                    console.log(plane.scaling.y);
                  //  console.log("Выбран объект:", hit.pickedMesh);
                }
                else {
                    plane.visibility = 0;
                    //console.log("Нет пересечений с объектами в направлении вида камеры.");
                }

        })
    });

    return scene;
}

const scene = createScene();


const gui = new dat.GUI();


const parameters = {
    selectedModel: 'build2.glb', // Начальное значение параметра
};


let loadedModel;

// Функция для загрузки и отображения модели
function loadAndShowModel(modelPath) {

    if (loadedModel) {
        loadedModel.dispose();
    }

    BABYLON.SceneLoader.ImportMesh('', '/assets/models/', modelPath, scene, function (meshes) {

        loadedModel = meshes[0];
        building = loadedModel;
        loadedModel.position = new BABYLON.Vector3(0,0.5,20);

    });
}


const modelOptions = {
    'Модель 1': 'build_m.glb',
    'Модель 2': 'example_m.glb',
    'Модель 3': 'build2.glb'
};


const modelSelect = gui.add(parameters, 'selectedModel', Object.keys(modelOptions)).name('Выберите модель');


modelSelect.onChange(function (value) {
    loadAndShowModel(modelOptions[value]);
});

loadAndShowModel(parameters.selectedModel);

engine.runRenderLoop(function(){
    scene.render();
});

window.addEventListener('resize', function(){
    engine.resize();
});


