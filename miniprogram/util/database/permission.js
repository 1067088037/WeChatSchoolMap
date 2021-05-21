const _db = wx.cloud.database()
const cmd = _db.command

export class Permission {
  permissionList = []
  permissionVersion = 0

  constructor() {
    this.refreshPermissionList()
  }

  /**
   * 获取全局权限，仅限管理员和全局管理员，不包含学校校区和部门管理员
   * 该函数没有对应的设置函数，因为全局权限仅能从后台设置
   * @param {string} openid 
   */
  async getGlobalPermission(openid) {
    return await _db.collection('user').doc(openid).get().then(res => res.data.info.permission)
  }

  /**
   * 权限等级到名称的转换
   * @param {number} level 
   */
  levelToName(level) {
    let res = null
    this.permissionList.forEach(e => {
      if (level == e.level) res = e.name
    })
    return res
  }

  /**
   * 权限名称到等级的转换
   * @param {string} name 
   */
  nameToLevel(name) {
    let res = null
    this.permissionList.forEach(e => {
      if (name == e.name) res = e.level
    })
    return res
  }

  /**
   * 自动转换权限变量类型
   * @param {any} left 等式左侧的
   * @param {any} right 等式右侧的
   */
  autoConvert(left, right) {
    if (typeof left == 'string') left = this.nameToLevel(left)
    if (typeof right == 'string') right = this.nameToLevel(right)
    if (!this.checkValidity(left)) console.error('传入的权限参数非法')
    if (!this.checkValidity(right)) console.error('传入的权限参数非法')
    return {
      left: left,
      right: right
    }
  }

  /**
   * 检查权限合法性
   * @param {number} level 
   */
  checkValidity(level) {
    let validity = false
    this.permissionList.forEach(e => {
      if (e.level == level) validity = true
    })
    return validity
  }

  /**
   * 左边是否大于右边
   */
  isGreaterThan(left, right) {
    let level = this.autoConvert(left, right)
    return (level.left > level.right)
  }

  isLessThanOrEquals(left, right) {
    return !this.isGreaterThan(left, right)
  }

  /**
   * 左边是否小于右边
   */
  isLessThan(left, right) {
    let level = this.autoConvert(left, right)
    return (level.left < level.right)
  }

  isGreaterThanOrEquals(left, right) {
    return !this.isLessThan(left, right)
  }

  /**
   * 左边是否等于右边
   */
  isEquals(left, right) {
    let level = this.autoConvert(left, right)
    return (level.left == level.right)
  }

  isNotEquals(left, right) {
    return !this.isEquals(left, right)
  }

  /**
   * 刷新权限列表
   */
  async refreshPermissionList() {
    await _db.collection('static').doc('permission').get().then(res => {
      this.permissionList = res.data.permission
      this.permissionVersion = res.data.version
      // console.log(this.permissionList)
    })
  }
}