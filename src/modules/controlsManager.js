import { appState } from "../main";

export const controlsManager =  {
    lock() {
        appState.isControlsBlocked = true;
        if(window.scene) {
            Object.keys(window.scene.inputStates || {}).forEach(x => window.scene.inputStates[x] = false);        
    }
    console.log("Движение заблокировано");
},
    unlock() {
        appState.isControlsBlocked = false;
        console.log("Движение разблокировано");
    }
}