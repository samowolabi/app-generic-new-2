/**
*@purpose: converts JS date into mySQL format string Y-m-d H:i:s and EST timezone. 
*@usage: dateStringForMySQL =  datetimeToSQL(new Date());
*@param (Javascript Date) date: 
**/
var datetimeToSQL = function(date){
	 
	return moment(date).tz("America/New_York").format("YYYY-MM-DD HH:mm:ss");
};  


/**
*@purpose: converts JS date into EST format string Y-m-dTH:i:sP and EST timezone. 
*@usage: dateStringForMySQL =  datetimeToSQL(new Date());
*@param (Javascript Date) date: 
**/
var datetimeToEST = function(date){
	return moment(date).tz("America/New_York").format();
};  

/**
*@purpose: converts JS date into mySQL format string Y-m-d and EST timezone. 
*@usage: dateStringForMySQL =  datetimeToSQL(new Date());
*@param (Javascript Date) date: 
**/
var dateToSQL = function(date){
	 
	return moment(date).tz("America/New_York").format("YYYY-MM-DD");

};  

/**
*@purpose: removes duplicates and keeps order
*@param array inputArray: 
**/
var removeDuplicateAndKeepOrder = function(inputArray){
	var seen = {};
	var resultArray = [];
	
	if( !inputArray || !Array.isArray(inputArray) ){
		console.log("removeDuplicateAndKeepOrder() was called with empty inputArray or not an array", inputArray)
		return resultArray;
	}
	
	var inputArrayLength = inputArray.length;
	for (var i = 0; i < inputArrayLength; i++) {
		if (!(inputArray[i] in seen)) {
			resultArray.push(inputArray[i]);
			seen[inputArray[i]] = true;
		}
	}
	return resultArray;
};