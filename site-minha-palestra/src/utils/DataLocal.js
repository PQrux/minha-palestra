/**
 * 
 * @param {Date} data
 * @returns {String} 
 */
export default function DataLocal(data){
    data = new Date(data);
    if(data.getTime()){
        return `${data.getDate().toString().padStart(2,"0")}/${(data.getMonth()+1).toString().padStart(2,"0")}/${data.getFullYear().toString().padStart(2,"0")} - ${data.getHours().toString().padStart(2,"0")}:${data.getMinutes().toString().padStart(2,"0")}`
    }
    else{
        return "Data inválida.";
    }
}