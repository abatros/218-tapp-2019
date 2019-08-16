const {api} = require('../219-openacs-api')
const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    UPDATE SCHOOL DATA

*/

function validate(school) {
  const {item_id, name, title, description} = school;
  _assert(item_id, school, 'Missing item_id')

  const _o = {};

  for (const [key,value] of Object.entries(school)) {
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
  'update-school': async (school)=>{

    validate(school)

    await update_school(school)
    .catch(err =>{
      throw new Meteor.Error(err)
    })
  }
});

async function update_school(school_data) {

  const {item_id, name, title, description, data} = validate(school_data); // again

  _assert(item_id, school_data, 'Missing item_id')

  /*
    lookup for an existsing school.
  */

  if (name) {
    await db.query(`
      update cr_items
      set name = $(name)
      where (item_id = $(item_id));
    `, {item_id, name}, {single:true});
  }

  /************************************************************

    TODO: create a list of set/value

  *************************************************************/

  const QUERY_2_in_one = `
  with ii as (
    update cr_items set name='le-nox-central'
    where (item_id = 413030)
    returning latest_revision
  )
  update cr_revisions
  set description='wow a decription2', title='Lenox Central'
  from ii
  where (revision_id = ii.latest_revision);
  `;


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


  /***************
  if (title) {
    await db.query(`
      update cr_revisions
      set title = $(title)
      -- more set/value
      from cr_items i
      where (revision_id = latest_revision)
      and (i.item_id = $(item_id));
    `, {item_id, title}, {single:true});
  }
  ********************/

  return {retCode: 'ok'};
}
