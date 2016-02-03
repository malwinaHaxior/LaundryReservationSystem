if (Meteor.isClient) {
    Template.reservationsTable.helpers({
        schedule : function() {
            return Schedule.getSchedule();
        }
    });
    
    Template.status.helpers({
		room : function() {
            Auth.getRoom();
            return Session.get("room");
        },
		banned : function() {
            return Auth.isBanned();
        }, 
	});
    
    Template.status.events({
        "submit .doReservation": function (event) {
        	// Prevent default browser form submit
            event.preventDefault();
            
            var day = event.target.day.value;
            var month = event.target.month.value;
            var year = event.target.year.value;
            var intervalId = event.target.intervalId.value;            
            Meteor.call("reserveDayInterval", day, month, year, Session.get("activeLaundryIndex"), intervalId);
        },
        "submit .rejectReservation": function (event) {
        	// Prevent default browser form submit
            event.preventDefault();
            
            var day = event.target.day.value;
            var month = event.target.month.value;
            var year = event.target.year.value;
            var intervalId = event.target.intervalId.value;      
            Meteor.call("rejectDayInterval", day, month, year, Session.get("activeLaundryIndex"), intervalId);
        }
    });

    Template.registerHelper('compare', function(v1, v2) {
      if (typeof v1 === 'object' && typeof v2 === 'object') {
        return _.isEqual(v1, v2); // do a object comparison
      } else {
        return v1 === v2;
      }
    });
    
}
