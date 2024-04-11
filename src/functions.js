import BABYLON from "babylonjs";

export  function convertRatioToExpression(str) {
    const parts = str.split(":");
    const numerator = parseInt(parts[0]);
    const denominator = parseInt(parts[1]);
    return numerator / denominator;
}
export function GetDistance(htmlElement,distance){
    htmlElement.innerHTML = `${distance.toFixed(2)} м`;
}

