TimeSliceWrapper = function (_ts) {
	this.object = _ts;
};

TimeSliceWrapper.prototype.addTimeInterval = function(_hour, _minutes) {
	if(object != undefined) {
		object.timeInterval.push({hour: _hour, minutes: _minutes});
	}
};

TimeSliceWrapper.prototype.editable = function() {
	if(this.object == undefined || this.object._id == undefined) {
		return false;
	} 
	var res = Reservations.findOne({timeSliceID: this.object._id});
	
	return (res == undefined);
};

TimeSliceWrapper.prototype.startDateAsPlainText = function() {
	if(this.object != undefined) {
		var startDate = this.object.startDate;
		
		var day = parseInt(startDate.getDate());
		var month = 1 + parseInt(startDate.getMonth());
		var year =  startDate.getFullYear();
		
		
		return "" 
				+ ((day >= 10) ? day : "0" + day) + "." 
				+ ((month >= 10) ? month : "0" + month) + "." 
				+ year;
	}
};

TimeSliceWrapper.prototype.getRaw = function() {
	return this.object;
};