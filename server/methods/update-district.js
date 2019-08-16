const {api} = require('../219-openacs-api')
const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    TUTORS DIRECTORY

*/

function validate(district) {
  const {folder_id, name, label} = district;
  const {phone, city} = district;
  _assert(folder_id, district, 'Missing folder_id')
}

Meteor.methods({
  'update-district': async (district)=>{

    validate(district)

    await update_district(district)
    .catch(err =>{
      throw new Meteor.Error(err)
    })
  }
});

async function update_district(district_data) {

  const {folder_id, name, label} = district_data;
  _assert(folder_id, district_data, 'Missing folder_id')

  /*
    lookup for an existsing district.
  */

  if (label) {
    await db.query(`
      update cr_folders
      set label = $(label)
      where (folder_id = $(folder_id));
    `, {folder_id, label}, {single:true});
  }

  if (name) {
    await db.query(`
      update cr_items
      set name = $(name)
      where (item_id = $(folder_id));
    `, {folder_id, name}, {single:true});
  }

  return {};
}
