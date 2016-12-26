import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Vehicles from '../vehicles';

Meteor.publish('vehicles.list', () => Vehicles.find());

Meteor.publish('vehicles.find', (_id) => {
  check(_id, String);
  return Vehicles.find(_id);
});
