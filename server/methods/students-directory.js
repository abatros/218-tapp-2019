const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    studentS DIRECTORY

*/

Meteor.methods({
  'students-directory': async (cmd)=>{
    const {columns, verbose} = cmd;
    const {package_id, app_folder, students_folder} =  _instance();

    /*********************************************************
      we could further limit by contect_id and package_id.
      Who can access that list ?
      -- we have emails here...
    **********************************************************/



    const folders = await db.query(`
      select acs_rels.*, m.member_state,
      u.email, u.username, first_names, last_name, user_id, --object_type,
      context_id, package_id
      from acs_rels
      join acs_objects o on (o.object_id = acs_rels.rel_id)
      join membership_rels m on (acs_rels.rel_id = m.rel_id)
      join acs_users_all u on (user_id = object_id_two)
      where rel_type = 'tapp.registered-student'
      order by acs_rels.rel_id desc;
    `, {}, {single:false})

    return folders
  },
})
