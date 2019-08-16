const yaml = require('js-yaml');
import {_assert} from '../app-client.js'
import './new-district.html'
//const codeMirror = require('codemirror');


const TP = Template['new-district'];

const district = new ReactiveVar();
const err_message = new ReactiveVar();

TP.onRendered(function() {
  const cm_TextArea = this.find('#cm_TextArea'); //document.getElementById('myText');

  console.log({cm_TextArea})
  // configure codeMirror for this app-key
  var cm = CodeMirror.fromTextArea(cm_TextArea, {
//      mode: "javascript",
      mode: "markdown",
      lineNumbers: true,
      viewportMargin:10,
      cursorScrollMargin: 5,
      lineWrapping: true,
      matchBrackets: true,
//      keyMap:'vim',
      keyMap:'sublime',
      viewportMargin:200, // ???
      extraKeys: {
        "Ctrl-S": save_district,
//        "Ctrl-Right": next_article,
//        "Ctrl-Left": prev_article
      }
  });
  //  cm.save()
  $(".CodeMirror").css('font-size',"14px");
  $(".CodeMirror").css('line-height',"24px");

const bidon =`- name: phra-khanong-sd
  label: Phra Khanong School District
  phone: +66 876-784598
`;
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

  function save_district() {
    const data1 = cm.getValue();
//    console.log({data1});
    const data = yaml.safeLoad(data1);
//    console.log(JSON.stringify(data));
    console.log({data});
    /*****************************
    MUST BE ONLY ONE.
    ******************************/
    if (data.length != 1) {
      throw 'MUST BE !@74'
    }
    Meteor.call('new-district',data[0], (err,data) =>{
      if (err) {
        console.log({err})
        err_message.set({text:`district already exists`, color:'red'})
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

FlowRouter.route('/new-district', {
  name: 'district',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('new-district',params);
    }
});
