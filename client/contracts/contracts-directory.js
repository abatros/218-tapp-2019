import './contracts-directory.html'
const TP = Template.contracts_directory;


const contracts = new ReactiveVar();

TP.onCreated(function(){
  const tp = this;
  const signed_as = Session.get('signed-as');
  const district_id = signed_as && signed_as.district_id;
  const tutor_id = signed_as && signed_as.tutor_id;

  console.log({signed_as})

  const x = Meteor.call('contracts-directory',{district_id, tutor_id},(err,data)=>{
    console.log({data})
//    data.sort()
    contracts.set(data);
  })
})


TP.helpers({
  contracts: ()=>{
    return contracts.get()
  }
})


FlowRouter.route('/contracts-directory', {
  name: 'contracts-directory',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('contracts_directory',params);
    }
});
