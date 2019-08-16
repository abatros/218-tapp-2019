const {api} = require('../219-openacs-api')
const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    TUTORS DIRECTORY

*/

Meteor.methods({
  'new-district': async (district)=>{
    const {label, phone, url} = district;
    const {name = label} = district;


    if (!name || !label) {
      console.log(`fatal:`,{district})
      return Object.assign(district,{
        error: 'Missing district.name or district.label'
      })
    }

    console.log({district})

    const folder_id = await register_a_district(district)
    .catch(err =>{
      throw new Meteor.Error(err)
    })
    console.log({folder_id})
    return {folder_id}
  }
});

async function register_a_district(district_data) {
  const app_instance = _instance();
  _assert(app_instance, '', "Missing app_instance")
  const {package_id, app_folder,
    districts_folder} = app_instance;
  _assert(package_id, app_instance, "Missing package_id")
  _assert(app_folder, app_instance, "Missing app_folder")
  _assert(districts_folder, app_instance, "Missing districts_folder")

  _assert(Number.isInteger(package_id), app_instance, "package_id not an Integer")
  _assert(Number.isInteger(app_folder), app_instance, "fatal  app_folder not an Integer")

  const {folder_id} = districts_folder;
  _assert(Number.isInteger(folder_id), app_instance, "fatal districts_folder not an Integer")



//  const {app_instance, xray} = o;
  const {name:district_name, label} = district_data;
  _assert(district_name, district_data, "Missing district name")
  _assert(label, district_data, "Missing district.label")

  /*
    lookup for an existsing district.
  */

  let district = await db.query(`
      select *
      from cr_folders, cr_items
      where (item_id = folder_id)
      and (parent_id = $(parent_id))
      and (name = $(district_name));
    `,{parent_id:folder_id, district_name},{single:true});

  if (!district) {
    await api.content_folder__new({
      parent_id: folder_id,
      name: district_name,
      label,
      package_id,
      context_id: folder_id
    })
    .then(folder_id =>{
      district = {folder_id}
    })
    .catch(err =>{
      if (err.code != 23505) throw err;
      console.log(`ALERT district@42 : `, err.detail)
    })
  } else {
    console.log(`\t district ${district_name} ALREADY EXISTS`)
    throw new Meteor.Error('district-already-exists')
//    return;
  }

  const {folder_id:district_id} = district;
  _assert(district_id, district, 'fatal@53')


/*
  await db.query(`
    update cr_items set content_type = 'tapp.contract'
    where (item_id = ${folder_id})
    `, {folder_id},{single:true})

  await db.query(`
    update acs_objects set object_type = 'tapp.contract'
    where (object_id = ${folder_id})
    `, {folder_id},{single:true})
*/

  return district_id;

}
