const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    PULL school

    A school is a folder, with all contracts.
*/

Meteor.methods({
  'pull-school': async (cmd)=>{
    const {school_id, columns, verbose} = cmd;
    const {package_id, app_folder, schools_folder} =  _instance();

    _assert(school_id, cmd, "fatal@14 ONLY folder_id to access a school")

    /*********************************************************
      we could further limit by contect_id and package_id.
      Who can access that list ?
      -- we have emails here...
    **********************************************************/


    const school_file = await db.query(`
      select
        di.item_id as district_id, di.name as district_name,
        i.item_id, i.name, title, description, data

      from cr_items i
      left join cr_revisions on (revision_id = latest_revision)
      left join acs_rels on (rel_type = 'tapp.school-district')
      and (object_id_one = i.item_id)
      left join cr_items di on (di.item_id = object_id_two)
      where(i.item_id = $(school_id));
    `, {school_id}, {single:true});

    _assert(school_file, cmd, "NOT FOUND")

    const students = await db.query(`
      -- students belonging to a school
      select
        username, first_names, last_name, user_id
      from acs_rels
      join acs_users_all u on (u.user_id = object_id_one)
      where (object_id_two = $(school_id))
      and (rel_type = 'tapp.student-school');
    `, {school_id}, {single:false});


    console.log({students})

    if (students && students.length >0) {
      Object.assign(school_file,{students});
    }

    return school_file;
  },
})
