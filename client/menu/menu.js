if (Meteor.isClient) {
    
    Template.upperMenu.helpers({
		isAdmin : function() {
            return Auth.isAdmin();
        }
	});
    
	Template.upperMenu.helpers({
		laundries : function() {
            console.log("Laundries.find({}).fetch().length = " + Laundries.find({}).fetch().length);
			return Laundries.find({}).fetch();
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
