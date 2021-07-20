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
const fileName = `nodegit-v${process.env.npm_package_version}-electron-v12.0-win32-x64.tar.gz`
const putPolicy = new qiniu.rs.PutPolicy({ scope: `derealize:${fileName}` })

formUploader.putFile(
  putPolicy.uploadToken(mac),
  fileName,
  path.join(__dirname, `./node_modules/nodegit/build/stage/${fileName}`),
  new qiniu.form_up.PutExtra(),
  (respErr, respBody) => {
    if (respErr) {
      console.error('putFile', respErr)
      return
    }
    console.log('putFile done.', respBody)
  },
)
