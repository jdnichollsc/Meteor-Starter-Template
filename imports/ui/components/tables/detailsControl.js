import { Template } from 'meteor/templating';
import './detailsControl.html';

Template.detailsControl.onRendered(function () {
    
    //$("[data-toggle=tooltip]").tooltip();
});

Template.detailsControl.events({
    'click .toggleChildRows': function(e){
        e.preventDefault();

        var $button = $(e.target);
        $button.toggleClass('glyphicon-zoom-in').toggleClass('glyphicon-zoom-out');
    }
});