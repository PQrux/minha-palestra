/**
 * Converte um inteiro ou ponto flutuante em reais.
 * @param {Number} number Número a ser convertido para R$.
 * @returns {String}
 */
const parseBRL = (number) => {
    let result = "R$ 0,00"
    if(isNaN(number)) return result;
    let num = parseFloat(number).toFixed(2).split(".");
    result = "";
    for(let i=num[0].length;i>=0;i=i-3){
        result=result.length===0?num[0].substring(i,i-3) : num[0].substring(i,i-3)+"."+result;
    }
    if(result[0] === ".") result = result.substring(1,result.length);
    result = "R$ "+result+","+num[1];
    return result;
}

export default parseBRL;