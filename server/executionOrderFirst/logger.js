Logger = new Object();
fs = Npm.require('fs');
    
Logger.init = function(){
    // Get params from config file
    Logger.logFilename = "log.txt";
    Logger.logFilenamePath = "../../../../../"
    if(config.logFilename != null && config.logFilename != "")
    {
        Logger.logFilename = config.logFilename;
    }
    
    if(config.logFilenamePath != null && config.logFilenamePath != "")
    {
        Logger.logFilenamePath = config.logFilenamePath;
    }

    console.log("Opening log file at: " + Logger.getFullPath());
    Logger.logInfo("LogFile started at " + js_yyyy_mm_dd_hh_mm_ss());
}

Logger.logInfo = function(message) {
    var methodName = arguments.callee.caller.name;
    logToFile(message, "INFO", methodName);
}

Logger.logWarning = function(message) {
    var methodName = arguments.callee.caller.name;
    logToFile(message, "WARNING", methodName);
}

Logger.logError = function(message) {
    var methodName = arguments.callee.caller.name;
    logToFile(message, "ERROR", methodName);
}

function logToFile(message, messageHeader, caller) {
    var output = "[" + caller + "][" + messageHeader + "] " + js_yyyy_mm_dd_hh_mm_ss() + ": " + message + "\n";
    fs.appendFile (Logger.getFullPath(), output, { flags: 'wx' }, function (err,data) {
      if (err) {
        return console.log("Logger error: " + err);
      }
      console.log(output); 
    }); 
}
 
Logger.getFullPath = function() {
    return createFileFullpath(Logger.logFilename, Logger.logFilenamePath);
}

function createFileFullpath(filename, filePath) {
    return filePath + filename;
}

function js_yyyy_mm_dd_hh_mm_ss () {
  now = new Date();
  year = "" + now.getUTCFullYear();
  month = "" + (now.getUTCMonth() + 1); if (month.length == 1) { month = "0" + month; }
  day = "" + now.getUTCDate(); if (day.length == 1) { day = "0" + day; }
  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}