import './districts-directory.html'
const TP = Template.districts_directory;


const districts = new ReactiveVar();

TP.onCreated(function(){
  const tp = this;
  const x = Meteor.call('districts-directory',{},(err,data)=>{
    if (err) throw err;
    console.log({data})
//    data.sort()
    districts.set(data);
  })
})


TP.helpers({
  districts: ()=>{
    return districts.get()
  }
})


FlowRouter.route('/districts-directory', {
  name: 'districts-directory',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('districts_directory',params);
    }
});
