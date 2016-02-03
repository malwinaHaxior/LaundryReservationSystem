Meteor.publish("TimeSlices", function () {
    var allTimeSlices = TimeSlicesCollection.find();  

    // First case - only one timeSlice
    if(allTimeSlices.count() < 2) {
        return allTimeSlices;
    }
    // Otherwise get newest actual timeSlice
    allTimeSlices = allTimeSlices.fetch();
    
    var today = Misc.getUTCDateClear(new Date());
    var newestActive = getNewestActiveTimeSlice(today, allTimeSlices);
    if(newestActive == null) {
        Logger.logError("No active timeSlice!");
    }
    var todayPlusMonth =  Misc.addDaysToDate(today, 30);

    var result = TimeSlicesCollection.find({}, {sort: {startDate: 1}});
    Logger.logInfo("Active time slices count = " + result.count());
    return result;
});

Meteor.publish("Reservations", function () {    
    var reservations = ReservationsCollection.find();
    return reservations; 
});

Meteor.publish("Laundries", function () {    
    var result = LaundriesCollection.find();
    return result; 
});


Meteor.publish("bans", function () {    
    var bans = BansCollection.find({});
    return bans; 
});

getNewestActiveTimeSlice = function(date, timeSlicesArray) {
    var result = null;
    for( i = 0; i < timeSlicesArray.length; ++i) {
        result = timeSlicesArray[i];
        if( Misc.getDaysBetweenDates(date, timeSlicesArray[i].startDate) >= 0) {
            if(i > 0) {
                result = timeSlicesArray[i - 1];
            }
            break;
        }
    }
    return result;
};

Meteor.publish("Notifications", function () {    
    var result = NotificationsCollection.find({}, {sort: {creationDate: -1}});
    return result; 
});
