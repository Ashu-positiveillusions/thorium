function printDate(){
    console.log("Today is 21st")
}
function printMonth(){
    console.log("and the month is February.");
}

function getBatchInfo(){
    console.log("Thorium, W3D1, the topic for today is Nodejs module system")
}

module.exports.date = printDate;
module.exports.month = printMonth;
module.exports.batchInfo = getBatchInfo;
// - printMonth() : prints the current month
// - getBatchInfo() : prints batch name, week#, Day#, the topic being taught today is ….. For example -
//  ‘Thorium, W3D1, the topic for today is Nodejs module system’
