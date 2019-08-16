import {tapp} from './app-client.js'

Template.registerHelper('session',function(input){
    return Session.get(input);
});

Template.registerHelper('signed_as', function(){
  return Session.get('signed-as');
});

Template.registerHelper('tapp',function(){
  return tapp;
});


Template.registerHelper('selected_tutor',function(){
  const tutor = Session.get('tutor');
  console.log({tutor})
  return tutor.curValue;
});

Template.registerHelper('selected_student',function(){
  const student = Session.get('student');
  console.log({student})
  return student;
});

Template.registerHelper('selected_district',function(){
  const district = Session.get('district');
  console.log({district})
  return district;
});
