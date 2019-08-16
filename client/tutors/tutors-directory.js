import './tutors-directory.html'
const TP = Template.tutors_directory;


const tutors = new ReactiveVar();

TP.onCreated(function(){
  const tp = this;
  const x = Meteor.call('tutors-directory',{},(err,data)=>{
    console.log({data})
//    data.sort()
    tutors.set(data);
  })
})


TP.helpers({
  tutors: ()=>{
    return tutors.get()
  }
})


FlowRouter.route('/tutors-directory', {
  name: 'tutors-directory',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('tutors_directory',params);
    }
});
