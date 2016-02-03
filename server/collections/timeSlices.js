// TimeSlices collection document preferred schema:
// * startDate, type: Date
// * timeIntervals, type: array of type: {hour: integer, minutes: integer}
// * laundryShortIndex, type: integer
// Documents in this collection contain data about time intervals for each day.
// startDate is date from which this time intervals appy to days.
// timeIntervals can by array of any string object data which are day-time slices.
// Lets say we have array containing elements [ {hour: 8, minutes: 0}, {hour: 10, minutes: 30}, {hour: 12, minutes: 45}, (...) ]
// So this means that we have in given day we have intervals:
// 8:00-10:30, 10:30-12:45 and so on

TimeSlicesCollection = new Mongo.Collection('TimeSlices');

TimeSlices = new Object();

TimeSlices.addTimeSlice = function(_startDate, _laundryShortIndex, _timeIntervals) {
    TimeSlicesCollection.insert({
        startDate: _startDate,
        laundryShortIndex: _laundryShortIndex,
        timeIntervals: _timeIntervals
    });
    
    Logger.logInfo("Created new TimeSlice for laundry=" + _laundryShortIndex + " date=" + _startDate);
}

TimeSlices.removeTimeSlice = function(id) {

    TimeSlicesCollection.remove({
        _id: id
    });
    
    Logger.logInfo("Removed TimeSlice _id=" + id);
}

TimeSlices.getTimeSliceForDay = function(date, _laundryShortIndex) {
    return TimeSlicesCollection.find({ startDate: {$lte: date}, laundryShortIndex: _laundryShortIndex}, {sort: {startDate: -1}}).fetch()[0];
}

TimeSlices.addTimeInterval = function(id, _timeInterval) {
	TimeSlicesCollection.update( {_id: id}, {
		$addToSet: {timeIntervals: _timeInterval}
    });
	
	Logger.logInfo("added TimeInterval for _id=" + id);
}

TimeSlices.deleteTimeInterval = function(id, _timeInterval) {
	TimeSlicesCollection.update({_id: id}, {
			$pull: { timeIntervals: _timeInterval } 
	});
	
	Logger.logInfo("deleted TimeInterval for _id=" + id);
}

TimeSlices.updateStartDate = function(id, _startDate) {	
	TimeSlicesCollection.update({_id: id}, {
			$set: { startDate: _startDate } 
	});
	
	Logger.logInfo("updated startDate for _id=" + id);
}