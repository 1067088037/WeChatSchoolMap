const _db = wx.cloud.database()

import { User } from './user'
import { School } from './school'
import { Campus } from './campus'
import { Arch } from './arch'
import { Comment } from './comment'
import { Permission } from './permission'
import { Point } from './point'
import { Like } from './like'
import { Section } from './section'
import { Strategy } from './strategy'
import { Global } from './global'
import { Application } from './application'
import { Poster } from './poster'

export class DataBase {
  _db = _db //数据库实例
  Geo = _db.Geo //地理位置实例
  serverDate = _db.serverDate //服务器时间
  cmd = _db.command //操作指令
  global = new Global()
  user = new User()
  school = new School()
  campus =  new Campus()
  arch = new Arch()
  comment = new Comment()
  permission = new Permission()
  point = new Point()
  like = new Like()
  section = new Section()
  strategy = new Strategy()
  application = new Application()
  poster = new Poster()
}

export const db = new DataBase()