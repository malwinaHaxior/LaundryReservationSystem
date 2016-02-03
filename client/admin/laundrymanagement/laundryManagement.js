if (Meteor.isClient) {	
	Template.laundryManagement.helpers({
		visible : function() {
			return Auth.isAdmin();
		},
		laundry : function() {
            var laundry = Laundries.find({shortIndex: parseInt(Session.get("managementLaundryIndex"))}).fetch();
            if(laundry.length < 1) {
                return "ERROR! NO LAUNDRY SPECIFIED SHORT INDEX EXISTS!";
            }
            else {
                return laundry[0];
            }
		},
		timeSlices: function() {
			var timeSlices = TimeSlices.find({laundryShortIndex: parseInt(Session.get("managementLaundryIndex"))}).fetch();		
	        var result = [];
	            
	        for(var i=0; i < timeSlices.length; i++) {
	        	var timeSlice = timeSlices[i];
	            Misc.beautifyTimeSlice(timeSlice);
	            var wrapper = new TimeSliceWrapper(timeSlice);
	            result.push(wrapper);
	        }
	            
	        return result;
	    }
	});
	
	Template.laundryManagement.events({
		"submit .createNewTimeSlice": function(event) {
			event.preventDefault();
			
			var laundryIndex = parseInt(event.target.shortIndex.value);
			Meteor.call("createNewTimeSlice", laundryIndex);
		}
	});
	
	Template.laundryTimeSlice.events({
		
		"submit .updateStartDate": function (event) {
			event.preventDefault();
			
			var startDate = event.target.datePicker.value;
			var tsID = event.target.timeSliceID.value;
			if(startDate != undefined && startDate.length > 0) {
				var dateSplitted = startDate.split(".");
				if(dateSplitted.length == 3) {
					var date = new Date();
				    date.setTime(0);
				    date.setDate(dateSplitted[0]);
				    date.setMonth(dateSplitted[1]);
				    date.setYear(dateSplitted[2]);
				    					
					Meteor.call("updateStartDate", tsID, date);
				}
			}       
		},
		
		"submit .addTimeInterval": function (event) {
			event.preventDefault();
            
			var tsID = event.target.timeSliceID.value;
			
			var time = event.target.timePicker.value;
			if(time != undefined && time.length > 0) {
				var timeSplitted = time.split(":");
				if(timeSplitted.length == 2) {
					var timeJSON = {hour: parseInt(timeSplitted[0]), minutes: parseInt(timeSplitted[1])};
					Meteor.call("addTimeInterval", tsID, timeJSON);
				}
			}
		},
		
		"submit .deleteTimeInterval": function (event) {
			event.preventDefault();           
			var tsID = event.target.timeSliceID.value;
			
			var time = event.target.timeSliceBegin.value;
			if(time != undefined && time.length > 0) {
				var timeSplitted = time.split(":");
				if(timeSplitted.length == 2) {
					var timeJSON = {hour: parseInt(timeSplitted[0]), minutes: parseInt(timeSplitted[1])};
					Meteor.call("deleteTimeInterval", tsID, timeJSON);
				}
			}
		},
		
		"submit .removeTimeSlice": function (event) {
			event.preventDefault();
            
			var tsID = event.target.timeSliceID.value;
			Meteor.call("removeTimeSlice", tsID);
		}
	});
	
	Template.beginDatePicker.onRendered(function() {
		Template.instance().$('#datePicker').datetimepicker({
			 format: 'DD.MM.YYYY'
		 }).on("dp.change", function (e) {
	         // 
	     });
	});
	
	Template.timepicker.onRendered(function() {
		var _defaultDate = new Date();
		_defaultDate.setHours(12);
		_defaultDate.setMinutes(0);
		_defaultDate.setSeconds(0);
		
		$('.timepicker').datetimepicker({
			format: 'HH:mm',
			defaultDate: _defaultDate
		});
	});
}