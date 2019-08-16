const {_assert} = require('./utils.js')
const {api} = require('../219-openacs-api');
const get_folder = require('./get-folder.js')

module.exports.get_tapp_metadata = get_tapp_metadata;
module.exports.tapp_instance = tapp_instance

let __instance = null;
function tapp_instance() {
  return __instance;
}

async function get_tapp_metadata(o) {
  const {folder_id:app_folder, package_id} = o;
  _assert(app_folder, o, "Missing app_folder")


  const app_group = await get_the_app_group(package_id);
  const students_folder = await get_folder({parent_id:app_folder, name:'students-folder'})
  const tutors_folder = await get_folder({parent_id:app_folder, name:'tutors-folder'})
  const districts_folder = await get_folder({parent_id:app_folder, name:'districts-folder'})
  const schools_folder = await get_folder({parent_id:app_folder, name:'schools-folder'})
  const agencies_folder = await get_folder({parent_id:app_folder, name:'agencies-folder'})


  __instance = {
    app_folder, package_id,
    app_group,
    students_folder,
    tutors_folder,
    districts_folder,
    schools_folder,
    agencies_folder,
  };


  console.log({__instance})

  return __instance; // not sure we need that.
}


async function get_the_app_group(package_id) {
  let app_group = await api.application_group__group_id_from_package_id({
    package_id,
  }).catch(err =>{
    console.log(`api.application_group__group_id_from_package_id =>err.code:${err.code}`)
//    throw err;
  });

  if (!app_group) {
    app_group = await api.application_group__new({
      package_id,
      group_type:'tapp.community',
      group_name: instance_name
    })
  }

  console.log(`@89:`,{
    app_group
  });

  _assert(app_group, "@90", 'Missing app_group')
  return app_group;
}
