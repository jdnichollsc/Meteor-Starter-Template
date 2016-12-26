import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import Tabular from "meteor/aldeed:tabular";
import { Template } from 'meteor/templating';

import { TabularTables } from './init-tables';
import Users from "/imports/api/users/users";
import Vehicles from "/imports/api/vehicles/vehicles";

if(Meteor.isClient){
  import '/imports/ui/components/tables/detailsControl.js';
  import '/imports/ui/components/tables/options.js';
}

TabularTables.Users = new Tabular.Table({
  name: "Users",
  collection: Users,
  columns: [
    {
      tmpl: Meteor.isClient && Template.detailsControl
    },
    {data: "email", title: "Email"},
    {data: "firstName", title: "First Name"},
    {data: "lastName", title: "Last Name"},
    {data: "birthdate", title: "Last Name"},
    {
      data: "birthdate",
      title: "Birthdate",
      render: renderDateFormat
    },
    {
      tmpl: Meteor.isClient && Template.tableOptions,
      title: "Options",
    }
  ],
  responsive: true,
  autoWidth: false,
  extraFields: ['vehicles']
});

TabularTables.Vehicles = new Tabular.Table({
  name: "Vehicles",
  collection: Vehicles,
  columns: [
    {data: "model", title: "Model"},
    {data: "year", title: "Year"},
    {data: "brand", title: "Brand"},
    {data: "price", title: "Price"}
  ],
  responsive: true,
  autoWidth: false,
  "paging": false,
  "searching": false,
  "info": false
});


var renderDateFormat = (val, type, doc) => {
  if (val instanceof Date) {
    return moment(val).format('MMM-DD-YYYY');
  } else {
    return "...";
  }
};