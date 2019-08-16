const {api} = require('../219-openacs-api')
const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    TUTORS DIRECTORY

*/

// this is CC validate(school) => shoul go in lib.

function validate(agency) {
  const {item_id, name, title, description} = agency;
  _assert(item_id, agency, 'Missing item_id')

  const _o = {};

  for (const [key,value] of Object.entries(agency)) {
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
  'update-agency': async (agency)=>{

    validate(agency)

    await update_agency(agency)
    .catch(err =>{
      throw new Meteor.Error(err)
    })
  }
});

async function update_agency(agency_data) {


  const {item_id, name, title, description, data} = validate(agency_data); // again
  _assert(item_id, agency_data, 'Missing item_id')

  if (name) {
    await db.query(`
      update cr_items
      set name = $(name)
      where (item_id = $(folder_id));
    `, {item_id, name}, {single:true});
  }


  /*********************
  if (title) {
    await db.query(`
      update cr_folders
      set  = $(label)
      where (folder_id = $(folder_id));
    `, {folder_id, label}, {single:true});
  }
  ***********************/

  if (title) {
    // create a new revision.
    api.content_revision__new({
      title,
      description, // we must send the original or it is lost.....
      item_id
    })
  }


  // TERRIBLY WRONG.

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
