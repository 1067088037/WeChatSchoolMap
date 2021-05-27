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
    }).then(res => {
      return res.result
    }).catch(err => [])
  }

  /**
   * 获取单个用户的权限
   * @param {string} sectionId 
   * @param {string} openid 
   */
  async getUserPermission(sectionId, openid) {
    return await _db.collection('section').doc(sectionId).get().then(res => {
      let data = res.data
      return {
        openid: openid,
        isAdmin: data.admin.indexOf(openid) != -1,
        isEditor: data.editor.indexOf(openid) != -1
      }
    })
  }

  /**
   * 获取该校区的所有管理员
   * @param {string} sectionId 
   */
  async getAdmin(sectionId) {
    return await _db.collection('section').doc(sectionId).get().then(res => {
      res.data.admin
    })
  }

  /**
   * 添加管理员
   * @param {string} sectionId 
   * @param {string} openid 
   */
  async addAdmin(sectionId, openid) {
    return this.joinSection(sectionId, 64, openid)
  }

  /**
   * 移除管理员
   * @param {string} sectionId 
   * @param {string} openid 
   */
  async removeAdmin(sectionId, openid) {
    return await _db.collection('section').doc(sectionId).update({
      data: {
        admin: cmd.pull(openid)
      }
    })
  }

  /**
   * 获取该校区的所有编辑
   * @param {string} sectionId 
   */
  async getEditor(sectionId) {
    return await _db.collection('section').doc(sectionId).get().then(res => {
      res.data.editor
    })
  }

  /**
   * 添加编辑
   * @param {string} sectionId 
   * @param {string} openid 
   */
  async addEditor(sectionId, openid) {
    return this.joinSection(sectionId, 48, openid)
  }

  /**
   * 移除编辑
   * @param {string} sectionId 
   * @param {string} openid 
   */
  async removeEditor(sectionId, openid) {
    return await _db.collection('section').doc(sectionId).update({
      data: {
        editor: cmd.pull(openid)
      }
    })
  }

  /**
   * 加入社团
   * @param {string} sectionId 要加入的社团
   * @param {Number} permission 权限 只能传入 32 48 64
   * @param {string} openid 要加入的人 默认当前用户
   */
  async joinSection(sectionId, permission, openid = getApp().globalData.openid) {
    if (permission == 48) {
      await _db.collection('section').doc(sectionId).update({
        data: {
          editor: cmd.addToSet(openid)
        }
      })
    }
    else if (permission == 64) {
      await _db.collection('section').doc(sectionId).update({
        data: {
          admin: cmd.addToSet(openid)
        }
      })
    }
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
    this.removeAdmin(sectionId, openid)
    this.removeEditor(sectionId, openid)
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
        geo: section.geo,
        admin: [],
        editor: []
      }
    })
  }

  /**
   * 删除指定部门
   * @param {string} sectionId 部门ID
   */
  async removeSection(sectionId) {
    await this.getUserInSection(sectionId).then(res => {
      console.log(res)
      res.forEach(e => {
        _db.collection('user').doc(e._openid).update({
          data: {
            'info.section.join': cmd.pull(sectionId)
          }
        })
      })
    })
    await _db.collection('section').doc(sectionId).get().then(res => {
      wx.cloud.deleteFile({
        fileList: res.data.images
      })
    })
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

  /**
   * 通过社团ID获取社团
   * @param {string} sectionId 
   */
  async getSectionById(sectionId) {
    return await _db.collection('section').doc(sectionId).get().then(res => res.data)
  }
}