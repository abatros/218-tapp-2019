import './district.html'

const TP = Template.district;

const district = new ReactiveVar();

TP.onCreated(function() {
  console.log(`this.data:`,this.data)


  Meteor.call('pull-district',{folder_id:this.data.id()},(err,data)=>{
    if (err) throw err;
    console.log({data})
    const {
      folder_id, label, name,
      contracts, schools
    } = data;

// contract: folder_id, label, ci.name, di.item_id as district_id, di.name as district_name, si.name as student_name

    // reformat

    console.log({schools})

    district.set({
      folder_id, label, name,
      contracts, schools
    }) // reformat.

    const sign_in = FlowRouter.current().queryParams['sign-in'];
    console.log({sign_in})
    if (sign_in) {

      Session.set('signed-as',{
        otype: 'district',
        title: label,
        district_id: folder_id,
        district_name: label
      })
    }


  })
})

TP.helpers({
  district: ()=>{
    return district.get();
  }
})

TP.events({
  'click .select-district': (e,tp)=>{
    Session.set('district',district.get())
    return false;
  }
})


FlowRouter.route('/district/:id', {
  name: 'district',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        console.log(' --- queryParams:',queryParams);
        if (queryParams['sign-in']) {
        }
        BlazeLayout.render('district',params);
    }
});
