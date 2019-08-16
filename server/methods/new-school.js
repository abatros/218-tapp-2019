const {api} = require('../219-openacs-api')
const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    TUTORS DIRECTORY

*/

Meteor.methods({
  'new-school': async (school)=>{
    const {label, phone, url, district_id} = school;
    const {name = label} = school;

    _assert(district_id, school, 'fatal@15 missing district_id')

    if (!name || !label) {
      console.log(`fatal:`,{school})
      return Object.assign(school,{
        error: 'Missing school.name or school.label'
      })
    }

    console.log({school})

    const folder_id = await register_a_school(school)
    .catch(err =>{
      throw new Meteor.Error(err)
    })
    console.log({folder_id})
    return {folder_id}
  }
});

async function register_a_school(school_data) {
  const app_instance = _instance();
  _assert(app_instance, '', "Missing app_instance")
  const {package_id, app_folder,
    schools_folder} = app_instance;
  _assert(package_id, app_instance, "Missing package_id")
  _assert(app_folder, app_instance, "Missing app_folder")
  _assert(schools_folder, app_instance, "Missing schools_folder")

  _assert(Number.isInteger(package_id), app_instance, "package_id not an Integer")
  _assert(Number.isInteger(app_folder), app_instance, "fatal  app_folder not an Integer")

  const {folder_id} = schools_folder;
  _assert(Number.isInteger(folder_id), app_instance, "fatal schools_folder not an Integer")



//  const {app_instance, xray} = o;
  const {name:school_name, label} = school_data;
  _assert(school_name, school_data, "Missing school name")
  _assert(label, school_data, "Missing school.label")

  /*
    lookup for an existsing school.
  */

  let school = await db.query(`
      select *
      from cr_folders, cr_items
      where (item_id = folder_id)
      and (parent_id = $(parent_id))
      and (name = $(school_name));
    `,{parent_id:folder_id, school_name},{single:true});

  if (!school) {
    await api.content_folder__new({
      parent_id: folder_id,
      name: school_name,
      label,
      package_id,
      context_id: folder_id
    })
    .then(folder_id =>{
      school = {folder_id}
    })
    .catch(err =>{
      if (err.code != 23505) throw err;
      console.log(`ALERT school@42 : `, err.detail)
    })
  } else {
    console.log(`\t school ${school_name} ALREADY EXISTS`)
    throw new Meteor.Error('school-already-exists')
//    return;
  }

  const {folder_id:school_id} = school;
  _assert(school_id, school, 'fatal@53')


  console.log(`CREATE A RELATION => SCHOOL-DISTRICT`)

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

  return school_id;

}
