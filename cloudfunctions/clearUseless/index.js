const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100

exports.main = async (event, context) => {
  console.log(event)
  const countResult = await db.collection(event.clearCollection).count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / 100)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    tasks.push(db.collection(event.clearCollection).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get())
  }
  // 等待所有
  let result = await (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
  let data = result.data

  data.forEach(element => {
    if (element.super != undefined && element.super._id != undefined && element.super.type != undefined) {
      let super_id = element.super._id
      let superType = element.super.type
      console.log(super_id + ' : ' + superType)
      db.collection(superType).where({ _id: super_id }).get().then(res => {
        if (res.data.length == 0) db.collection(event.clearCollection).doc(element._id).remove() //标注父类但父类缺失
      })
    } else {
      if (event.clearNoSuper) db.collection(event.clearCollection).doc(element._id).remove() //不标注父类直接删除
    }
  })

}