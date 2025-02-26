
/**
 * Функция конвертации для области видимости
 * @param {*} format Формат
 * @returns 
 */
export  function convertRatioToExpression(format) {
    const delimetr = format.split(":");
    const numerator = parseInt(delimetr[0]);
    const denominator = parseInt(delimetr[1]);
    return numerator / denominator;
}

/**
 * Функция вывода дистанции
 * @param {*} htmlElement Элемент для вывода 
 * @param {*} distance  Дистанция
 */
export function GetDistance(htmlElement,distance){
    htmlElement.innerText = `${distance.toFixed(2)} м`;
}

/**
 * Функция форматирования даты в формат dd.mm.yyyy
 * @param {string} dateString Строка с датой
 * @returns {string} Отформатированная дата
 */
export function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

  /**
     * Функция Расчёта дистанции между точками
     * @param {*} pos1 Координаты точки 1
     * @param {*} pos2 Координаты точки 2
     * @returns Дистанция между точками
     */
 export function calculateDistance(pos1, pos2) {
    return Math.sqrt(
        Math.pow(pos1[0] - pos2[0], 2) +
        Math.pow(pos1[1] - pos2[1], 2) +
        Math.pow(pos1[2] - pos2[2], 2)
    );
}

