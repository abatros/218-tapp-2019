const yaml = require('js-yaml');
//const YAML = require('json-to-pretty-yaml');

import {_assert, odiff} from '../app-client.js'
import './edit-contract-file.html'
//const codeMirror = require('codemirror');


const TP = Template['edit-contract-file'];

const contract_file = new ReactiveVar(); // the original.
const err_message = new ReactiveVar();

TP.onCreated(function() {
  this.data.contract_file = Session.get('contract-file');
  console.log(`this.data.contract_file:`,this.data.contract_file)
});

TP.onRendered(function() {
  const tp = this;
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
      //height: '500pt',
      //viewportMargin: 100000, //Infinity, //200, // ???
      extraKeys: {
        "Ctrl-S": save_contract_file,
//        "Ctrl-Right": next_article,
//        "Ctrl-Left": prev_article
      }
  });
  //  cm.save()
  $(".CodeMirror").css('font-size',"14px");
  $(".CodeMirror").css('line-height',"24px");
  $(".CodeMirror").css('height',"600px");
  $(".CodeMirror").css('border',"1px solid #eee");
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

  this.reset = ()=> {
    console.log(`tp.data.contract_file:`, tp.data.contract_file);
    const _contract_file = tp.data.contract_file;
    if (!_contract_file) return;
    const {name, title='', description='', data} = _contract_file;
    console.log(`reset._contract_file:`,_contract_file)
    const base = {
      name, title, description
    };
    Object.assign(base, data); // collisions.... aie..
    const _yaml = yaml.safeDump(base,{}).replace(/': null'/g,': ');
    console.log({_yaml})
    tp.cm.setValue(_yaml);
    //tp.cm.refresh();
  }

  this.reset();


  function save_contract_file() {
    const data1 = tp.data.contract_file;
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
        text:'contract_file data unchanged.'
      })
      return;
    }

    _assert(data1.item_id, data1, 'fatal@126')
    Object.assign(xor,{item_id: data1.item_id})

    Meteor.call('update-contract-file',xor, (err,data) =>{
      if (err) {
        console.log({err})
        err_message.set({text:`alert`, color:'red'})
        return;
      }
      console.log(`success:`,{data})
      console.log(`MAYBE WE SHOULD UPDATE reactive var contract_file.....`)
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
})

// ----------------------------------------------------------------------------

TP.events({
  'click .reset': (e,tp)=>{
    tp.reset();
    return false;
  }
})

// ----------------------------------------------------------------------------

FlowRouter.route('/edit-contract-file', {
  name: 'contract-file',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
        BlazeLayout.render('edit-contract-file',params);
    }
});
