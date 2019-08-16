const {api} = require('../219-openacs-api')
const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    TUTORS DIRECTORY

*/


function validate_item(file) {
  const {item_id, name, title, description} = file;
  _assert(item_id, file, 'Missing item_id')

  const _o = {};

  for (const [key,value] of Object.entries(file)) {
    switch(key) {
      case 'item_id': case 'name':
      case 'title': case 'description':
      _o[key] = value
      break;

      default:
        _o.data = _o.data || {};
        _o.data[key] = value
    }
  }
  return _o;
}


Meteor.methods({
  'update-contract-file': async (file)=>{

    validate_item(file)

    return await update_file(file)
    .catch(err =>{
      throw new Meteor.Error(err)
    })
  }
});

async function update_file(file_data) {

  const {item_id, name, title, description, data} = validate_item(file_data);
  _assert(item_id, file_data, 'Missing folder_id')

  /*
    lookup for an existsing file.
  */
  if (name) {
    await db.query(`
      update cr_items
      set name = $(name)
      where (item_id = $(item_id));
    `, {item_id, name}, {single:true});
  }


  if (title) {
    // create a new revision.
    api.content_revision__new({
      title,
      description, // we must send the original or it is lost.....
      item_id
    })
  }

  if (data) {
    db.query(`
      update cr_revisions
      set data = $(data)
      from cr_items i
      where (revision_id = latest_revision)
      and (i.item_id = $(item_id));
    `, {item_id,data}, {single:true})
  }


  return {retCode: 'ok'};
}
