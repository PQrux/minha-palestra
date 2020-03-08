/**
 * @param {any} a Objeto a ser arrayficado.
 * @returns {Array<{key: string, value: any}>}
 */
export default function Arrayficar(a){
    if(typeof a === "object"){
        let arr = [];
        for(let key in a){
            arr.push({key, value: a[key]});
        }
        return arr;
    }
    else{
        return [a];
    }
}