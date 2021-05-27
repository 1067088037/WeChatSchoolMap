// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('comment').where({
    'super._id': event.superId
  }).get().then(res => {
    console.log(res.data)
    res.data.forEach(e => {
      wx.cloud.deleteFile({
        fileList: e.images
      })
    })
  }).then(() => {
    db.collection('comment').where({
      'super._id': event.superId
    }).remove()
    db.collection('like').where({
      'super.super._id': event.superId
    }).remove()
  })
}