const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;

/*

    CONTRACT

*/

Meteor.methods({
  'pull-contract': async (cmd)=>{
    const {folder_id:contract_id, columns, verbose, with_agencies} = cmd;
    const {package_id, app_folder} =  _instance();

    _assert(contract_id, cmd, "fatal@14 ONLY folder_id:contract_id to access a contract")

    /*********************************************************
      we could further limit by contect_id and package_id.
      Who can access that list ?
      -- we have emails here...
    **********************************************************/

    const folder = await db.query(`
      select cr_folders.*,
        i.name, label,
--      	o.context_id, o.title,
      	i2.name as district_name, i2.item_id as district_id,
        user_id,
        u.username, u.first_names, u.last_name
      from cr_folders
      join cr_items i on item_id = folder_id
--      join acs_objects o on object_id = folder_id
      join cr_items i2 on i2.item_id = i.parent_id

      left join acs_rels on (object_id_two = i.item_id)
      left join acs_users_all u on (user_id = object_id_one)

      where --(object_type = 'tapp.contract')
        folder_id = ${contract_id}
      -- and o.package_id = $(package_id);
    `, {contract_id, package_id}, {single:true})

    _assert(folder, cmd, 'fatal@43')

    /*****************************************************

      IF REQUESTED, PULL the agency-files

    ******************************************************/

    const agency_files = await db.query(`
      --- agency-files
      select i.item_id, name,
        cr_revisions.title, revision_id,
        ag.title as agency_title
      from cr_items i
      left join cr_revisions on (revision_id = latest_revision)
      left join acs_rels on (object_id_one = i.item_id)
      left join acs_objects ag on (object_id_two = ag.object_id)
      where (parent_id = $(contract_id))
      --and (package_id = $(package_id))
    `, {contract_id, package_id})



    return Object.assign(folder,{agency_files}); // an array
  },
})
