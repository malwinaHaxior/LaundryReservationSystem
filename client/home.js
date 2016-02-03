if (Meteor.isClient) {
	Template.userInfoTmpl.helpers({
		banned : function() {
			return Auth.isBanned();
		},
		visible : function() {
			return Auth.isUser() && !Auth.isBanned();
		},
		room : function() {
            Auth.getRoom();
            return Session.get("room");
        },
        accessLevel : function() {
            var isAdmin = Auth.isAdmin();
            if(isAdmin) {
                return "admin";
            } 
            else {
                return "user";
            }
        }
	});
}
