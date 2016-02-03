// Reservations collection document preferred schema:
// * date, type: Date
// * timeSliceID, type: reference
// * laundryShortIndex, type: integer
// * intervalsUsage, type: array of type: integer
ReservationsCollection = new Mongo.Collection('Reservations');

Reservations = new Object();

// This function check whether reservation object for given date exists in collection.
// Return true if exists, false otherwise.
Reservations.isReservationExists = function(_date, _laundryShortIndex) {
    var reservation = ReservationsCollection.find({ date: _date, laundryShortIndex: _laundryShortIndex}).fetch();
    return (reservation.length > 0);
}

//This function check whether reservation for specified day and interval index exists.
// Return true if exists, false otherwise.
Reservations.isReservationIntervalReserved = function(date, _laundryShortIndex, reservationIntervalIndex) {
    var result = Reservations.getReservationIntervalRoomId(date, _laundryShortIndex, reservationIntervalIndex);
    if(result == undefined){
        return undefined;
    }
    return (result != -1);
}

// This function return reservation interval room id for given date.
// If reservation doesn't exists or user apply out of intervals bound index return undefined.
Reservations.getReservationIntervalRoomId = function(_date, _laundryShortIndex, reservationIntervalIndex) {
    if(Reservations.isReservationExists(_date, _laundryShortIndex) == false) {
        return undefined;
    }
    else {
        var reservation = ReservationsCollection.find({date: _date, laundryShortIndex: _laundryShortIndex }).fetch();
        // For specified day should be only one reservation, if more than one - error!
        if(reservation.length > 1) {
            Logger.logError("There is more than one reservation for day [" + _date + "]. Using first one.");            
        }
        var currentReservation = reservation[0];
        // Check if specified index exists and is equal to -1 = free slot
        if(currentReservation.intervalsUsage.length <= reservationIntervalIndex) {
            Logger.logError("Attempt to use not existing slice of reservation for day [" + _date + "]. Using first one.");
            return undefined;
        }
        return currentReservation.intervalsUsage[reservationIntervalIndex];
    }
}

// This function try to create new reservation for given day and reservation slice index (specified time interval e.g. 8:00-12:00
// When no reservation for given day exists, then create a new one based on timeSlice specified for given day
// If reservation object exists, then check if reservation slice is not used and if so, check it as used by specified room
// Return -1 if operation fails, newly created/updated object in collection index otherwise.
Reservations.addReservation = function(_date, _laundryShortIndex, reservationIntervalIndex, roomId) {  
    if(reservationIntervalIndex < 0) {
        Logger.logError("Attempt to use less than zero slice index of reservation for day [" + _date + "]. Using first one.");
        return -1;
    }
    
    var timeSlice = TimeSlices.getTimeSliceForDay(_date, _laundryShortIndex);        
    if(timeSlice.timeIntervals.length <= reservationIntervalIndex) {
        Logger.logError("Attempt to use not existing slice of reservation for day [" + _date + "]. Using first one.");
        return -1;
    }
    
    if(isReservationPossible(_date, timeSlice, reservationIntervalIndex) == false) {
        Logger.logInfo("Trying to reserve interval which has begun!");
        return;
    }
    
    // If no reservation for given day, create new one
    if(Reservations.isReservationExists(_date, _laundryShortIndex) == false) {
        // Get timeSlice for given day
        
        var usageFlags = [];
        for(var i = 0; i < timeSlice.timeIntervals.length; ++i) {
            usageFlags.push(-1);
        }
        usageFlags[reservationIntervalIndex] = roomId;
        Logger.logInfo("Added new reservation object for day  [" + _date + "].");
        return ReservationsCollection.insert({
            date: _date,
            laundryShortIndex: _laundryShortIndex,
            intervalsUsage: usageFlags,
            timeSliceID: timeSlice._id
        });
    }
    else {
        if(Reservations.isReservationIntervalReserved(_date, _laundryShortIndex, reservationIntervalIndex) == true) {
            return -1;
        }    
        // Now we are sure that reservation object exists, and time intervals is in range and exists.
        return updateReservation(_date, _laundryShortIndex, reservationIntervalIndex, roomId);
    }
}

Reservations.rejectReservationInterval = function(_date, _laundryShortIndex, reservationIntervalIndex) {  
    var result = Reservations.isReservationIntervalReserved(_date, _laundryShortIndex, reservationIntervalIndex);
    if(result == undefined) {
        return;
    }
    // Check whether maximum time before rejection wasn't exceeded
    var timeSlice = TimeSlices.getTimeSliceForDay(_date, _laundryShortIndex);
    var interval = timeSlice.timeIntervals[reservationIntervalIndex];
    var intervalRejectDate = Misc.getUTCDateClear(_date);
    intervalRejectDate = Misc.addHoursToDate(intervalRejectDate, parseInt(interval.hour) - config.max_hours_before_reject);
    intervalRejectDate = Misc.addMinutesToDate(intervalRejectDate, parseInt(interval.minutes) - config.max_minutes_before_reject);
    var now = new Date();
    if(now > intervalRejectDate) {
        Logger.logInfo("Can't reject reservation!");
        return;
    }
    // reservation exists, interval index is correct, update it then
    updateReservation(_date, _laundryShortIndex, reservationIntervalIndex, -1);
}

Reservations.getRoomReservationsPerWeek = function(weekStartDate, roomId) {
    var weekEndDate = Misc.addDaysToDate(weekStartDate, 7);
    Logger.logInfo("Week start date = " + weekStartDate + ", week end date = " + weekEndDate);
    var reservations = ReservationsCollection.find({date: {$gte: weekStartDate, $lt: weekEndDate}, intervalsUsage: roomId }).fetch();
    return reservations.length;
}

Reservations.getRoomDayReservations = function(_date, roomId) {
    var reservations = ReservationsCollection.find({date: _date, intervalsUsage: roomId }).fetch();
    return reservations.length;
}

// Private
updateReservation = function(_date, _laundryShortIndex, reservationIntervalIndex, newRoomId) {  
    var reservation = ReservationsCollection.find({ date: _date, laundryShortIndex: _laundryShortIndex }).fetch();
    intervals = reservation[0].intervalsUsage;
    intervals[reservationIntervalIndex] = newRoomId;
    return ReservationsCollection.update({_id: reservation[0]._id}, { $set: { intervalsUsage: intervals} } );
}

// Check whether current time intervals has begun or not, if yes, then can't do reservation
isReservationPossible = function(_date, timeSlice, intervalIndex) {
    if(intervalIndex >= timeSlice.timeIntervals.length) {
        return false;
    }   
    
    var now = new Date();
    var interval = timeSlice.timeIntervals[intervalIndex];
    var intervalDate = Misc.getUTCDateClear(_date);
    intervalDate = Misc.addHoursToDate(intervalDate, parseInt(interval.hour));
    intervalDate = Misc.addMinutesToDate(intervalDate, parseInt(interval.minutes));
    var now = new Date();
    if(now > intervalDate) {
        return false;
    }
    return true;
}