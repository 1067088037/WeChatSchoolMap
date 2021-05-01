const db = wx.cloud.database() //数据库对象
const debug = true //数据库全局调试打印开关

/**
 * 添加用户信息
 * @param {object} userInfo 传入的用户信息
 */
function addUserInfo(userInfo) {
  db.collection('users').add({
    data: {
      userInfo: userInfo
    },
    success: function(res) {
      if (debug) console.log(res)
    }
  })
}

function getUserInfo(openid) {

}

module.exports = {
  addUserInfo: addUserInfo,
  getUserInfo: getUserInfo
}