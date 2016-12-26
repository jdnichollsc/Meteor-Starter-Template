import { Blaze } from 'meteor/blaze';
import { Template } from 'meteor/templating';

import './index.html';
import './userVehicles.js';

Template.index.events({
    'click .toggleChildRows'(event, template) {
        toggleChildRows(event, Template.userVehicles);
    }
});

let toggleChildRows = (event, template) => {
    var tr = $(event.currentTarget).closest('tr');
    var table = tr.closest('table').DataTable();
    var row = table.row(tr);

    if ( row.child.isShown() ) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass('shown');
    } else {
        // Open this row
        row.child('<table></table>').show();
        var data = row.data();
        Blaze.renderWithData(template, data, $(row.child()[0]).find('td')[0]);
        tr.addClass('shown');
    }
};