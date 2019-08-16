import './contract.html'
import {modal_panel, tapp, _assert} from '../app-client.js'

const TP = Template.contract;

const contract = new ReactiveVar();

TP.onCreated(function() {
  console.log(`this.data:`,this.data)
  Meteor.call('pull-contract',{
    // send userId to limit access to protected data.
    // send the list of requested files
    // each agency has its own file (workflow)
    folder_id:this.data.id()
  },(err,data)=>{
    if (err) throw err;
    console.log({data})
    const {folder_id, district_name, district_id, label:contract_number,
      username, first_names, last_name, user_id,
      agency_files
    } = data;
    contract.set({
      folder_id, district_name, district_id, contract_number, agency_files,
      student: {
        username, first_names, last_name, user_id
      }
    }) // reformat.
  })
})

/***************************************************************

  ADD AGENCY
  - each contract has one or more service-providers (agencies)
  - for each agency, we have the program, and a work flow.

****************************************************************/

TP.onRendered(function() {
  const tp = this;
  tp.add_agencies = function(v){
    console.log(`tp.add_agencies@27 v:`,v)
    const _contract = contract.get();
    const _agencies = contract.get().agencies ||{};
    v.forEach(item_id =>{
      _agencies[item_id] = tapp.agencies[item_id]
      console.log(`
        Adding an Agency(${item_id}) to a contract(${_contract.folder_id}):
        - create file 101-${item_id} : a cr_item for the workflow
        - create a relation tapp.contract-agency
      `);
      Meteor.call('contract.new-agency-file',{
        contract_id: _contract.folder_id,
        agency_id: item_id,
        file_name: `101-agency-${item_id}`
      },(err,retv)=>{
        if (err) throw err;
        console.log(`contract.new-agency-file:`,{retv})
      })
    })
    console.log({_agencies})
  }
})

TP.helpers({
  contract: ()=>{
    return contract.get();
    /*
    return {
      contract_number: 'ax3456',
      district_name: 'Pasadena SD',
      school_name: 'Disney Elementary',
      student: {
        first_names: 'Jules',
        last_name: 'Cesar'
      }
    }
    */
  }
})



TP.events({
  'click .js-add-agency': (e,tp)=>{
    /************************************
    bring a popup,
    *************************************/
    Session.set('activeTemplate','select_agency') // MUST BE REACTIVE for dynamic template
    tapp.activeTemplate_callback = tp.add_agencies
    modal_panel.open();
  },
  'click .js-drop-contract-file': (e,tp)=>{
//    console.log(`drop-agency-file `,e)
//    console.log(`drop-agency-file `,e.currentTarget.attributes.item_id)
    const item_id = e.currentTarget.attributes.item_id.value;
    console.log(`drop-contract-file(${item_id})`)
    _assert(item_id, e.currentTarget.attributes, 'fatal@97')
    _assert(Number.isInteger(+item_id), e.currentTarget.attributes, 'fatal@98')
    Meteor.call('drop-contract-file',+item_id,(err,retv)=>{
      if (err) throw err;
      console.log(`drop-contract-file : `,{retv})
    })
    return false; // do not call default handler.
  }
})


FlowRouter.route('/contract/:id', {
  name: 'contract',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('contract',params);
    }
});
