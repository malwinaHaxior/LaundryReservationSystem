if (Meteor.isClient) {
    Template.adminLogin.helpers({
        loggedIn: function() {
            return Meteor.user() != null;
        }
    });
    
   Template.adminLogin.events({
        "submit .login": function (event) {
        	// Prevent default browser form submit
            event.preventDefault();
            
            var username = event.target.username.value;
            var password = event.target.password.value;       
            Meteor.loginWithPassword(username, password);
        }
    });
}