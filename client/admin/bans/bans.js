if (Meteor.isClient) {	
	Template.bans.helpers({
		visible : function() {
			return Auth.isAdmin();
		},
	
		banned : function() {
			return Bans.find({}, {sort: {room: 1}});
		}
	});
	
	Template.bans.events({
		"submit .banRoom": function (event) {
			// Prevent default browser form submit
            event.preventDefault();
            
            var room = event.target.room.value;
            event.target.room.value = "";
            
            Meteor.call("banRoom", room);
        },
        "submit .unbanRoom": function (event) {
			// Prevent default browser form submit
            event.preventDefault();
            
            var room = event.target.room.value;
            Meteor.call("unbanRoom", room);
        }
	})
}