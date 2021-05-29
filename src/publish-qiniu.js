const path = require('path')
const qiniu = require('qiniu')
const console = require('console')

const fileName =
  process.platform === 'darwin'
    ? `Derealize-${process.env.npm_package_version}.dmg`
    : `Derealize Setup ${process.env.npm_package_version}.exe`

const setupFile = path.join(__dirname, `../release/${fileName}`)

const accessKey = '***REMOVED***'
const secretKey = '***REMOVED***'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

const config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z0
// config.useHttpsDomain = true;
// const bucketManager = new qiniu.rs.BucketManager(mac, config)

const options = { scope: 'derealize' }
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)
const formUploader = new qiniu.form_up.FormUploader(config)
const putExtra = new qiniu.form_up.PutExtra()

formUploader.putFile(uploadToken, fileName, setupFile, putExtra, (respErr, respBody) => {
  if (respErr) {
    console.error('putFile', respErr)
    return
  }
  console.log('putFile done.', respBody)
})
