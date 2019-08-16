import './schools-directory.html'
const TP = Template.schools_directory;


const schools = new ReactiveVar();

TP.onCreated(function(){
  const tp = this;
  const signed_as = Session.get('signed-as');
  const district_id = signed_as && signed_as.district_id;

  const x = Meteor.call('schools-directory',{district_id},(err,data)=>{
    console.log({data})
//    data.sort()
    data.forEach(it =>{
      it.title = it.title || '*'+it.name;
    })
    schools.set(data);
  })
})


TP.helpers({
  schools: ()=>{
    return schools.get()
  }
})


FlowRouter.route('/schools-directory', {
  name: 'schools-directory',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('schools_directory',params);
    }
});
