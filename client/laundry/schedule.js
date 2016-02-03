Schedule = new Object();
// Result array containing data about all available reservations within day
// It's structure is as follow:
// {
//      day: integer,
//      month: integer,
//      year: integer,
//      status: array of
//      {
//          id: integer,
//          interval
//          {
//              lower:
//              {
//                  hour: integer,
//                  minutes: integer
//              },
//              upper:
//              {
//                  hour: integer,
//                  minutes: integer
//              }
//          },
//          usage: array of integer
//      },
//      weekEven: integer
//  }
Schedule.getSchedule = function() {

	var result = [];
    var today = Misc.getUTCDateClear(new Date());
    // get current laundry short index and find all time slices for this laundry
    var laundryIndex = parseInt(Session.get("activeLaundryIndex"));
	var timeSlices = TimeSlices.find({laundryShortIndex: laundryIndex}).fetch();
    console.log("TimeSlices.length = " + timeSlices.length);
    var daysPerTimeSlice = getDaysPerTimeSlice(timeSlices, 30);

    // Make time slices look better
    Misc.beautifyTimeSlices(timeSlices);
    
    for(var i = 0; i < timeSlices.length; ++i) {
        // Get lower bound for current time slice, needed to apply to new time slice
        lowerBound = timeSlices[i].timeIntervals[0];
        // Create reservation objects for each day for which this time slice is applied
        for(var j = 0; j < daysPerTimeSlice[i]; ++j) {               
            var _intervals = [];
            var k = 0;
            for(k = 1; k < timeSlices[i].timeIntervals.length; ++k) {
                prevIntervals = timeSlices[i].timeIntervals[k-1];
                currIntervals = timeSlices[i].timeIntervals[k];
                _intervals.push({lower: {hour: prevIntervals.hour, minutes: prevIntervals.minutes}, upper: {hour: currIntervals.hour, minutes: currIntervals.minutes}});
            }
            --k;
            _intervals.push({lower: {hour: timeSlices[i].timeIntervals[k].hour, minutes: timeSlices[i].timeIntervals[k].minutes}, upper: {hour: lowerBound.hour, minutes: lowerBound.minutes}});
            _status = [];
            for(var k = 0; k < _intervals.length; ++k) {
                _status.push( { id: k, interval: _intervals[k], usage: -1 });
            }
            result.push({ day: today.getUTCDate(), month: today.getUTCMonth() + 1, year: today.getUTCFullYear(), status: _status, weekEven:  Misc.isWeekEven(today) });
            today.setTime(today.getTime() + Misc.MillisecondsInDay);
        }
        // Now, if we aren't on last time slice, update our current time slice last day
        // with ending hour as first hour of next time slice
        if( i < timeSlices.length - 1 && result.length > 0) {
            lower = timeSlices[i + 1].timeIntervals[0];
            last = result[result.length - 1];
            last.status[ last.status.length - 1].interval.upper = lower;
            result[result.length-1] = last;
        }
    }
    result = updateSchedulesWithReservations(result);
	return result;
}

getDaysPerTimeSlice = function(timeSlicesArray, maxTimePeriod) {
    result = [];
    if( timeSlicesArray.length == 1) {
        result.push(maxTimePeriod);
    } else {
        var currentDay = Misc.getUTCDateClear(new Date());
        var daysAdded = 0;
        for(var i = 0; i < timeSlicesArray.length - 1; ++i) {
            var days = Misc.getDaysBetweenDates(currentDay, new Date(timeSlicesArray[i+1].startDate));
            currentDay = timeSlicesArray[i+1].startDate;            
            daysAdded += days;
            result.push(days);
        }   
        if(daysAdded < maxTimePeriod) {
            result.push(maxTimePeriod - daysAdded);            
        }
    }
    return result;
}

updateSchedulesWithReservations = function(schedules) {
    var lowerBound = Misc.getUTCDateClear(new Date());
    var upperBound = Misc.addDaysToDate(lowerBound, 30);
    var laundryIndex = parseInt(Session.get("activeLaundryIndex"));
    var reservation = Reservations.find({date: {$gte: lowerBound, $lte: upperBound}, laundryShortIndex: laundryIndex}, {sort: {date: 1}}).fetch();
    var scheduleIndex = 0;
    for(var i = 0; i < reservation.length; ++i) {
        if(scheduleIndex >= schedules.length) {
            break;
        }
        var day = reservation[i].date.getUTCDate();
        var month = reservation[i].date.getUTCMonth() + 1;
        var year = reservation[i].date.getUTCFullYear();
        for(; scheduleIndex < schedules.length; ++scheduleIndex) {
            if(schedules[scheduleIndex].day == day && schedules[scheduleIndex].month == month && schedules[scheduleIndex].year == year) {
                for(var j = 0; j < schedules[scheduleIndex].status.length; ++j){ 
                    schedules[scheduleIndex].status[j].usage = reservation[i].intervalsUsage[j];
                }  
                break;
            }
        }
    }
    return schedules;
}