const path = require('path')
const qiniu = require('qiniu')
const console = require('console')

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

const options = { scope: 'derealize' }
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

const fileName =
  process.platform === 'darwin'
    ? `Derealize-with-runtime-${process.env.npm_package_version}.dmg`
    : `Derealize-with-runtime-${process.env.npm_package_version}.exe`
const filePath = path.join(__dirname, `../release-with-runtime/${fileName}`)

formUploader.putFile(uploadToken, fileName, filePath, putExtra, (respErr, respBody) => {
  if (respErr) {
    console.error('putFile with-runtime', respErr)
    return
  }
  console.log('putFile with-runtime done.', respBody)

  const fileNameStatic = process.platform === 'darwin' ? `Derealize-with-runtime.dmg` : `Derealize-with-runtime.exe`
  const optionsStatic = { scope: `derealize:${fileNameStatic}` }
  const putPolicyStatic = new qiniu.rs.PutPolicy(optionsStatic)
  const uploadTokenStatic = putPolicyStatic.uploadToken(mac)

  formUploader.putFile(uploadTokenStatic, fileNameStatic, filePath, putExtra, (respErr2, respBody2) => {
    if (respErr2) {
      console.error('putFileStatic with-runtime', respErr2)
      return
    }
    console.log('putFileStatic with-runtime done.', respBody2)
  })
})
