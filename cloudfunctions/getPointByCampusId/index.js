const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const cmd = db.command
const MAX_LIMIT = 100

exports.main = async (event, context) => {
  console.log(event)
  // 先取出集合记录总数
  var where = null
  if (event.getHiden) {
    where = {
      'super._id': event.campusId
    }
  } else {
    let nowDate = new Date()
    console.log(nowDate)
    where = {
      'super._id': event.campusId,
      'time.show': cmd.lte(nowDate),
      'time.hide': cmd.gte(nowDate)
    }
  }
  console.log(where)
  const countResult = await db.collection('point').where(where).count()
  const total = countResult.total
  console.log(total)
  if (total == 0) return {
    data: []
  }

  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('point').where(where).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}