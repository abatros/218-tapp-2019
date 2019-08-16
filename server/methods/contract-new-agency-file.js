const {api} = require('../219-openacs-api')
const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    TUTORS DIRECTORY

*/

Meteor.methods({
  'contract.new-agency-file': async (o)=>{
    const {package_id, app_folder} =  _instance();

    const {contract_id, agency_id, file_name, title, description, text, data, verbose} =o;
    _assert('contract_id agency_id file_name'.split(/\s+/g), o)
    /*
    _assert(contract_id, o, 'Missing contract_id')
    _assert(agency_id, o, 'Missing agency_id')
    _assert(name, o, 'Missing name')
    */

    const item_id = await api.content_item__new({
      name: file_name, // unique caller is responsible
      parent_id: contract_id,
      //locale,
      //creation_date = new Date(),
      //creation_user,
      context_id: contract_id,
      //creation_ip = '127.0.0.1',
      item_subtype: 'tapp.contract-agency-file',
      //content_type = 'content_revision',
      title: title || file_name,
      description,
      //mime_type = 'text/plain',
      //nls_language = 'us_EN',
      text,
      data, // ATTENTION JSONB here
      relation_tag: 'tapp.contract-agency-folder',
      //is_live = true,
      //storage_type = 'text',
      package_id,
      //with_child_rels = true,
      verbose
    })
    .then(item_id =>{
      return item_id
    })
    .catch(async err =>{
      if (err.code != 23505) throw err;
      console.log(`contract.new-agency-file alert:`,err.detail)

      return await db.query(`
        select item_id
        from cr_items
        where parent_id = $(contract_id)
        and (name = $(file_name));
      `, {contract_id, file_name},{single:true})
      .then(retv =>{
        const {item_id} = retv;
        console.log(`found cr_item(${file_name}) =>${item_id}`)
        return +item_id
      })
    })


    _assert('item_id contract_id agency_id',o)
    _assert(Number.isInteger(+item_id), item_id, 'fatal@64')

    await api.acs_rel__new({
      rel_type: 'tapp.contract-agency-rel',
      object_id_one: +item_id, // ex: file 101-agency-87543
      object_id_two: +agency_id,
      context_id: +contract_id,
//        creation_user,
//        creation_ip = '127.0.0.1',
        // extension
      package_id
    })
    .catch(err =>{
      if (err.code != 23505) throw err;
      console.log(`contract.new-agency-file alert:`,err.detail)
    })

    return {
      retCode: 'work-in-progress',
      item_id
    }
  }
});
