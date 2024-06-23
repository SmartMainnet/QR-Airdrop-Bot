import mongoose from 'mongoose'

const { Schema } = mongoose

const Referrals = new Schema(
  {
    referrer_user_id: {
      type: Number,
      required: true,
    }, // 1530690410
    referral_user_id: {
      type: Number,
      required: true,
    }, // 5198612063
    complied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

Referrals.index({ referrer_user_id: 1 })
Referrals.index({ referral_user_id: 1 }, { unique: true })

export const ReferralsModel = mongoose.model('Referrals', Referrals)
