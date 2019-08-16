const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    TUTORS DIRECTORY

*/

Meteor.methods({
  'districts-directory': async (cmd)=>{
    const {columns, verbose} = cmd;
    const {package_id, app_folder, districts_folder} =  _instance();
    const {folder_id} = districts_folder;
    _assert(Number.isInteger(folder_id),districts_folder,'fatal@14')
    /*********************************************************
      we could further limit by contect_id and package_id.
      Who can access that list ?
      -- we have emails here...
    **********************************************************/

    _assert (districts_folder,'','fatal@20')
    const folders = await db.query(`
      -- district directory
      select * from cr_folders
      join cr_items on (item_id = folder_id)
      where (parent_id = $(districts_folder))
      order by label
    `, {districts_folder:folder_id}, {single:false})

    console.log(`found ${folders.length} districts`);
    return folders
  },
})
