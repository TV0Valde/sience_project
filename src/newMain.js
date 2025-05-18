/**
 * Импорт необходимых библиотек
 */
import * as BABYLON from 'babylonjs';
import "@babylonjs/loaders/glTF";
import 'babylonjs-loaders'
import {convertRatioToExpression} from "./functions/convertRationToExpression";
import {fetchAllBuildings,selectedBuildingId} from "./modules/buildingSelect";
import {fetchAllFormats} from "./modules/formatSelect";
import {DEFAULT_FORMAT, DEFAULT_FOV_ANGLE, MINIO_URL, MIN_BOUNDARY, MAX_BOUNDARY } from './constants/constants'
//import { sceneManager } from './modules/sceneManager';
import { buildingInfoManager } from './modules/buildingInfoManager';
import { pointsManager } from './modules/pointsManager';
import { GetDistance } from './functions/distanseModule';
import { KEYMAP } from './constants/keymap';
import { showLoadingScreen } from './functions/loadingScreen';

const canvas = document.getElementById("renderCanvas");
const FOVField = document.getElementById("FOV-input");
const formatField = document.getElementById("format-select");
const modelField = document.getElementById("model-select");


let currentModel;

/**
 * Настройка приложения
 */
export const appState = {
    droneMesh: null,
    visibilityAngel: DEFAULT_FOV_ANGLE,
    visibilityFormat: convertRatioToExpression(DEFAULT_FORMAT),
    FOV: BABYLON.Tools.ToRadians(DEFAULT_FOV_ANGLE),
    isControlsBlocked: false,
    currentModel: null,
    loadedModel: null
};
const divFps = document.getElementById("fps");

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
        pointsManager.loadPoints(selectedBuildingId,scene);
        this.setupPointInteraction(scene);
        document.addEventListener("DOMContentLoaded",showLoadingScreen);
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
                //pointsManager.handlePointSelection(selectedPointId);
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
    },

    createDefaultMaterial() {
         const defaultMaterial = new BABYLON.StandardMaterial("defaultPointMaterial", scene);
                defaultMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5); 
                return defaultMaterial;
    }
};

/**
 * Создание движка
 */
const engine = new BABYLON.Engine(canvas,true, {
    preserveDrawingBuffer: true,
    stencil: true
});

/** 
 * Прослушиватель событий для кнопки "информация о здании"
 */
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

/**
 * Создание сцены
 */
sceneManager.createScene();
engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener('resize', function(){
    engine.resize();
});

/**
 * Загрузка форматов и зданий, после загрузки приложения
 */
document.addEventListener("DOMContentLoaded", fetchAllBuildings);
document.addEventListener("DOMContentLoaded", fetchAllFormats);


/** 
 * Обработчик для Угла обзора
 */
FOVField.addEventListener('change',function(){
    appState.visibilityAngel = this.value;
    appState.FOV = BABYLON.Tools.ToRadians(appState.visibilityAngel);
     this.blur();   
 });

 /**
  * Обработчик для Select формата обзора
  */
 formatField.addEventListener('change', function(){
     appState.visibilityFormat = convertRatioToExpression(this.value);
     this.blur();    
 });

 /**
  * Обработчик для Select выбранного здания
  */
modelField.addEventListener('change', function() {
    sceneManager.loadAndShowModel(this.value);
    this.blur();   
});

