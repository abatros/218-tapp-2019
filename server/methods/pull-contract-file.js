const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;

/*

    CONTRACT

*/

Meteor.methods({
  'pull-contract-file': async (cmd)=>{
    console.log(`pull-contract-file:`, {cmd})
    const {item_id, columns, verbose, with_agency} = cmd;
    const {package_id, app_folder} =  _instance();

    _assert(item_id, cmd, "fatal@14 ONLY item_id:contract_id to access a contract-file")

    /***********************************************
      contract-file >> contract >> client
      contract-file >> agency
    ************************************************/

    const file = await db.query(`
      -- pull contract-file
      select
       i.name, re.title, re.data,
       fc.label as contract_number, fc.folder_id as contract_id,
       ag.title as agency_title, ag.object_id as agency_id,
       --u.user_id, u.username, u.first_names, u.last_name,
       si.name as student_name, si.item_id as student_id, sr.data as student_data,
       ti.name as tutor_name, ti.item_id as tutor_id, tr.data as tutor_data,
       fd.folder_id as district_id, fd.label as district_label

      from cr_items i
      left join cr_revisions re on (revision_id = i.latest_revision)

      -- contract
      join cr_folders fc on (fc.folder_id = i.parent_id)

      -- agency
      join cr_items ic on (ic.item_id = i.parent_id)
      left join acs_rels rag on (rag.object_id_one = i.item_id)
      left join acs_objects ag on (ag.object_id = rag.object_id_two)

      -- district
      join cr_folders fd on (fd.folder_id = ic.parent_id)

      -- client/student
      left join cr_item_rels rs on (rs.item_id = fc.folder_id)
        and (rs.relation_tag = 'tapp.contract-student-rel')
      left join cr_items si on (si.item_id = rs.related_object_id)
      left join cr_revisions sr on (sr.revision_id = si.latest_revision)

      -- tutor (service-provider)
      left join cr_item_rels rt on (rt.item_id = i.item_id)
        and (rt.relation_tag = 'tapp.contract-tutor-rel')
      left join cr_items ti on (ti.item_id = rt.related_object_id)
      left join cr_revisions tr on (tr.revision_id = ti.latest_revision)


      where i.item_id = $(item_id)
    `, {item_id, package_id}, {single:true})


    return file;
  },
})
