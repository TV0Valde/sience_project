// Библиотеки
import * as BABYLON from 'babylonjs';
import "@babylonjs/loaders/glTF";
import 'babylonjs-loaders'
import dat from 'dat.gui';
import * as GUI from 'babylonjs-gui';
import {convertRatioToExpression,GetDistance} from "./functions";
import {options,modelOptions} from"./gui";
//создание переменных
let loadedModel;
let divFps = document.getElementById("fps");
let drone ;
let building;
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
   // const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/2,Math.PI/2, 5,new BABYLON.Vector3() , scene);
    const camera = new BABYLON.FollowCamera("camera", new BABYLON.Vector3(),scene,drone);
    camera.attachControl(true);
    camera.upperBetaLimit = Math.PI / 2.2;
    camera.radius = 5; // Радиус области видимости
    camera.heightOffset = 3; // Высота области видимости
    camera.rotationOffset = 180; // Поворот области видимости (в градусах)

    //создание плоскости(области видимости)
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

    //мини окно
    let miniMap = new BABYLON.FollowCamera("minimap", new BABYLON.Vector3(0,0,98),scene,drone);
    miniMap.layerMask = 2;
    
    miniMap.attachControl(true);
    miniMap.upperBetaLimit = Math.PI / 2.2;
    miniMap.radius = 5; // Радиус области видимости
    miniMap.heightOffset = 10; // Высота области видимости
    miniMap.rotationOffset = 180; // Поворот области видимости (в градусах)
    scene.activeCameras.push(camera);
    let rt2 = new BABYLON.RenderTargetTexture("depth", 1024, scene, true, true);
    scene.customRenderTargets.push(rt2);
    rt2.activeCamera = miniMap;
    rt2.renderList = building;
    let miniMapMaterial = new BABYLON.StandardMaterial("texturePlane", scene);
    miniMapMaterial.diffuseColor = new BABYLON.Color3(1,1,1);
    miniMapMaterial.diffuseTexture = rt2;
    miniMapMaterial.specularColor = BABYLON.Color3.Black();
    miniMapMaterial.diffuseTexture.level = 1.2; // intensity
    miniMapMaterial.emissiveColor = new BABYLON.Color3(1,1,1); // backlight
    let miniMapPlane = BABYLON.Mesh.CreatePlane("plane", 4, scene);
    //  miniMapPlane.position = new BABYLON.Vector3(0, 0, 20)
    miniMapPlane.position = new BABYLON.Vector3(0, -canvas.height/100, 20)
    miniMapPlane.material = miniMapMaterial;
    miniMapPlane.parent = camera;
    miniMapPlane.layerMask = 1;


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
       miniMap.parent =camera;
        //задание скорости
        let speed = 0.1;
        let rotationSpeed = 0.02;
        let direction = new BABYLON.Vector3(0, 0, 1);

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




        let point =  drone.position.clone();
//обработка приближения/отдаления
        scene.registerBeforeRender(function (){

            divFps.innerHTML = engine.getFps().toFixed() + " fps";
                point =  drone.position.clone();
                let forwardVector = new BABYLON.Vector3(0, 0, 1); // вектор направления вдоль оси Z
                let rotatedForwardVector = BABYLON.Vector3.TransformNormal(forwardVector, drone.getWorldMatrix()); // преобразование вектора в локальные координаты mesh
                let pickRay = new BABYLON.Ray(point, rotatedForwardVector, 1000);
                let hit = scene.pickWithRay(pickRay);

                if (hit.pickedMesh && hit.pickedMesh !== plane) {
                     distance = BABYLON.Vector3.Distance(drone.position,hit.pickedPoint);
                    plane.scaling.y = 2* distance * Math.tan(FOV/2);
                    if (distance < 9.5)                
                        miniMap.position = new BABYLON.Vector3(0,0,0);           
                    else 
                        miniMap.position = new BABYLON.Vector3(0,0,98);     
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
                console.log(plane.position);
        })
    });
    let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Данные для точек (для примера)
    const pointsData = [
        {
            text: "Текст для точки 0",
           // photos: ["photo1.jpg", "photo2.jpg"]
        },
        {
            text: "Текст для точки 1",
          //  photos: ["photo3.jpg", "photo4.jpg"]
        },
        {
            text: "Текст для точки 2",
          //  photos: ["photo3.jpg", "photo4.jpg"]
        },
        {
            text: "Текст для точки 3",
          //  photos: ["photo3.jpg", "photo4.jpg"]
        },
        {
            text: "Текст для точки 4",
           // photos: ["photo3.jpg", "photo4.jpg"]
        },
        {
            text: "Трещина на поверхности фасада,\n шириной раскрытия до 3 мм,\n длиной до 6,5 м\n",
            photos: ["../assets/cracks/photo.jpg"]
        },
        {
            text: "Текст для точки 3",
            //  photos: ["photo3.jpg", "photo4.jpg"]
        },
        {
            text: "Текст для точки 3",
            //  photos: ["photo3.jpg", "photo4.jpg"]
        },
        {
            text: "Текст для точки 3",
            //  photos: ["photo3.jpg", "photo4.jpg"]
        },
        {
            text: "Текст для точки 3",
            //  photos: ["photo3.jpg", "photo4.jpg"]
        },
        {
            text: "Текст для точки 3",
            //  photos: ["photo3.jpg", "photo4.jpg"]
        },
        {
            text: "Текст для точки 3",
            //  photos: ["photo3.jpg", "photo4.jpg"]
        },
        {
            text: "Текст для точки 3",
            //  photos: ["photo3.jpg", "photo4.jpg"]
        },
        {
            text: "Текст для точки 3",
            //  photos: ["photo3.jpg", "photo4.jpg"]
        },
    ];

    function openModal(pointIndex){
        const point = pointsData[pointIndex];
        const modal = new GUI.Rectangle();
        modal.width ="500px";
        modal.height = "500px";
        modal.cornerRadius = 20;
        modal.color ="white";
        modal.background = "black";
        modal.alpha = 0.8;
        advancedTexture.addControl(modal);

        // Текст в попапе
        const textBlock = new GUI.TextBlock();
        textBlock.text = point.text;
        textBlock.color = "white";
        textBlock.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        textBlock.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM; // Выравниваем текст по нижнему краю
        textBlock.height = "100px"; // Задаем высоту текстового блока
        textBlock.paddingBottom = "20px"; // Добавляем отступ снизу
        modal.addControl(textBlock);

        // Фотографии в попапе
        point.photos.forEach(photo => {
            const image = new GUI.Image("photo", photo);
            image.stretch = GUI.Image.STRETCH_FILL;
            image.top = "10px";
            image.width = "300px";
            image.height = "350px";
            image.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
            modal.addControl(image);
        });
        const closeButton = GUI.Button.CreateSimpleButton("closebutton","x");
        closeButton.width = "10px";
        closeButton.height ="10px";
        closeButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        closeButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        closeButton.color = "White";
        closeButton.background ="green";
        closeButton.onPointerClickObservable.add(()=>{
            modal.dispose();
        });
        modal.addControl(closeButton);

        modal.linkOffsetX = 0;
        modal.linkOffsetY = 0;
        modal.linkOffsetZ = -200;
    }
    //-3,2,9.89
    const  points = [];
    for (let i = 0; i<14; i++){
        const point = BABYLON.Mesh.CreateSphere("point" +i,16,0.6,scene);
        point.visibility = 0;
        point.position = new BABYLON.Vector3(-17.4 + i*2 ,7 ,9.77 );
        points.push(point);
    }
    for (let i = 0; i<14; i++){
        const point = BABYLON.Mesh.CreateSphere("point" +i,16,0.6,scene);
        point.visibility = 0;
        point.position = new BABYLON.Vector3(-17.4 + i*2 ,4 ,9.77 );
        points.push(point);
    }
    for (let i = 0; i<10; i++){
        const point = BABYLON.Mesh.CreateSphere("point" +i,16,0.6,scene);
        point.visibility = 0;
        point.position = new BABYLON.Vector3(-17.4 + i*2 ,3 ,9.77 );
        points.push(point);
    }
    for (let i = 0; i<7; i++){
        const point = BABYLON.Mesh.CreateSphere("point" +i,16,0.6,scene);
        point.visibility = 0;
        point.position = new BABYLON.Vector3(9  ,7.3 ,10.053 +i*2);
        points.push(point);
    }
    points.forEach((point,index) => {
        const button = GUI.Button.CreateSimpleButton("button"+ index,"");
        button.width = "25px";
        button.height = "25px";
        button.cornerRadius = 25;
        button.color = "white";
        if (index < 6)
        button.background = "green";
        else if (index > 6  && index < 12)
            button.background = "yellow";
        else
            button.background = "red";
        button.onPointerClickObservable.add(() =>{
            openModal(index);
        });
        advancedTexture.addControl(button);
        button.linkWithMesh(point);
        button.linkOffsetY = -50;
    });


    return scene;
}
//создание сцены
const scene = createScene();
engine.runRenderLoop(function(){
    scene.render();
});
window.addEventListener('resize', function(){
    engine.resize();
});

//Модуль GUI

const gui = new dat.GUI();
 const parameters = {
    inputValue: angle  ,
    selectedModel: 'build2.glb',
    selectedOption: 'Option1',
};

const modelSelect = gui.add(parameters, 'selectedModel', Object.keys(modelOptions)).name('Выберите модель');
const inputField = gui.add(parameters, 'inputValue').name('Введите угол');
const SelectField = gui.add(parameters,'selectedOption',options).name('Формат');

modelSelect.onChange(function (value) {
    loadAndShowModel(modelOptions[value]);
});

inputField.onChange(function(value) {
    // Обновляем переменную с новым значением
    angle = value;
     FOV = BABYLON.Tools.ToRadians(angle);
});

SelectField.onChange(function (value) {
    format = convertRatioToExpression(value);
})

loadAndShowModel(parameters.selectedModel);

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