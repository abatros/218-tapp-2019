const YAML = require('js-yaml');

import './school.html'

const TP = Template.school;

const school = new ReactiveVar();
const _school = new ReactiveVar(); // flat

/*
const _school = Object.assign(data, {
  item_id, name, title, description
})

*/

TP.onCreated(function() {
  const tp = this;
  console.log(`this.data:`,this.data)
  tp.html_yaml_Count =0;
  tp.html_yaml = new ReactiveVar();

  Meteor.call('pull-school',{school_id:this.data.id()},(err, retv)=>{
    if (err) throw err;
    console.log(`pull-school:`, {retv})
    const {
      item_id, name, title, description, data,
      district_id, district_name
    } = retv;


    const _data = data && Object.entries(data)

    school.set({
      item_id, name, title, description, data,
      district_id, district_name
//      _data: _data && _data.map(([key,value]) => (`${key}: ${value}`))
    })

    /*************************************************
    **************************************************/

    const yaml = YAML.safeDump(Object.assign({
      name, title, description, district_name
    },data),{})
    .replace(/^(\s*[^:]*)/gm,'<label>$1</label>');

    tp.html_yaml.set(yaml);
    console.log({yaml})
return;

    const flat = Object.assign({
      name, title, description
    }, data);

    console.log({flat})
    console.log(Object.entries(flat))
    _school.set(Object.entries(flat).map(([key,value])=>(`${key}: ${value}`)))
  })
})

let shCount = 0;

TP.helpers({
  school: ()=>{
    //console.log(`helper.school:`, _school.get())
    return _school.get();
  },
  html_yaml: () =>{
    const tp = Template.instance();
    console.log(`helper.yaml_html count:${++tp.html_yaml_Count}`)
    return tp.html_yaml.get()
  }
})

TP.events({
  'click .select-school': (e,tp)=>{
    Session.set('school',school.get())
    return false;
  },
  'click .edit-school': (e,tp)=>{
    Session.set('school',school.get())
    return true; // continue with href (normal behavior)
  }
})


FlowRouter.route('/school/:id', {
  name: 'school',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('school',params);
    }
});
