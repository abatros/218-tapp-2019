const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    PULL DISTRICT

    A district is a folder, with all contracts.
*/

Meteor.methods({
  'pull-district': async (cmd)=>{
    const {folder_id:district_id, columns, verbose} = cmd;
    const {package_id, app_folder} =  _instance();

    _assert(district_id, cmd, "fatal@14 ONLY folder_id to access a district")

    /*********************************************************
      we could further limit by contect_id and package_id.
      Who can access that list ?
      -- we have emails here...
    **********************************************************/


    const district_folder = await db.query(`
      select
        folder_id, label, name
      from cr_folders
      join cr_items on (item_id = folder_id)
      -- cr_revisions and data.
      where(folder_id =$(district_id));
    `, {district_id}, {single:true});


    const schools = await db.query(`
    -- (district)=>[schools]
    select
      si.item_id as school_id, si.name as school_name
    from acs_rels
    join cr_items si on (si.item_id = object_id_one)
    where (object_id_two = $(district_id))
    and (rel_type = 'tapp.school-district');
    `,{district_id}, {single:false});


    const contracts = await db.query(`
      -- (district) => (contract,student)
        select
          folder_id, label, ci.name,
          si.name as student_name, si.item_id as student_id,
          sr.data as student_data

        from cr_items ci -- contracts
        join cr_folders fc on (fc.folder_id = ci.item_id)
        -- district
        join cr_items di on (di.item_id = ci.parent_id)

        -- student
        left join acs_rels sc on (sc.object_id_two = ci.item_id)
        and (rel_type = 'tapp.student-contract')
        left join cr_items si on (si.item_id = sc.object_id_one)
        left join cr_revisions sr on (sr.revision_id = si.latest_revision)
        where(di.item_id = $(district_id))
    `, {district_id}, {single:false});


//    console.log({contracts})

    Object.assign(district_folder,{schools});
    Object.assign(district_folder,{contracts});

    return district_folder;
  },
})
