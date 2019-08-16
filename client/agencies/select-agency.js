import {clipboard, modal_panel, tapp} from '../app-client.js'
import './select-agency.html'
const TP = Template.select_agency;

const agencies = new ReactiveVar();

TP.onCreated(function(){
  const tp = this;
  // THIS SHOULD BE IN TAPP

  if (tapp.agencies && Object.keys(tapp.agencies) >0) {
    console.log('Agencies already in cache.')
    return;
  }

  const x = Meteor.call('agencies-directory',{},(err,data)=>{
    console.log({data})
//    data.sort()
    agencies.set(data); // to display reactively.
    // build an index that will stay in memory.

    tapp.agencies = tapp.agencies ||{};
    data.forEach(ag =>{
      tapp.agencies[ag.item_id] = ag;
    })
  })
})


TP.helpers({
  agencies: ()=>{
    return agencies.get()
  }
})

TP.events({
  'click .select': (e,tp)=>{
    const list = tp.findAll('input[type=checkbox]:checked')
    .map(it => (it.value))
    console.log(list);
    clipboard.reset();
    clipboard.push(list)
    console.log(`clipboard=>`,clipboard.list())
    modal_panel.close();
    tapp.activeTemplate_callback(list);
  }
})

FlowRouter.route('/select-agency', {
  name: 'select_agency',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('select_agency',params);
    }
});
