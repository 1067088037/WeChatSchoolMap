const _db = wx.cloud.database()

export class School {
  /**
   * 获取全部学校
   */
  async getAllSchool() {
    try {
      return await wx.cloud.callFunction({
        name: 'getAllSchool'
      })
    } catch(err) {
      return null
    }
  }

  /**
   * 通过ID获取学校
   * @param {string} id 
   */
  async getSchool(id) {
    try {
      return await (await _db.collection('school').doc(id).get()).data
    } catch(e) {
      return null
    }
  }
}