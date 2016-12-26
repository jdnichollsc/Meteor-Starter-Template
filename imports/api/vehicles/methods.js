import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import Vehicles from './vehicles';

export const removeVehicle = new ValidatedMethod({
  name: 'vehicles.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Vehicles.remove(_id);
  },
});