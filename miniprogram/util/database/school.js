const _db = wx.cloud.database()

export class School {
  /**
   * 获取全部学校
   * @returns {Array} 学校数组
   */
  async getAllSchool() {
    try {
      return await wx.cloud.callFunction({
        name: 'getAllSchool'
      })
    } catch(err) {
      return []
    }
  }

  /**
   * 通过ID获取学校
   * @param {string} schoolId 学校ID
   * @returns {object} 学校
   */
  async getSchool(schoolId) {
    try {
      return await (await _db.collection('school').doc(schoolId).get()).data
    } catch(e) {
      return null
    }
  }
}