import './student.html'

const TP = Template.student;

const student = new ReactiveVar();

TP.onCreated(function() {
  console.log(`this.data:`,this.data)
  Meteor.call('pull-student',{student_id:this.data.id()},(err,data)=>{
    if (err) throw err;
    console.log({data})
    const {
      district_name,
      school_title, school_id,
      user_id, username, // first_names, last_name,
      contracts, tutors,
      data:student_data
    } = data;

    const {first_names, last_name, grade} = student_data;

    student.set({
      district_name,
      school_title, school_id,
      user_id, username,
      first_names, last_name, grade,
      contracts, tutors
    }) // reformat.
  })
})

TP.helpers({
  student: ()=>{
    return student.get();
  }
})

TP.events({
  'click .select-student': (e,tp)=>{
    Session.set('student', student.get())
    console.log(`student@33:`,Session.get('student'))
    return false;
  }
})

FlowRouter.route('/student/:id', {
  name: 'student',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('student',params);
    }
});
