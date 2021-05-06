const _db = wx.cloud.database()
const cmd = _db.command

export class Section {
  /**
   * 获取全部部门
   * @param {string} schoolId 
   */
  async getSectionArray(schoolId) {
    try {
      return await wx.cloud.callFunction({
        name: 'getAllBySuperId',
        data: {
          superId: schoolId
        }
      })
    } catch (err) {
      return []
    }
  }

  /**
   * 新建部门
   * @param {string} schoolId 
   * @param {object} section 包含name,desc,images,geo
   */
  addSection(schoolId, section) {
    _db.collection('section').add({
      data: {
        super: {
          _id: schoolId,
          type: 'school'
        },
        name: section.name,
        desc: section.desc,
        images: section.images,
        geo: section.geo
      }
    })
  }

  /**
   * 删除指定部门
   * @param {string} sectionId 部门ID
   */
  removeSection(sectionId) {
    _db.collection('section').doc(sectionId).remove()
  }

  /**
   * 更新部门
   * @param {string} sectionId 
   * @param {object} section 
   */
  updateSection(sectionId, section) {
    _db.collection('section').doc(sectionId).update({
      data: section
    })
  }
}