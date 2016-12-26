import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Vehicles = new Mongo.Collection('Vehicles');
export default Vehicles;

Vehicles.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Vehicles.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Vehicles.schema = new SimpleSchema({
  code: {
    type: Number
  },
  model: {
    type: String
  },
  year: {
    type: String
  },
  brand: {
    type: String
  },
  price: {
    type: Number
  }
});

Vehicles.attachSchema(Vehicles.schema);