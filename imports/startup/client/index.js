import { $ } from 'meteor/jquery';
import dataTablesBootstrap from 'datatables.net-bs';

import 'bootstrap/dist/css/bootstrap.min.css';
import './routes.js';
import '/imports/ui/tables';
import 'datatables.net-bs/css/dataTables.bootstrap.css';

dataTablesBootstrap(window, $);