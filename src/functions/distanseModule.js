/**
 * Функция Расчёта дистанции между точками
 * @param {*} pos1 Координаты точки 1
 * @param {*} pos2 Координаты точки 2
 * @returns Дистанция между точками
 */
 export function calculateDistance(pos1, pos2) {
    return Math.sqrt(
        Math.pow(pos1.x - pos2.x, 2) +
        Math.pow(pos1.y - pos2.y, 2) +
        Math.pow(pos1.z - pos2.z, 2)
    );
}

/**
 * Функция вывода дистанции
 * @param {*} htmlElement Элемент для вывода 
 * @param {*} distance  Дистанция
 */
export function GetDistance(htmlElement,distance){
    htmlElement.innerText = `${distance.toFixed(2)} м`;
}

