const {api} = require('../219-openacs-api')
const {tapp, utils, _instance} = require('../220-tapp-lib')
const {_assert} = utils;
/*

    DROP CONTRACT FILE

*/

Meteor.methods({
  'drop-contract-file': async (item_id)=>{
    _assert(Number.isInteger(+item_id), item_id, `fatal@12 item_id:${item_id}`)

    return await drop_contract_file(+item_id)
    .catch(err =>{
      throw new Meteor.Error(err)
    })
  }
});

async function drop_contract_file(item_id) {

  _assert(Number.isInteger(+item_id), item_id, 'fatal@22')

  await api.content_item__delete(+item_id)


  return {retCode:'ok'};
}
