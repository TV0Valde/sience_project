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

      const camera = new BABYLON.ArcRotateCamera("camera",-Math.PI/2,Math.PI/2, 5, new BABYLON.Vector3());
      camera.attachControl(canvas, true);
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
    const fly = BABYLON.SceneLoader.ImportMesh("", "/assets/models/","drone.glb", scene, function (newMeshes) {

         drone = newMeshes[0];
        drone.rotationQuaternion = null;
        drone.position.y = 1;
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
            switch (event.key) {
                case "w":
                    scene.inputStates.up = true;
                    break;
                case "s":
                    scene.inputStates.down = true;
                    break;
                case "a":
                    scene.inputStates.left = true;
                    break;
                case "d":
                    scene.inputStates.right = true;
                    break;
                case "t":
                    scene.inputStates.jump = true;
                    break;
                case "g":
                    scene.inputStates.crouch = true;
                    break;
                case "q":
                    scene.inputStates.rotateLeft = true;
                    break;
                case "e":
                    scene.inputStates.rotateRight = true;
                    break;
            }
        });

        window.addEventListener("keyup", (event) => {
            switch (event.key) {
                case "w":
                    scene.inputStates.up = false;
                    break;
                case "s":
                    scene.inputStates.down = false;
                    break;
                case "a":
                    scene.inputStates.left = false;
                    break;
                case "d":
                    scene.inputStates.right = false;
                    break;
                case "t":
                    scene.inputStates.jump = false;
                    break;
                case "g":
                    scene.inputStates.crouch = false;
                    break;
                case "q":
                    scene.inputStates.rotateLeft = false;
                    break;
                case "e":
                    scene.inputStates.rotateRight = false;
                    break;
            }
        });
        drone.visibilityWidth = 0.1;
        drone.visibilityHeight = 0.1;
       drone.updateVisibilityRadius = function () {
            plane.scaling.x =  drone.visibilityWidth ;
            plane.scaling.y =  drone.visibilityHeight;

            if(drone.position.z<5){
                plane.scaling.x =plane.scaling.y =0.2 * Math.abs(drone.position.z-7);
            }


        };
       // scene.registerBeforeRender(drone.updateVisibilityRadius);

        const plane = BABYLON.MeshBuilder.CreatePlane("plane", { width: 0.4, height: 0.3, updatable:true }, scene);
        const greenMaterial = new BABYLON.StandardMaterial("greenMaterial", scene);
        greenMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        plane.material = greenMaterial;
        plane.material.alpha = 1;
         plane.parent = loadedModel;
       /* scene.registerBeforeRender(function () {
        // Получаем текущее положение и направление вида камеры
        let cameraPosition = camera.position.clone();
        let cameraDirection = drone.getDirection(new BABYLON.Vector3(0, 0, 1)); // Например, вдоль оси Z

// Создаем луч, направленный вдоль направления вида камеры от ее положения
        let pickRay = new BABYLON.Ray(cameraPosition, cameraDirection);

// Используем pickWithRay для определения объектов, пересекаемых лучом
        let pickInfo = scene.pickWithRay(pickRay);

// Проверяем, есть ли пересечение
        if (pickInfo.hit) {
            // pickInfo.pickedMesh содержит информацию о выбранном объекте
            var pickedMesh = pickInfo.pickedMesh;
            console.log("Выбран объект:", pickedMesh);

            // Теперь вы можете использовать pickInfo.pickedPoint и другие данные по необходимости
        } else {
            console.log("Нет пересечений с объектами в направлении вида камеры.");
        }
        });*/
    });

    return scene;
}

const scene = createScene();


const gui = new dat.GUI();


const parameters = {
    selectedModel: 'build_m.glb', // Начальное значение параметра
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