const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const cmd = db.command
const MAX_LIMIT = 100

exports.main = async (event, context) => {
  console.log(event)
  let thisUser = await (await db.collection('user').doc(event._openid).get()).data
  let permission = thisUser.info.permission
  console.log(permission)

  switch (permission) {
    case 0: return [] //黑名单
    case 16: return [] //访客
    case 32: return [] //学生
    case 48: return [] //编辑
    case 64: //部门管理员
      var where = db.collection('user').where({
        'info.permission': cmd.lt(permission), //查询的必须是权限更低的用户
        'info.section.join': thisUser.info.section.admin //加入了这个部门
      })
      break
    case 80: //校区管理员
      var where = db.collection('user').where({
        'info.permission': cmd.lt(permission), //查询的必须是权限更低的用户
        'info.campus': thisUser.info.campus //属于该校区
      })
      break
    case 96: //学校管理员
      var where = db.collection('user').where({
        'info.permission': cmd.lt(permission), //查询的必须是权限更低的用户
        'info.school': thisUser.info.school //属于该学校
      })
      break
    case 112: //管理员
      var where = db.collection('user').where({
        'info.permission': cmd.lt(permission), //查询的必须是权限更低的用户
      })
      break
    case 128: //超级管理员
      var where = db.collection('user').where({
        '_openid': cmd.neq(event._openid)
      })
      break
    default:
      return '给定的权限等级无效'
  }
  // 先取出集合记录总数
  const countResult = await where.count()
  const total = countResult.total
  console.log('total = ' + total)
  if (total == 0) return [] //没有人

  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = where.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
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