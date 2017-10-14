// Setting test environment
process.env.NODE_ENV = 'test';

// Running Socket server
// require('./../mock/server.js');

import { OrganizationModelTest } from './models/OrganizationModelTest';
import { DictionnaryTest } from './commons/collections/DictionnaryTest';
import { DiffUtilsTest } from './utils/DiffUtilsTest';
import { DiffResultArrayTest } from './models/DiffResultArrayTest';

OrganizationModelTest();
DictionnaryTest();
DiffResultArrayTest();
DiffUtilsTest();