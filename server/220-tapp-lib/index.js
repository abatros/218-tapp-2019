module.exports = {
  _instance: require('./get-tapp-metadata').tapp_instance,

  tapp: {
    _instance: require('./get-tapp-metadata').tapp_instance,
    get_tapp_instance: require('./get-tapp-instance'),
    get_tapp_metadata: require('./get-tapp-metadata').get_tapp_metadata,
//    open_tapp_instance: require('./open-tapp-instance'),
  },
  utils: require('./utils.js')
}
