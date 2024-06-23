import { User } from 'grammy/types'

import { UsersModel } from '../models/index.js'

export const createUser = async (user: User) => {
  const userFromDb = await UsersModel.findOne({ user_id: user.id })

  if (!userFromDb) {
    return await UsersModel.create({
      user_id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      language_code: user.language_code,
      is_bot: user.is_bot,
      is_premium: user.is_premium,
    })
  }

  return userFromDb
}

export const getUserByUserId = async (user_id: number) => {
  return await UsersModel.findOne({ user_id })
}
