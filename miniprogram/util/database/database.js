const _db = wx.cloud.database()

import { User } from './user'
import { School } from './school'
import { Campus } from './campus'
import { Arch } from './arch'
import { Comment } from './comment'

export class DataBase {
  _db = _db //数据库实例
  Geo = _db.Geo //地理位置实例
  serverDate = _db.serverDate //服务器时间
  user = new User()
  school = new School()
  campus =  new Campus()
  arch = new Arch()
  comment = new Comment()
}

export const db = new DataBase()