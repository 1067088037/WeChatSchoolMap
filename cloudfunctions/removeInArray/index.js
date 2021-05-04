// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const cmd = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  db.collection(event.collection).doc(event.docid).update({
    data: {
        [event.array]: cmd.pull(event.remove)
    }
  })
}