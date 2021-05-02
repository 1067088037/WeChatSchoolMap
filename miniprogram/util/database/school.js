const db = wx.cloud.database() //数据库对象

class School {
  /**
   * 通过id设置学校，id采用教育部的大学唯一标识码
   * @param {String} id 
   * @param {object} school 
   */
  setSchoolById(id, school) {
    db.collection('school').doc(id).set({
      data: {
        school: school
      }
    })
  }

  /**
   * 通过id获取学校
   * @param {String} id 
   */
  async getSchoolById(id) {
    try {
      return await (await db.collection('school').doc(id).get()).data.school
    } catch (e) {
      return null
    }
  }

  /**
   * 通过id获取校区列表
   * @param {String} id 
   */
  async getCampusById(id) {
    try {
      return await (await db.collection('school').doc(id).get()).data.school.campus
    } catch (e) {
      return null
    }
  }
}

module.exports = {
  school: new School()
}