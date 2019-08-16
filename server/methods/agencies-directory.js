const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    TUTORS DIRECTORY

*/

Meteor.methods({
  'agencies-directory': async (cmd)=>{
    const {columns, verbose} = cmd;
    const {package_id, app_folder, agencies_folder} =  _instance();
    const {folder_id} = agencies_folder;
    _assert(Number.isInteger(folder_id),agencies_folder,'fatal@14')
    /*********************************************************
      we could further limit by contect_id and package_id.
      Who can access that list ?
      -- we have emails here...
    **********************************************************/

    _assert (agencies_folder,'','fatal@20')
    const files = await db.query(`
      select
        folder_id, label, i.item_id, name, title
      from cr_items i
      join cr_folders on (folder_id = i.item_id)
      left join cr_revisions on (revision_id = latest_revision)
      where (parent_id = $(agencies_folder))
    `, {agencies_folder:folder_id}, {single:false})

    return files
  },
})
