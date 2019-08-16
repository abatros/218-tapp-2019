import './agencies-directory.html'
const TP = Template.agencies_directory;


const agencies = new ReactiveVar();

TP.onCreated(function(){
  const tp = this;
  const x = Meteor.call('agencies-directory',{},(err,data)=>{
    console.log({data})
//    data.sort()
    agencies.set(data);
  })
})


TP.helpers({
  agencies: ()=>{
    return agencies.get()
  }
})


FlowRouter.route('/agencies-directory', {
  name: 'agencies-directory',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('agencies_directory',params);
    }
});
