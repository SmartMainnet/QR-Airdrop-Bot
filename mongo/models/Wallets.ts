import mongoose from 'mongoose'

const { Schema } = mongoose

const Wallets = new Schema(
  {
    user_id: {
      type: Number,
      required: true,
    }, // 1530690410
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

Wallets.index({ user_id: 1 }, { unique: true })
Wallets.index({ address: 1 })

export const WalletsModel = mongoose.model('Wallets', Wallets)
