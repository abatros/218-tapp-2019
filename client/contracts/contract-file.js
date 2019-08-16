const YAML = require('js-yaml');
import './contract-file.html'
import {modal_panel, tapp, _assert} from '../app-client.js'

const TP = Template.contract_file;

const contract_file = new ReactiveVar();

TP.onCreated(function() {
  const tp = this;
  const item_id = this.data.id();
  console.log(`this.data.id:`,item_id)
  tp.html_yaml = new ReactiveVar();

  Meteor.call('pull-contract-file', {item_id},(err, retv)=>{
    if (err) throw err;
    console.log({retv})
    const {
      name, title,
      contract_number, contract_id,
      agency_title, agency_id,
      //user_id, username, first_names, last_name,
      student_id, student_name,
      tutor_id, tutor_name,
      district_id, district_label,
      tutor_data,
      data // jsonb
    } = retv;

    const cfile = {
      item_id, name, title,
      contract_number, contract_id,
      agency_title, agency_id,
      district_id, district_label,
      student_id, student_name,
      tutor_id, tutor_name,
      tutor: {
        first_names: tutor_data.first_names,
        last_name: tutor_data.last_name,
        city: tutor_data.city
      },
      student: {
        //username, first_names, last_name, user_id
      },
      data
    };

    contract_file.set(cfile) // reformat.


    const yaml = YAML.safeDump(Object.assign({
//      name, title, description
    },data),{})
    .replace(/^(\s*[^:]*)/gm,'<label>$1</label>');

    tp.html_yaml.set(yaml);
    console.log({yaml})
  })
})

/***************************************************************

  ADD AGENCY
  - each contract has one or more service-providers (agencies)
  - for each agency, we have the program, and a work flow.

****************************************************************/

TP.onRendered(function() {
  const tp = this;
})

TP.helpers({
  file: ()=>{
    return contract_file.get();
  },
  html_yaml: () =>{
    const tp = Template.instance();
//    console.log(`helper.yaml_html count:${++tp.html_yaml_Count}`)
    return tp.html_yaml.get()
  }

})



TP.events({
  'click .js-add-agency': (e,tp)=>{
    /************************************
    bring a popup,
    *************************************/
    Session.set('activeTemplate','select_agency') // MUST BE REACTIVE for dynamic template
    tapp.activeTemplate_callback = tp.add_agencies
    modal_panel.open();
  },
  'click .js-drop-contract-file': (e,tp)=>{
//    console.log(`drop-agency-file `,e)
//    console.log(`drop-agency-file `,e.currentTarget.attributes.item_id)
    const item_id = e.currentTarget.attributes.item_id.value;
    console.log(`drop-contract-file(${item_id})`)
    _assert(item_id, e.currentTarget.attributes, 'fatal@97')
    _assert(Number.isInteger(+item_id), e.currentTarget.attributes, 'fatal@98')
    Meteor.call('drop-contract-file',+item_id,(err,retv)=>{
      if (err) throw err;
      console.log(`drop-contract-file : `,{retv})
    })
    return false; // do not call default handler.
  },
  'click .js-edit-contract-file': ()=>{
    Session.set('contract-file',contract_file.get())
    return true; // continue with href (normal behavior)
  }
})


FlowRouter.route('/contract-file/:id', {
  name: 'contract-file',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('contract_file',params);
    }
});
