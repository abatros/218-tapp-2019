
const fs = require('fs')
const yaml = require('js-yaml');
const massive = require('massive');
const monitor = require('pg-monitor');

//const { openacs } = require('../211-openacs-drive/openacs-drive-api.js');
const {_assert, api} = require('./219-openacs-api');
//const tapp = require('220-tapp-api');

const conn__ = {
    host: process.env.PGHOST || 'ultimheat.com',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE || 'openacs-cms',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD,
    pg_monitor: false
};

async function pg_connect (conn) {
    conn = Object.assign(conn__, conn)
    _assert(conn.password, conn, 'Missing password');
    /*global*/ db = await massive(conn)
    .catch(err =>{
      console.log(`FATAL @47`);
      console.log(conn);
      throw err;
    });
    if (!db) throw 'Unable to connect.'
    if (conn.pg_monitor) {
      monitor.attach(db.driverConfig);
      console.log(`pg-monitor attached-Ok.`);
    }

  //console.log('connected')
  return db
}

  //connect(); // immediately. so other modules using this will have correct value {db}
  //exports.db = db;

async function pg_disconnect () {
    await db.pgp.end();
}

module.exports = {
  pg_connect,
  pg_disconnect
};
