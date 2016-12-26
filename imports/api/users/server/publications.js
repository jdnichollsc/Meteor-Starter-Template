import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Users from '../users';

Meteor.publish('users.list', () => Users.find());

Meteor.publish('users.find', (_id) => {
  check(_id, String);
  return Users.find(_id);
});
