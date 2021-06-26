const path = require('path')
const qiniu = require('qiniu')
const console = require('console')

const accessKey = 'RNYZ1Zk4SbQO77r-WnvmtkOnMvoCtoShWL9d14tj'
const secretKey = 'D-5D5d26yRluiCi_izuhR6JxYo0W-0TfEjQVUJmm'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

const config = new qiniu.conf.Config()
config.zone = qiniu.zone.Zone_z0
// config.useHttpsDomain = true;
// const bucketManager = new qiniu.rs.BucketManager(mac, config)

const formUploader = new qiniu.form_up.FormUploader(config)
const putExtra = new qiniu.form_up.PutExtra()

const options = { scope: 'derealize' }
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

const fileName =
  process.platform === 'darwin'
    ? `Derealize-${process.env.npm_package_version}.dmg`
    : `Derealize-${process.env.npm_package_version}.exe`
const setupFile = path.join(__dirname, `../release/${fileName}`)

formUploader.putFile(uploadToken, fileName, setupFile, putExtra, (respErr, respBody) => {
  if (respErr) {
    console.error('putFile', respErr)
    return
  }
  console.log('putFile done.', respBody)

  const fileNameStatic = process.platform === 'darwin' ? `Derealize.dmg` : `Derealize.exe`
  const optionsStatic = { scope: `derealize:${fileNameStatic}` }
  const putPolicyStatic = new qiniu.rs.PutPolicy(optionsStatic)
  const uploadTokenStatic = putPolicyStatic.uploadToken(mac)

  formUploader.putFile(uploadTokenStatic, fileNameStatic, setupFile, putExtra, (respErr2, respBody2) => {
    if (respErr2) {
      console.error('putFileStatic', respErr2)
      return
    }
    console.log('putFileStatic done.', respBody2)
  })
})

const fileNameWithRuntime =
  process.platform === 'darwin'
    ? `Derealize-with-runtime-${process.env.npm_package_version}.dmg`
    : `Derealize-with-runtime-${process.env.npm_package_version}.exe`
const setupFileWithRuntime = path.join(__dirname, `../release-with-runtime/${fileNameWithRuntime}`)

formUploader.putFile(uploadToken, fileNameWithRuntime, setupFileWithRuntime, putExtra, (respErr, respBody) => {
  if (respErr) {
    console.error('putFile with-runtime', respErr)
    return
  }
  console.log('putFile with-runtime done.', respBody)

  const fileNameStatic = process.platform === 'darwin' ? `Derealize-with-runtime.dmg` : `Derealize-with-runtime.exe`
  const optionsStatic = { scope: `derealize:${fileNameStatic}` }
  const putPolicyStatic = new qiniu.rs.PutPolicy(optionsStatic)
  const uploadTokenStatic = putPolicyStatic.uploadToken(mac)

  formUploader.putFile(uploadTokenStatic, fileNameStatic, setupFileWithRuntime, putExtra, (respErr2, respBody2) => {
    if (respErr2) {
      console.error('putFileStatic with-runtime', respErr2)
      return
    }
    console.log('putFileStatic with-runtime done.', respBody2)
  })
})
