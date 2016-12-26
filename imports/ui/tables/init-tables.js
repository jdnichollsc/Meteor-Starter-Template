import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

export let TabularTables = {};
Meteor.isClient && Template.registerHelper('TabularTables', TabularTables);