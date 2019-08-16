const YAML = require('js-yaml');

import './agency.html'
import {modal_panel} from '../app-client.js'

const TP = Template.agency;

const agency = new ReactiveVar();


TP.onCreated(function() {
  const tp = this;
  console.log(`this.data:`,this.data)
  tp.html_yaml_Count =0;
  tp.html_yaml = new ReactiveVar();

  Meteor.call('pull-agency',{agency_id:this.data.id()},(err, retv)=>{
    if (err) throw err;
    console.log(`pull-agency:`, {retv})
    const {
      item_id, name, title, description, data
    } = retv;


    const _data = data && Object.entries(data)

    agency.set({
      item_id, name, title, description, data,
//      _data: _data && _data.map(([key,value]) => (`${key}: ${value}`))
    })


    const sign_in = FlowRouter.current().queryParams['sign-in'];
    console.log({sign_in})
    if (sign_in) {

      Session.set('signed-as',{
        otype: 'agency',
        title: title,
        agency_id: item_id,
        agency_name: title
      })
    }


    /*************************************************
    **************************************************/

    const yaml = YAML.safeDump(Object.assign({
      name, title, description
    },data),{})
    .replace(/^(\s*[^:]*)/gm,'<label>$1</label>');

    tp.html_yaml.set(yaml);
    console.log({yaml})
  })
}) // onCreated


TP.helpers({
  agency: ()=>{
    return agency.get();
  },
  html_yaml: () =>{
    const tp = Template.instance();
    console.log(`helper.yaml_html count:${++tp.html_yaml_Count}`)
    return tp.html_yaml.get()
  }
})

TP.events({
  'click .select-agency': (e,tp)=>{
    Session.set('agency',agency.get())
    return false;
  },
  'click .edit-agency': (e,tp)=>{
    Session.set('agency',agency.get())
    return true; // continue with href (normal behavior)
  }
})


FlowRouter.route('/agency/:id', {
  name: 'agency',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('agency',params);
    }
});
