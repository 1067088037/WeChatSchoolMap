const db = wx.cloud.database() //数据库对象

const user = require('./user')
const school = require('./school')
const map = require('./map')

module.exports = {
  cloud: wx.cloud.database(),
  user: user.user,
  school: school.school,
  map: map.map,
  Geo: db.Geo
}