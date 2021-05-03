const db = wx.cloud.database()

export class User {
  /**
   * 调用云函数获取openid
   */
  async getOpenId() {
    try {
      return await wx.cloud.callFunction({
        name: 'login'
      })
    } catch (err) {
      return null
    }
  }

  /**
   * 设置用户信息
   * @param {string} openid 
   * @param {object} userInfo 
   */
  setUserInfo(openid, userInfo) {
    db.collection('user').doc(openid).get().then(res => {
      db.collection('user').doc(openid).update({
        data: {
          userInfo: userInfo,
        }
      })
    }).catch(e => {
      db.collection('user').add({
        data: {
          _id: openid,
          userInfo: userInfo,
          info: {},
          point: [],
          favorite: []
        }
      })
    })
  }

  setInfo(openid, info) {
    db.collection('user').doc(openid).update({
      data: {
        info: info
      }
    })
  }

  /**
   * 通过openid获取用户
   * @param {string} openid 
   */
  async getUser(openid) {
    try {
      return await (await db.collection('user').doc(openid).get()).data
    } catch (e) {
      return null
    }
  }
}