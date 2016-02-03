TimeSlices = new Mongo.Collection('TimeSlices');
Meteor.subscribe("TimeSlices");

Reservations = new Mongo.Collection('Reservations');
Meteor.subscribe("Reservations");

Bans = new Mongo.Collection("bans");
Meteor.subscribe("bans");

Laundries = new Mongo.Collection("Laundries");
Meteor.subscribe("Laundries");

Notifications = new Mongo.Collection("Notifications");
Meteor.subscribe("Notifications");