if (Meteor.isClient) {	
	Template.notifications.helpers({
		notifications : function() {
			return Notifications.find({});
		}
	});
	
	Template.notifications.events({
		"submit .addNotification": function (event) {
			// Prevent default browser form submit
            event.preventDefault();
            
            var author = event.target.author.value;
            var title = event.target.title.value;
            var message = event.target.message.value;
            if( author == "" || title == "" || message == "") {
                return;
            }
            Meteor.call("addNotification", author, title, message);
        },
        "submit .removeNotification": function (event) {
			// Prevent default browser form submit
            event.preventDefault();
            
            var id = event.target.id.value;
            Meteor.call("removeNotification", id);
        }
	})
}