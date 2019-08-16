import './top-nav.html'

const TP = Template.top_nav;

TP.events({
  'click .js-sign-out': ()=>{
    Session.set('signed-as', null)
  }
})
