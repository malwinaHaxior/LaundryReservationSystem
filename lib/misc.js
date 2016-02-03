Misc = new Object();

Misc.MillisecondsInSecond = 1000.0;
Misc.MillisecondsInMinute = 60000.0; 
Misc.MillisecondsInHour = 3600000.0;
Misc.MillisecondsInDay = 86400000.0; // 1 day = 1000*60*60*24 = 86400000 miliseconds




Misc.getDaysBetweenDates = function(date1, date2) {
    var milisecondsDiff = date2.getTime() - date1.getTime();
    return parseInt(Math.ceil(milisecondsDiff/Misc.MillisecondsInDay));
}

Misc.getUTCDateClear = function(date) {
    var result = new Date(date);
    var day = result.getUTCDate();
    var month = result.getUTCMonth();
    var year = result.getUTCFullYear();    
    result.setTime(0);
    result.setDate(day);
    result.setMonth(month);
    result.setFullYear(year);
    return result;
}

Misc.addDaysToDate = function(date, days) {
    var result = new Date(date);
    result.setTime(result.getTime() + days * Misc.MillisecondsInDay);
    return result;
}

Misc.addDaysToDateClear = function(date, days) {
    var result = new Date(date);
    var day = result.getUTCDate();
    var month = result.getUTCMonth();
    var year = result.getUTCFullYear();    
    result.setTime(0);
    result.setDate(day);
    result.setMonth(month);
    result.setFullYear(year);
    result.setTime(result.getTime() + days * Misc.millisecondsinDay);
    return result;
}

Misc.addHoursToDate = function(date, hours) {
    var result = new Date(date);
    result.setTime(result.getTime() + hours * Misc.MillisecondsInHour);
    return result;
}

Misc.addHoursToDateClear = function(date, hours) {
    var result = new Date(date);
    var day = result.getUTCDate();
    var month = result.getUTCMonth();
    var year = result.getUTCFullYear();    
    result.setTime(0);
    result.setDate(day);
    result.setMonth(month);
    result.setFullYear(year);
    result.setTime(result.getTime() + hours * Misc.MillisecondsInHour);
    return result;
}

Misc.addMinutesToDate = function(date, minutes) {
    var result = new Date(date);
    result.setTime(result.getTime() + minutes * Misc.MillisecondsInMinute);
    return result;
}

Misc.addMinutesToDateClear = function(date, minutes) {
    var result = new Date(date);
    var hours = result.getUTCHours();
    var day = result.getUTCDate();
    var month = result.getUTCMonth();
    var year = result.getUTCFullYear();    
    result.setTime(0);
    result.setDate(day);
    result.setMonth(month);
    result.setFullYear(year);
    result.setUTCHours(hours);
    result.setTime(result.getTime() + minutes * Misc.MillisecondsInMinute);
    return result;
}

Misc.getYearStartDate = function(date) {
    var result = Misc.getUTCDateClear(date);
    result.setUTCMonth(0);
    result.setUTCDate(0);
    return result;
}

Misc.getWeekStartDate = function(date) {
    var result = Misc.getUTCDateClear(new Date(date));
    var dayInWeek = result.getDay();
    if(dayInWeek == 0) {
        return Misc.addDaysToDate(result, -6);
    }
    return Misc.addDaysToDate(result, -dayInWeek + 1);
}

// First week of year is odd
Misc.isWeekEven = function(date) {
    var clearDate = Misc.getUTCDateClear(date);
    var beginingOfYear = Misc.getYearStartDate(date);
    var daysSinceNewYear = Misc.getDaysBetweenDates(beginingOfYear, clearDate);
    var mod = (daysSinceNewYear + beginingOfYear.getDay() - 1) % 14;
    return (mod > 6);
}

Misc.insignificantZerosAlignment = function(value, zerosCount) {
    var strVal = value.toString();
    if(strVal.length >= zerosCount) {
        return strVal;
    }
    zerosCount -= strVal.length;
    while(zerosCount--) {
        strVal = "0" + strVal;
    }
    return strVal;
}

Misc.beautifyTimeSlices = function(timeSlices) {
	for(var i=0; i < timeSlices.length; i++) {
		Misc.beautifyTimeSlice(timeSlices[i]);
	}
}

Misc.beautifyTimeSlice = function(slice) {
    for(var j = 0; j < slice.timeIntervals.length; ++j) {
    	interval = slice.timeIntervals[j];
        interval.hour =  Misc.insignificantZerosAlignment(interval.hour, 2);
        interval.minutes =  Misc.insignificantZerosAlignment(interval.minutes, 2);
    }
}