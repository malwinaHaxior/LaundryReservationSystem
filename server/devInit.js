// this file initializes the project in development mode
Meteor.startup(function() {
    Logger.logInfo("Config: " + JSON.stringify(config));
    if(config.run_mode != "dev") {
        return;
    }
	clearTables([ TimeSlicesCollection, ReservationsCollection, LaundriesCollection, BansCollection, NotificationsCollection, Meteor.users]);
	
	Accounts.createUser({username: "admin", email: "admin@root.com", password: "admin"});
	// initialize tables
    
    // Create two laundries
    Laundry.addLaundry("1st floor laundry", 1, 0);
    Laundry.addLaundry("3st floor laundry", 2, 1);
    
    // Create new timeSliceGroup
    var date = new Date();
    date.setTime(0);
    date.setDate(6);
    date.setMonth(0);
    date.setYear(1970);
    var sliceID = TimeSlices.addTimeSlice(date, 0, [{hour: 8, minutes: 0}, {hour: 12, minutes: 0}, {hour: 16, minutes: 0}, {hour: 20, minutes: 0}]);    
    Logger.logInfo("Added test timeSlice to database [id: " + sliceID + "]");
    var sliceID = TimeSlices.addTimeSlice(date, 1, [{hour: 8, minutes: 0}, {hour: 12, minutes: 0}, {hour: 16, minutes: 0}, {hour: 20, minutes: 0}]);
    Logger.logInfo("Added test timeSlice to database [id: " + sliceID + "]");
    date.setYear(2016);
    date.setMonth(1);
    date.setDate(12);
    sliceID = TimeSlices.addTimeSlice(date, 0, [{hour: 5, minutes: 30}, {hour: 7, minutes: 15}, {hour: 10, minutes: 0}, {hour: 12, minutes: 30}, {hour: 15, minutes: 45}, {hour: 17, minutes: 0}, {hour: 20, minutes: 25}, {hour: 23, minutes: 30}]);
    Logger.logInfo("Added test timeSlice to database [id: " + sliceID + "]");
    
    Logger.logInfo("Reservations.length = " + ReservationsCollection.find({}).fetch().length);
    
    date.setDate(30);
    sliceID = TimeSlices.addTimeSlice(Misc.addDaysToDate(Misc.getUTCDateClear(new Date()), 12), 1, [{hour: 10, minutes: 0}, {hour: 14, minutes: 30}, {hour: 20, minutes: 0}]);
    Logger.logInfo("Added test timeSlice to database [id: " + sliceID + "]");
    
    date = ( Misc.addDaysToDate(Misc.getUTCDateClear(new Date()), 6));
    Reservations.addReservation( date, 0, 0, 314);
    Logger.logInfo("Reservations: " + JSON.stringify(ReservationsCollection.find({}).fetch()));
    
    // bans
    Bans.ban(51);
    Logger.logInfo("Bans.length = " + BansCollection.find({}).fetch().length);
    
    Notifications.addNotification("admin", new Date(), "New system now available!", "Hello! New laundries reservation system is working now! Be happy!", 1);
    Notifications.addNotification("Sir Patrick Alevart", new Date(), "Sir Patrick Alevart", "Test notification by Sir Patrick Alevart.", 1);
    Notifications.addNotification("Marcin Krzak", new Date(), "Long test message from Marcin Krzak.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 1);
    Logger.logInfo("Notifications.length = " + NotificationsCollection.find({}).fetch().length);
    Logger.logInfo("Week start date = " + Misc.getWeekStartDate(new Date()));
});

clearTables = function(tables) {
	tables.forEach(function(table) {
		table.remove({});
	});
}
