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