import { User } from './user'
import { School } from './school'
import { Campus } from './campus'

export class DataBase {
  user = new User()
  school = new School()
  campus =  new Campus()
}

export const db = new DataBase()