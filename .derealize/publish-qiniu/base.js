const qiniu = require('qiniu')

const accessKey = '***REMOVED***'
const secretKey = '***REMOVED***'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

const config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z0
config.RPC_TIMEOUT = 1200000
// config.useHttpsDomain = true;
// const bucketManager = new qiniu.rs.BucketManager(mac, config)

const formUploader = new qiniu.form_up.FormUploader(config)
const putExtra = new qiniu.form_up.PutExtra()

module.exports = { mac, formUploader, putExtra }