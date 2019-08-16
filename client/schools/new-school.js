const yaml = require('js-yaml');
import {_assert} from '../app-client.js'
import './new-school.html'
//const codeMirror = require('codemirror');


const TP = Template['new-school'];

const school = new ReactiveVar();
const err_message = new ReactiveVar();

TP.onCreated(function() {
//  this.district_id = this.data.district_id();
//  console.log(`onCreated district_id:`,this.district_id)
  this.data.district = Session.get('district');
})

TP.onRendered(function() {
  const cm_TextArea = this.find('#cm_TextArea'); //document.getElementById('myText');

  console.log({cm_TextArea})
  // configure codeMirror for this app-key
  var cm = CodeMirror.fromTextArea(cm_TextArea, {
//      mode: "javascript",
      mode: "text/x-yaml",
      lineNumbers: true,
      viewportMargin:10,
      cursorScrollMargin: 5,
      lineWrapping: true,
      matchBrackets: true,
//      keyMap:'vim',
      keyMap:'sublime',
      viewportMargin:200, // ???
      extraKeys: {
        "Ctrl-S": save_school,
//        "Ctrl-Right": next_article,
//        "Ctrl-Left": prev_article
      }
  });
  //  cm.save()
  $(".CodeMirror").css('font-size',"14px");
  $(".CodeMirror").css('line-height',"24px");

const bidon =`label: \nname: \nphone: \n`;
//  cm.setValue(`- name: \n  label: \n  phone: \n`);
  cm.setValue(bidon);

  cm.refresh();
  cm.on("change", (cm, change)=>{ // transform MD -> Article -> html (preview)
    //console.log({change});
    /*
    var Article = Meteor.publibase_article;
    const self = this;
//    this.ccount.set(this.ccount.get()+1);
    Session.set('cm-hitCount',1);

    // update a reactive variable.
    let s = cm.getValue();
    // here we should extract data to go in headline, or abstract
    Editora.md_code.set(s);
//    const p = Meteor.publibase_dataset.cc.markup_render_preview(s);
//    Meteor.publibase.article_html_preview.set(p);
  */
    return false; // ??
  });

  function save_school() {
    const data = yaml.safeLoad(cm.getValue());
    const district = Session.get('district');
    _assert(district,"save-school",'fatal@70')

    Object.assign(data,{district_id:district.folder_id})
    console.log({data});

    Meteor.call('new-school', data, (err,data) =>{
      if (err) {
        console.log({err})
        err_message.set({text:err.reason, color:'red'})
        return;
      }
      console.log(`success:`,{data})
    })
  }

}) // on Rendered

// ----------------------------------------------------------------------------

TP.helpers({
  err_message: ()=>{
    return err_message.get();
  }
})

// ----------------------------------------------------------------------------

FlowRouter.route('/new-school', {
  name: 'school',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('new-school',params);
    }
});
