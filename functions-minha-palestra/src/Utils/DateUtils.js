module.exports = class DateUtils{
    static HorarioDeBrasilia(isString){
        let utcDate = new Date().toISOString();
        let horaUTC = parseInt(utcDate.match(/T(\d{2})/)[1]);
        let dateBR = utcDate.replace(/T(\d{2})/,"T"+(horaUTC-3));
        if(isString){
            return dateBR;
        }
        else{
            return new Date(dateBR);
        }
    }
    static DDMMYYYY(date){
        if((date instanceof Date)){
            return `${date.getDay().toString().padStart(2, "0")}/${(date.getMonth()+1).toString().padStart(2, "0")}/${date.getFullYear()}`;
        }
        else return "00/00/0000";
    }
}