const yaml = require('js-yaml');
//const YAML = require('json-to-pretty-yaml');

import {_assert, odiff} from '../app-client.js'
import './edit-district.html'
//const codeMirror = require('codemirror');


const TP = Template['edit-district'];

const district = new ReactiveVar(); // the original.
const err_message = new ReactiveVar();

TP.onCreated(function() {
  /**********************************************
    Get the selected district.
  ***********************************************/
  //console.log(`this.data:`,this.data)
  Meteor.call('pull-district',{folder_id:this.data.id()},(err,data)=>{
    if (err) throw err;
    console.log({data})
    const {
      folder_id, label, name,
      contracts, schools
    } = data;

    // reformat

    district.set({
      folder_id,
      label, name,
      contracts, schools
    }) // reformat.
  })

});

TP.onRendered(function() {
  const cm_TextArea = this.find('#cm_TextArea'); //document.getElementById('myText');

  console.log({cm_TextArea})
  // configure codeMirror for this app-key
  var cm = this.cm = CodeMirror.fromTextArea(cm_TextArea, {
//      mode: "javascript",
//      mode: "markdown",
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
        "Ctrl-S": save_district,
//        "Ctrl-Right": next_article,
//        "Ctrl-Left": prev_article
      }
  });
  //  cm.save()
  $(".CodeMirror").css('font-size',"14px");
  $(".CodeMirror").css('line-height',"24px");
  // json to yaml.
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
    const data1 = district.get();
    const data2 = yaml.safeLoad(cm.getValue());

    /******************************************

    send only what changed: difference symetrique XOR
    get out only new or changed properties in data2.
    if (data2.x != data1.x) push data2.x

    *******************************************/


    const xor ={};
    for (const [key,value] of Object.entries(data2)) {
      if (data1[key] == value) continue;
      xor[key] = value;
    }

//    console.log({data1});
//      console.log(JSON.stringify(data));
    console.log({data1});
    console.log({data2});
    console.log({xor});


    /**************************************************************

      check if something changed.... using checksum/object-hash

    ***************************************************************/
    //validate(data2);


//    const o = odiff(data1,data2)
//    console.log(`odiff=>`,{o})

    if (Object.keys(xor) <= 0) {
      err_message.set({
        color:'green',
        text:'district data unchanged.'
      })
      return;
    }

    Object.assign(xor,{folder_id:data1.folder_id})

    Meteor.call('update-district',xor, (err,data) =>{
      if (err) {
        console.log({err})
        err_message.set({text:`alert`, color:'red'})
        return;
      }
      console.log(`success:`,{data})
      console.log(`MAYBE WE SHOULD UPDATE reactive var district.....`)
    })
  }

}) // on Rendered

function validate(data) {
  const {folder_id, name, label} = data; // basic
  // const {phone, city, address} = data[0]
  _assert(folder_id, data, 'Missing folder_id')
  _assert(name, data, 'Missing name')
  _assert(label, data, 'Missing label')

}


// ----------------------------------------------------------------------------

TP.helpers({
  err_message: ()=>{
    return err_message.get();
  },
  district: function(){
    const tp = Template.instance();
    const _district = district.get();
    if (!_district) return;
    const {label, name,
      //contracts, schools
    } = _district;
    const _yaml = yaml.safeDump({
      label, name,
      //contracts, schools
    },{});
    console.log({_yaml})
    tp.cm.setValue(_yaml);
    tp.cm.refresh();
    return _district;
  }
})

// ----------------------------------------------------------------------------

TP.events({
  'click .reset': (e,tp)=>{
    const _district = district.get();
    if (!_district) return;
    const {label, name, contracts, schools} = _district;
    const _yaml = yaml.safeDump({
      label, name,
      //contracts, schools
    },{});
    tp.cm.setValue(_yaml);
    //tp.cm.refresh();
    return false;
  }
})

// ----------------------------------------------------------------------------

FlowRouter.route('/edit-district/:id', {
  name: 'district',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('edit-district',params);
    }
});
