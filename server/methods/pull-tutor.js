const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    PULL-tutor

*/


Meteor.methods({
  'pull-tutor': async (cmd)=>{
    const {tutor_id, columns, verbose} = cmd;
    const {package_id, app_folder} =  _instance();

    _assert(tutor_id, cmd, "fatal@14 ONLY tutor_id to access a contract")

    /*********************************************************

        join with acs_users_all.... TODO

    **********************************************************/

    const tutor = await db.query(`
    select *
    from cr_items i
    join cr_revisions on (revision_id = latest_revision)
    where (i.item_id = $(tutor_id))
    `,{tutor_id: +tutor_id},{single:true})

    _assert(tutor, cmd, 'fatal@27')

    /*
    const tutor = await db.query(`
      select
        u.email, u.username, first_names, last_name, user_id
      from acs_users_all u
      where (user_id = $(user_id))
    `, {user_id:+user_id}, {single:true})
    */


    tutor.contracts = await db.query(`
      select acs_rels.*,
        ci.name as contract_name,
        di.name as district_name
      from acs_rels
      join cr_items ci on (ci.item_id = object_id_two)
      join cr_items di on (di.item_id = ci.parent_id)
      where object_id_one = $(tutor_id)
      and (rel_type = 'tapp.tutor-contract');
    `, {tutor_id},{single:false});


    return tutor;
  },
})
