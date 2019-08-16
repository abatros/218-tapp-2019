import { Meteor } from 'meteor/meteor';
const {api} = require ('./219-openacs-api');
const {tapp} = require ('./220-tapp-lib');

import {pg_connect, pg_disconnect} from './postgres.js';
import './methods/tutors-directory.js'
import './methods/agencies-directory.js'
import './methods/schools-directory.js'
import './methods/districts-directory.js'
import './methods/students-directory.js'

import './methods/contracts-directory.js'
import './methods/contract-new-agency-file.js'

import './methods/pull-contract.js'
import './methods/pull-contract-file.js'
import './methods/pull-student.js'
import './methods/pull-tutor.js'
import './methods/pull-district.js'
import './methods/pull-school.js'
import './methods/pull-agency.js'

import './methods/new-district.js'
import './methods/new-school.js'

import './methods/update-district.js'
import './methods/update-school.js'
import './methods/update-agency.js'
import './methods/update-contract-file.js'

import './methods/drop-contract-file.js'


Meteor.startup(() => {
  console.log(`code to run on server at startup`);
  pg_connect({pg_monitor:true})
  .then(db =>{
    console.log('>>Connected.')
  })
  .then(async () =>{
    return tapp.get_tapp_instance({
      instance_name: 'tapp-2019'
    })
  })
  .then((instance) =>{
    console.log('main@20:',{instance})
    return tapp.get_tapp_metadata(instance)
  })
  .then(async ()=>{
    await api.acs_object_type__create_type({
      object_type: 'tapp.contract-agency-file',
      pretty_name: 'tapp Contract Agency-file',
      pretty_plural: 'tapp Contract Agency-files',
      supertype: 'content_item',
      abstract_p: false
    })
//    .then()
    .catch(err =>{
      if (err.code != 23505) throw err;
      console.log(`object-type tapp.contract-agency-file =>`,err.detail)
    })
  })
  .then(async ()=>{
    console.log(`api.acs_rel_type__create_type(tapp.contract-agency-rel)...`)
    await api.acs_rel_type__create_type({
      rel_type: 'tapp.contract-agency-rel',             // object_type
      object_type_one: 'tapp.contract-agency-file', //'content_item', // contract-agency-file
//      role_one,             // acs_rel_role,
//      min_n_rels_one =0,
//      max_n_rels_one,
      object_type_two: 'tapp.agency',
//      role_two: 'tapp.tutor', MUST BE IN TABLE acs_rel_roles....
//      min_n_rels_two =0,
//      max_n_rels_two,
//      composable_p = true,

      // acs_object_types
      pretty_name: 'tapp-instance Contract-Agency-file relation',
      pretty_plural: 'tapp-instance Contract-Agency-file relations',
//      supertype: ,            // object_type
//      table_name,
//      id_column,
//      package_name,
    })
    .then(retv =>{
      console.log(`api.acs_rel_type__create_type(tapp.contract-agency-rel) =>`,{retv})
    })
    .catch(err =>{
      if (err.code != 23505) throw err;
      console.log(`api.acs_rel_type__create_type(tapp.contract-agency-rel) =>`,err.detail)
    })

  })

  console.log('Leaving Meteor.startup')
});
