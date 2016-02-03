Meteor.methods({
    reserveDayInterval: function (day, month, year, laundryShortIndex, intervalId) {
        date = Misc.getUTCDateClear(new Date());
        date.setDate(parseInt(day));
        date.setMonth(parseInt(month) - 1);
        date.setFullYear(parseInt(year));
        
        var todayPlusMonth =  Misc.addDaysToDate(Misc.getUTCDateClear(new Date()), 30);
        
        // First guard - user can't do reservation for day +30 days in future
        if( date > todayPlusMonth) {
            return;
        }
        
        intervalId = parseInt(intervalId);    
        var roomId = Meteor.call("getRoomNumber");
        if(Bans.isBanned(roomId) == true) {  
            return;
        }
        
        var weekStart = Misc.getWeekStartDate(date);
        // Second guard - user can has only specified amount of reservations per week and per single day
        if(Reservations.getRoomReservationsPerWeek(weekStart, roomId) < config.max_res_per_week && Reservations.getRoomDayReservations(date, roomId) < config.max_res_per_day) {
            Reservations.addReservation(date, parseInt(laundryShortIndex), intervalId, roomId);
            return;
        }
        else {
            Logger.logInfo("Room [" + roomId + "] has exceeded maximum number of reservations for given week/day");
            return;
        }
    },   
    rejectDayInterval: function (day, month, year, laundryShortIndex, intervalId) {
        intervalId = parseInt(intervalId);  
        date = Misc.getUTCDateClear(new Date());
        date.setDate(parseInt(day));
        date.setMonth(parseInt(month) - 1);
        date.setFullYear(parseInt(year));
        var userRoomId = Meteor.call("getRoomNumber");
        // Check if reservation for this time interval exists and is connected to this user
        var roomId = Reservations.getReservationIntervalRoomId(date, parseInt(laundryShortIndex), intervalId);
        if(roomId == undefined) {
            return
        }
        else if(roomId == userRoomId) {
            // all is correct, reject reservation
            Reservations.rejectReservationInterval(date, parseInt(laundryShortIndex), intervalId);
        }
        
    },    
    getRoomNumber: function() {
        clientIP = this.connection.clientAddress;
        numbers = clientIP.toString().split(".");
        return (parseInt(numbers[3]) + 50);
    },
    banRoom: function(_room) {
    	var room = parseInt(_room);
    	if(!isNaN(room)){
    		Bans.ban(room, new Date());
    	}
    },
    unbanRoom: function(_room) {
    	var room = parseInt(_room);
    	if(!isNaN(room)){
    		Bans.unban(room);
    	}
    },
    
    // Time Slices
    addTimeInterval: function(_id, _timeInterval) {
        if(Auth.isAdmin() == false) {
            return;
        }
    	TimeSlices.addTimeInterval(_id, _timeInterval); 
    },
    deleteTimeInterval: function(_id, _timeInterval) {
        if(Auth.isAdmin() == false) {
            return;
        }
    	TimeSlices.deleteTimeInterval(_id, _timeInterval); 
    },
    updateStartDate: function(_id, _startDate) {  	
        if(Auth.isAdmin() == false) {
            return;
        }
        TimeSlices.updateStartDate(_id, _startDate); 
    },
    createNewTimeSlice: function(laundryIndex) {
        if(Auth.isAdmin() == false) {
            return;
        }
        TimeSlices.addTimeSlice(new Date(), laundryIndex, []);
    },
    removeTimeSlice: function(_id) {
        if(Auth.isAdmin() == false) {
            return;
        }
        TimeSlices.removeTimeSlice(_id);
    },
    
    // Notifications
    addNotification: function(_author, _title, _message) {
        if(Auth.isAdmin() == false) {
            return;
        }
        Notifications.addNotification(_author, new Date(), _title, _message, 0);
    },
    removeNotification: function (id) {
        if(Auth.isAdmin() == false) {
            return;
        }
        Notifications.removeNotification(id);
    }
});