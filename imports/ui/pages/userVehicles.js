import { Template } from 'meteor/templating';

import './userVehicles.html';

Template.userVehicles.helpers({
    selector: function(){
        var instance = this;
        return {
            code : { $in: instance.vehicles }
        };
    }
});