// Laundry collection document preferred schema:
// * name, type: string
// * floorNumber, type: integer
// * shortIndex, type: integer
LaundriesCollection = new Mongo.Collection("Laundries");

Laundry = new Object();

Laundry.addLaundry = function(_name, _floorNumber, _shortIndex) {
    return LaundriesCollection.insert({name: _name, floorNumber: _floorNumber, shortIndex: _shortIndex});
}