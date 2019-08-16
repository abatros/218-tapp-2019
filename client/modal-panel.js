import './modal-panel.html'
import {tapp} from './app-client.js'

const TP = Template.modal_panel;

TP.helpers({
  activeTemplate: ()=>{
    return Session.get('activeTemplate');
  }
})
