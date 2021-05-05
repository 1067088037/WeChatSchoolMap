const _db = wx.cloud.database()

export class Point {
  /**
   * 新建标点
   * @param {string} campusId 
   * @param {Array} belong 
   * @param {Object} time 
   * @param {Object} desc 
   * @param {DB.IGeoJSONPoint} geo 
   */
  addPoint(campusId, belong, time, desc, geo) {
    if (belong.constructor != Array) {
      console.error('belong类型非法')
    } else if (time.constructor != Object) {
      console.error('time类型非法')
    } else if (desc.constructor != Object) {
      console.error('desc类型非法')
    } else if (geo.constructor != _db.Geo.Point(0, 0).constructor) {
      console.error("geo类型非法")
    } else {
      _db.collection('point').add({
        data: {
          super: {
            _id: campusId,
            type: 'campus'
          },
          belong: belong,
          time: time,
          desc: desc,
          geo: geo
        }
      })
    }
  }

  /**
   * 生成时间对象
   * @param {Date} show 标点开始展示的时间
   * @param {Date} start 活动开始的时间
   * @param {Date} end 活动结束的时间
   * @param {Date} hide 标点结束展示的时间
   */
  generateTimeObj(show, start, end, hide) {
    let dateConstructor = Date('2020-1-1').constructor
    if (show.constructor != dateConstructor) {
      console.error('show类型非法')
    } else if (start.constructor != dateConstructor) {
      console.error('start类型非法')
    } else if (end.constructor != dateConstructor) {
      console.error('end类型非法')
    } else if (hide.constructor != dateConstructor) {
      console.error('hide类型非法')
    } else {
      return {
        show: show,
        start: start,
        end: end,
        hide: hide
      }
    }
  }

  /**
   * 生成描述对象
   * @param {string} text 
   * @param {string} icon 
   * @param {Array} images 
   */
  generateDescObj(text, icon, images) {
    if (text.constructor != String) {
      console.error('text类型非法')
    } else if (icon.constructor != String) {
      console.error('icon类型非法')
    } else if (images.constructor != Array) {
      console.error('images类型非法')
    } else {
      return {
        text: text,
        icon: icon,
        images: images
      }
    }
  }
}