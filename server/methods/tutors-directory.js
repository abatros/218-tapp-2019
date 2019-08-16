const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    TUTORS DIRECTORY

*/

Meteor.methods({
  'tutors-directory': async (cmd)=>{
    const {columns, verbose} = cmd;
    const {package_id, app_folder, tutors_folder} =  _instance();
    const {folder_id} = tutors_folder;

    /*********************************************************
      we could further limit by contect_id and package_id.
      Who can access that list ?
      -- we have emails here...
    **********************************************************/


    const folders = await db.query(`
    select
      name,
      label, package_id,
      i.item_id, data
    from cr_items i
    join cr_revisions on (revision_id = latest_revision)
    join cr_folders on (folder_id = i.item_id)
    where (i.parent_id = $(tutors_folder))
    `, {tutors_folder:folder_id}, {single:false})

    /*
    const folders = await db.query(`
      select acs_rels.*, m.member_state,
      u.email, u.username, first_names, last_name, user_id, --object_type,
      context_id, package_id
      from acs_rels
      join acs_objects o on (o.object_id = acs_rels.rel_id)
      join membership_rels m on (acs_rels.rel_id = m.rel_id)
      join acs_users_all u on (user_id = object_id_two)
      where rel_type = 'tapp.registered-tutor'
      order by acs_rels.rel_id desc;
    `, {}, {single:false})
    */

    return folders
  },
})
