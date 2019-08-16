const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    TUTORS DIRECTORY

*/

Meteor.methods({
  'schools-directory': async (cmd)=>{
    const {columns, verbose, district_id} = cmd;
    const {package_id, app_folder, schools_folder} =  _instance();
    const {folder_id} = schools_folder;
    _assert(Number.isInteger(folder_id),schools_folder,'fatal@14')

    /*********************************************************
      we could further limit by contect_id and package_id.
      Who can access that list ?
      -- we have emails here...
    **********************************************************/

    _assert (schools_folder,'','fatal@20')

    if (district_id) {
      const files = await db.query(`
        select
          i.item_id, name, title, cr_revisions.description, cr_folders.label as district_label
        from cr_items i
        left join cr_revisions on (revision_id = latest_revision)
        join cr_folders on (folder_id = i.parent_id)
        join cr_item_rels ir on (ir.related_object_id = $(district_id)) and (ir.item_id = i.item_id)
        where (parent_id = $(schools_folder))
        order by title;
      `, {schools_folder:folder_id, district_id}, {single:false})

      return files;
    }

    const files = await db.query(`
      select
        i.item_id, name, title, cr_revisions.description, cr_folders.label as district_label
      from cr_items i
      left join cr_revisions on (revision_id = latest_revision)
      join cr_folders on (folder_id = i.parent_id)
      where (parent_id = $(schools_folder))
      order by title;
    `, {schools_folder:folder_id}, {single:false})

    return files
  },
})
