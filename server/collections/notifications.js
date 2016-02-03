// Notifications collection document preferred schema:
// * author, type: reference
// * creationDate, type: Date
// * title, type: string
// * message, type: string
// * priority, type: integer
NotificationsCollection = new Mongo.Collection("Notifications");

Notifications = new Object();


Notifications.addNotification = function(_author, _creationDate, _title, _message, _priority) {
    return NotificationsCollection.insert({author: _author, creationDate: _creationDate, title: _title, message: _message, priority: _priority});
}

Notifications.removeNotification = function(id) {
    // Check wheter id exists
    if(NotificationsCollection.findOne({_id: id}).count < 1) {
        return;
    }
    return NotificationsCollection.remove({_id: id});
}