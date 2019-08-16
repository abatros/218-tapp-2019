import './students-directory.html'
const TP = Template.students_directory;


const students = new ReactiveVar();

TP.onCreated(function(){
  const tp = this;
  const x = Meteor.call('students-directory',{},(err,data)=>{
    console.log({data})
//    data.sort()
    students.set(data);
  })
})


TP.helpers({
  students: ()=>{
    return students.get()
  }
})


FlowRouter.route('/students-directory', {
  name: 'students-directory',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('students_directory',params);
    }
});
