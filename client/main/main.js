if (Meteor.isClient) {
	Template.main.helpers({
		notifications : function() {
			return Notifications.find({});
		}
	});
}
