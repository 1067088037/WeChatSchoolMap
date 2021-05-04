// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  return db.collection(event.collection).doc(event.docid).get().then(res => {
    let data = res.data
    let newArray = []
    data[event.array].forEach(function (e) {
      if (e != event.remove) point.push()
    })
    db.collection(event.collection).doc(event.docid).update({
      data: {
        [event.array]: newArray
      }
    })
  })
}