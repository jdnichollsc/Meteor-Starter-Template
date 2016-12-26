import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Users = new Mongo.Collection('Users');
export default Users;

Users.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Users.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Users.schema = new SimpleSchema({
  email: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  birthdate: {
    type: Date
  },
  vehicles: {
    type: [Number]
  }
});

Users.attachSchema(Users.schema);