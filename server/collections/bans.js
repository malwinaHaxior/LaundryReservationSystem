// Bans collection document preferred schema:
// * room, type: integer
// * creationDate, type: Date
BansCollection = new Mongo.Collection("bans");

Bans = new Object();

Bans.ban = function(_room, _date) {
	if(!this.isBanned(_room)) {
		BansCollection.insert({room: _room, creationDate: _date});
	}
}

Bans.unban = function (_room) {
	BansCollection.remove({room: _room});
}

Bans.isBanned = function(_room) {
	var banned = BansCollection.findOne({room: _room});
	if (banned != undefined) {
		return true;
	}
	else {
		return false;
	}
}

Bans.getBanned = function() {
	return BansCollection.find({});
}