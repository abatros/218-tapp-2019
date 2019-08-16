const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    TUTORS DIRECTORY

*/

Meteor.methods({
  'contracts-directory': async (cmd)=>{
    const {columns, verbose, district_id, tutor_id} = cmd;
    const {package_id, app_folder} =  _instance();

    console.log(`method.contracts-directory:`,{cmd})

    /*********************************************************
      we could further limit by contect_id and package_id.
      Who can access that list ?
      -- we have emails here...


              select cr_folders.*,
                i.name, label,
              	o.context_id, o.title,
              	i2.name as district_name
              from cr_folders
              join cr_items i on item_id = folder_id
              join acs_objects o on object_id = folder_id
              join cr_items i2 on i2.item_id = i.parent_id
              join cr_item_rels on (cr_item_rels.item_id = folder_id)
              --join acs_objects o3 on (o3.object_id = cr_item_rels.related_object_id)

              where (object_type = 'tapp.contract') -- no need...?
              and (i.parent_id = $(district_id))
              and o.package_id = $(package_id);

    **********************************************************/

    if (tutor_id) {
      const folders = await db.query(`
        -- this is list of contract-files, not contracts!!!!
      select
        cfile.item_id as cfile_id, cfile.name as cfile_name,
        --r1.relation_tag,
        --ot.title as tutor_title, ot.object_id as tutor_id,
        ic.item_id as contract_id, ic.name as contract_name,
        id.item_id as district_id, id.name as district_name,
        sr.data->'first_names' as first_names,
        sr.data->'last_name' as last_name,
  	    si.item_id as student_id, si.name as student_name

      from cr_item_rels r1
      join cr_items cfile on (cfile.item_id = r1.item_id)
      join acs_objects ot on (ot.object_id = r1.related_object_id)

      join cr_items ic on (ic.item_id = cfile.parent_id)

      -- district
      join cr_items id on (id.item_id = ic.parent_id)

      -- get the student/client from contract ic.
      left join cr_item_rels r2 on (r2.item_id = ic.item_id)
      left join cr_items si on (si.item_id = r2.related_object_id)
      left join cr_revisions sr on (sr.revision_id = si.latest_revision)

      where (r1.relation_tag = 'tapp.contract-tutor-rel')
      and (r1.related_object_id = $(tutor_id))
  	  --order by contract_id;
      `, {package_id, tutor_id}, {single:false})

      return folders;
    }


    if (district_id) {
      const folders = await db.query(`
      select cr_folders.*,
        i.name as contract_name,
        label,
        o.context_id, o.title,
        i2.name as district_name,
        --o3.title as student_title,
        --acs_rels.object_id_one as student_id
        --o3.object_id as student_id
        si.name as student_name, si.item_id as student_id,
        sr.data as student_data

      from cr_folders
      join cr_items i on item_id = folder_id
      join acs_objects o on object_id = folder_id
      join cr_items i2 on i2.item_id = i.parent_id
      left join acs_rels r2 on (r2.object_id_two = folder_id)
        and (r2.rel_type = 'tapp.student-contract')
      left join cr_items si on (si.item_id = r2.object_id_one)
      left join cr_revisions sr on (sr.revision_id = si.latest_revision)


      --left join acs_objects o3 on (o3.object_id = r2.object_id_one)
      where (o.object_type = 'tapp.contract') -- no need...?
      --and i2.name = 'Lennox'
      and (i.parent_id = $(district_id))
      and (o.package_id = $(package_id));
      `, {package_id, district_id}, {single:false})

      return folders;
    }

    const folders = await db.query(`
      -- this is contract, Not contract-file => no tutor yet.
      select cr_folders.*,
        ic.name as contract_name, ic.item_id as contract_id,
        label,
      	o.context_id, o.title,
        si.name as student_name, si.item_id as student_id,
        sr.data as student_data,
      	i2.name as district_name, i2.item_id as district_id

      from cr_folders
      join cr_items ic on ic.item_id = folder_id
      join acs_objects o on object_id = folder_id
      join cr_items i2 on i2.item_id = ic.parent_id

      -- get the student-contract from contract ic.
      left join acs_rels r2 on (r2.object_id_two = ic.item_id)
          and (r2.rel_type = 'tapp.student-contract')
      left join cr_items si on (si.item_id = r2.object_id_one)
      left join cr_revisions sr on (sr.revision_id = si.latest_revision)
      --left join cr_item_rels r2 on (r2.item_id = ic.item_id)
      --left join cr_items si on (si.item_id = r2.related_object_id)
      --left join cr_revisions sr on (sr.revision_id = si.latest_revision)



      where (object_type = 'tapp.contract')
      and o.package_id = $(package_id);
    `, {package_id}, {single:false})

    return folders;
  },
})
