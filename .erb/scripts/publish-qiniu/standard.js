const path = require('path')
const qiniu = require('qiniu')
const console = require('console')
const { mac, formUploader, putExtra } = require('./base')

const putPolicy = new qiniu.rs.PutPolicy({ scope: 'derealize' })
const uploadToken = putPolicy.uploadToken(mac)

const fileName =
  process.platform === 'darwin'
    ? `Derealize-${process.env.npm_package_version}.dmg`
    : `Derealize-${process.env.npm_package_version}.exe`
const filePath = path.join(__dirname, `../../../release/${fileName}`)

formUploader.putFile(uploadToken, fileName, filePath, putExtra, (respErr, respBody) => {
  if (respErr) {
    console.error('putFile', respErr)
    return
  }
  console.log('putFile done.', respBody)

  const fileNameStatic = process.platform === 'darwin' ? `Derealize.dmg` : `Derealize.exe`
  const putPolicyStatic = new qiniu.rs.PutPolicy({ scope: `derealize:${fileNameStatic}` })
  const uploadTokenStatic = putPolicyStatic.uploadToken(mac)

  formUploader.putFile(uploadTokenStatic, fileNameStatic, filePath, putExtra, (respErr2, respBody2) => {
    if (respErr2) {
      console.error('putFile --static', respErr2)
      return
    }
    console.log('putFile --static done.', respBody2)
  })
})
