Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function() {
    this.render('main');
    this.render('upperMenu', {to: 'upperMenu'}); 
});

Router.route('/adminLogin', function() {
	this.render('adminLogin');
    this.render('upperMenu', {to: 'upperMenu'}); 
});

Router.route('/admin/bans', function() {
	this.render('bans');
    this.render('upperMenu', {to: 'upperMenu'}); 
});

Router.route('/admin/notifications', function() {
	this.render('notifications');
    this.render('upperMenu', {to: 'upperMenu'}); 
});

Router.route('/admin/laundryManagement/:index', function() {
    var params = this.params;
    var id = params.index; 
    Session.set("managementLaundryIndex", id);
	this.render('laundryManagement');
    this.render('upperMenu', {to: 'upperMenu'}); 
});

Router.route('/laundry/:index', function() {
    var params = this.params;
    var id = params.index; 
    Session.set("activeLaundryIndex", id);
	this.render('laundry');
    this.render('upperMenu', {to: 'upperMenu'}); 
});
