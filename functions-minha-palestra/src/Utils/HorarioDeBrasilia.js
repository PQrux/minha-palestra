module.exports = (isString) => {
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