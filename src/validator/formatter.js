// - trim() : calls the trim function on a hardcoded string for example ‘ functionUp  ’
// - changetoLowerCase() : changes the case of the string to lower. [Call toLowerCase() on a hardcoded string]
// - changeToUpperCase() : changes the case of the string to upper case [Call toUpperCase() on a hardcoded string]
function trim(str){
    return str.trim();
}
function changeToLowerCase(str){
    return str.toLowerCase();
}
function changeToUpperCase(str){
    return str.toUpperCase();
}

module.exports.textTrim = trim;
module.exports.lowerCase = changeToLowerCase;
module.exports.upperCase = changeToUpperCase;