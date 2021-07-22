const _db = wx.cloud.database()

export class School {
  /**
   * 获取全部学校
   * @returns {Array} 学校数组
   */
  async getAllSchool() {
    return await wx.cloud.callFunction({
      name: 'getAllSchool'
    }).catch(err => [])
  }

  /**
   * 通过ID获取学校
   * @param {string} schoolId 学校ID
   * @returns {object} 学校
   */
  async getSchool(schoolId) {
    return await _db.collection('school').doc(schoolId).get().then(res => res.data).catch(err => null)
  }

  /**
   * 用户是否是学校的管理员
   * @param {string} schoolId 
   * @param {string} openid 
   */
  async isAdmin(schoolId, openid) {
    return this.getSchool(schoolId).then(res => {
      return res.admin.indexOf(openid) != -1
    })
  }
}