import moment from 'moment';
import { Random } from 'meteor/random';

import Users from "/imports/api/users/users";
import Vehicles from "/imports/api/vehicles/vehicles";

if (Vehicles.find().count() === 0) {
    for (var index = 0; index < 100; index++) {
        Vehicles.insert({
            code: (index + 1),
            model: "Ferrari" + (index + 100),
            year: 2016,
            brand: 'Ferrari',
            price: 10000000 * index
        });
    }
}

if (Users.find().count() === 0) {
    var vehicles = Vehicles.find().fetch();
    for (var index = 0; index < 26; index++) {
        Users.insert({
            email: ['user', index + 1, '@gmail.com'].join(''),
            firstName: "user " + (index + 1),
            lastName: "meteorite",
            birthdate: moment().subtract(index, 'd').toDate(),
            vehicles: [
                Random.choice(vehicles).code,
                Random.choice(vehicles).code
            ]
        });
    }
}