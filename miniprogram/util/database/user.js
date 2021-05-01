const db = wx.cloud.database() //数据库对象

class User {
  /**
   * 获取用户的开放ID
   * @returns {Promise} 需要使用.then()获取
   */
  async getOpenId() {
    let openid = null
    await wx.cloud.callFunction({
      name: 'login'
    }).then(res => openid = res.result.openid)
    return openid
  }

  /**
   * 设置用户信息
   * @param {String} openid 用户开放ID
   * @param {object} userinfo 用户信息
   */
  setUserInfo(openid, userinfo) {
    db.collection('user').doc(openid).set({
      data: {
        userinfo: userinfo
      }
    })
  }

  /**
   * 读取UserInfo
   * @param {String} openid 用户开放ID
   * @returns {Promise} 需要使用.then()获取
   */
  async getUserInfo(openid) {
    try {
      return await (await db.collection('user').doc(openid).get()).data.userinfo
    } catch(e) {
      return null
    }
  }
}

module.exports = {
  user: new User()
}