const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    PULL-STUDENT

*/


Meteor.methods({
  'pull-student': async (cmd)=>{
    let {student_id, columns, verbose} = cmd;
    const {package_id, app_folder} =  _instance();

    _assert(student_id, cmd, "fatal@14 ONLY student_id to pull a student.")
    student_id = +student_id;

    /*********************************************************
    **********************************************************/
    /*** OBSOLETE
    const student = await db.query(`
      select
        u.email, u.username, first_names, last_name, user_id
      from acs_users_all u
      where (user_id = $(user_id))
    `, {user_id:+user_id}, {single:true})
    ***/

    const student = await db.query(`
      select i.*, data,
        --ischool.item_id as school_id,
        --ischool.name as school_name,
        oschool.object_id as school_id,
        oschool.title as school_title
      from cr_items i
      left join cr_revisions on (revision_id = i.latest_revision)
      left join acs_rels r1 on (r1.object_id_one = i.item_id) and (r1.rel_type = 'tapp.student-school')
      --left join cr_items ischool on (r1.object_id_two = ischool.item_id)
      left join acs_objects oschool on (r1.object_id_two = oschool.object_id)
      --left join acs_users_all u
      where (i.item_id = $(student_id))
    `, {student_id}, {single:true})


    const contracts = await db.query(`
    select
      ci.item_id as contract_id, ci.name as contract_name,
      cr.revision_id, cr.title as contract_title,
      di.item_id as district_id, di.name as district_name

    from acs_rels r1
    join cr_items ci on (ci.item_id = r1.object_id_two)
    left join cr_revisions cr on (revision_id = ci.latest_revision)
    join cr_items di on (di.item_id = ci.parent_id)
    where (r1.object_id_one = $(student_id))
    and (r1.rel_type = 'tapp.student-contract')
    `, {student_id}, {single:false});

    const tutors = await db.query(`
    select
      ti.item_id as tutor_id, ti.name as tutor_name

    from acs_rels r1
    join cr_items ti on (ti.item_id = r1.object_id_one)
    left join cr_revisions tr on (revision_id = ti.latest_revision)
    where (r1.object_id_two = $(student_id))
    and (r1.rel_type = 'tapp.tutor-student')
    `, {student_id}, {single:false});





    /*
    student.contracts = await db.query(`
      select acs_rels.*,
        ci.name as contract_name,
        di.name as district_name
      from acs_rels
      join cr_items ci on (ci.item_id = object_id_two)
      join cr_items di on (di.item_id = ci.parent_id)
      where object_id_one = $(user_id)
      and (rel_type = 'tapp.student-contract');
    `, {user_id:+user_id},{single:false});
    */

    return Object.assign(student, {
      contracts,
      tutors
    });
  },
})
