export default function isDate(date){
    if(date && date.getTime && date.getTime()) return true;
    else return false;
}