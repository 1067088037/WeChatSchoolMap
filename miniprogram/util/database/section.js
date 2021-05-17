const _db = wx.cloud.database()
const cmd = _db.command

export class Section {
  /**
   * 获取全部部门
   * @param {string} schoolId 
   */
  async getSectionArray(schoolId) {
    return await wx.cloud.callFunction({
      name: 'getAllBySuperId',
      data: {
        collection: 'section',
        superId: schoolId
      }
    }).then(res => res.result).catch(err => [])
  }

  /**
   * 获取加入了该社团的用户 用户信息是简化信息 需要详细信息可以使用openid获取
   * isAdmin只针对是不是传入社团的社团管理员，与学校、校区等管理员无关
   * @param {string} sectionId 
   */
  async getUserInSection(sectionId) {
    return await wx.cloud.callFunction({
      name: 'getUserInSection',
      data: {
        sectionId: sectionId
      }
    }).then(res => res.result).catch(err => [])
  }

  /**
   * 加入社团
   * @param {string} sectionId 要加入的社团
   * @param {string} permission 权限 只能传入 32 48 64
   * @param {string} openid 要加入的人 默认当前用户
   */
  async joinSection(sectionId, permission, openid = getApp().globalData.openid) {
    //todo
    console.error('该方法尚未完工')
    return _db.collection('user').doc(openid).update({
      data: {
        'info.section.join': cmd.addToSet(sectionId)
      }
    })
  }

  /**
   * 退出社团
   * @param {string} sectionId 要退出的社团
   * @param {string} openid 要退出的人 默认当前用户
   */
  async exitSection(sectionId, openid = getApp().globalData.openid) {
    return _db.collection('user').doc(openid).update({
      data: {
        'info.section.join': cmd.pull(sectionId)
      }
    })
  }

  /**
   * 新建部门
   * @param {string} schoolId 
   * @param {object} section 包含name,desc,images,geo
   */
  addSection(schoolId, section) {
    return _db.collection('section').add({
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
    return _db.collection('section').doc(sectionId).remove()
  }

  /**
   * 更新部门
   * @param {string} sectionId 
   * @param {object} section 
   */
  updateSection(sectionId, section) {
    return _db.collection('section').doc(sectionId).update({
      data: section
    })
  }
}