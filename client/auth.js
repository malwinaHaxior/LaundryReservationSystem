Auth = new Object();

Auth.getRoom = function() {
	Meteor.call("getRoomNumber", function(err, result) {
		if (err) {
			console.log(err.reason);
		} else {
			Session.set("room", result);
		}
	});
	return parseInt(Session.get("room"));
}

Auth.isUser = function() {
	return true;
}

Auth.isAdmin = function() {
	return Meteor.user() != null;
}

Auth.isBanned = function() {
	var room = Auth.getRoom();
	if (!isNaN(room)) {
		var _room = parseInt(room);
		
		var banned = Bans.findOne({room: _room});
		if (banned != undefined) {
			return true;
		}
		else {
			return false;
		}
	}

	return false;
}