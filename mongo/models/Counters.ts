import mongoose from 'mongoose'

const { Schema } = mongoose

const Counters = new Schema(
  {
    _id: String, // 'users'
    seq: {
      type: Number,
      default: 0,
    }, // 15
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

export const CountersModel = mongoose.model('Counters', Counters)
