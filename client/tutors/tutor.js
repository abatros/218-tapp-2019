const YAML = require('js-yaml');
import './tutor.html'

const TP = Template.tutor;

const tutor = new ReactiveVar();

TP.onCreated(function() {
  const tp = this;
  console.log(`this.data:`,this.data)
  tp.html_yaml = new ReactiveVar();

  Meteor.call('pull-tutor',{tutor_id:this.data.id()},(err,data)=>{
    if (err) throw err;
    console.log({data})
    const {
      item_id:tutor_id, name, label, data:jsonb_data,
      contracts, agencies, students
    } = data;

    // reformat

    const {
      first_names, last_name, email,
      city, street, zip,
      home_phone, office_phone, cell_phone,
      lang2,
      rate, rate2
    } = jsonb_data;

    tutor.set({
      tutor_id, first_names, last_name, city,
      contracts, agencies, students
    }) // reformat.

    const yaml = YAML.safeDump(Object.assign({
      name
    },jsonb_data),{})
    .replace(/^(\s*[^:]*)/gm,'<b>$1</b>')
    .replace(/: ''/g,':');

    tp.html_yaml.set(yaml);


    const sign_in = FlowRouter.current().queryParams['sign-in'];
    console.log({sign_in})
    if (sign_in) {

      Session.set('signed-as',{
        otype: 'tutor',
        title: `${first_names} ${last_name} <${city}>`,
        user_id: user_id
      })
    }



  })
}) // onCreated

TP.helpers({
  tutor: ()=>{
    return tutor.get();
  },
  html_yaml: () =>{
    const tp = Template.instance();
//    console.log(`helper.yaml_html count:${++tp.html_yaml_Count}`)
    return tp.html_yaml.get()
  }

})

TP.events({
  'click .select-tutor': (e,tp)=>{
    Session.set('tutor',tutor)
    return false;
  },
  'click .js-sign-as': (e,tp)=>{
    const {tutor_id, first_names, last_name, city} = tutor.get()
    Session.set('signed-as',{
      otype: 'tutor',
      title: `${first_names} ${last_name} <${city}>`,
      tutor_id: tutor_id
    })
  }
})


FlowRouter.route('/tutor/:id', {
  name: 'tutor',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('tutor',params);
    }
});
