import mongoose from 'mongoose'

import { getNextSequence } from '../utils/index.js'

const { Schema } = mongoose

const Users = new Schema(
  {
    id: Number, // 1

    user_id: {
      type: Number,
      required: true,
    }, // 1530690410

    username: String, // 'SmartMainnet'
    first_name: String, // 'Smart'
    last_name: String, // 'Mainnet'
    language_code: String, // 'ru'

    is_bot: Boolean, // false
    is_premium: Boolean, // true
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

Users.index({ id: 1, user_id: 1 }, { unique: true })

Users.pre('save', async function (next) {
  if (this.isNew) {
    this.id = await getNextSequence('users')
  }
  next()
})

export const UsersModel = mongoose.model('Users', Users)
