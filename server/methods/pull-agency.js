const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    PULL agency

    A agency is a folder, with all contracts.
*/

Meteor.methods({
  'pull-agency': async (cmd)=>{
    const {agency_id, columns, verbose} = cmd;
    const {package_id, app_folder //, agencies_folder
    } =  _instance();

    _assert(agency_id, cmd, "fatal@14 ONLY folder_id to access a agency")

    /*********************************************************
      we could further limit by contect_id and package_id.
      Who can access that list ?
      -- we have emails here...
    **********************************************************/


    const agency_folder = await db.query(`
      select
        label, folder_id, i.item_id, name, title, cr_folders.description, data
      from cr_items i
      join cr_folders on (folder_id = i.item_id)
      left join cr_revisions on (revision_id = latest_revision)
      where(i.item_id = $(agency_id));
    `, {agency_id}, {single:true});

    _assert(agency_folder, cmd, "NOT FOUND")

    const students = await db.query(`
      -- students belonging to a agency
      select
        username, first_names, last_name, user_id
      from acs_rels
      join acs_users_all u on (u.user_id = object_id_one)
      where (object_id_two = $(agency_id))
      and (rel_type = 'tapp.student-agency');
    `, {agency_id}, {single:false});


    console.log({students})

    if (students && students.length >0) {
      Object.assign(agency_folder,{students});
    }

    return agency_folder;
  },
})
