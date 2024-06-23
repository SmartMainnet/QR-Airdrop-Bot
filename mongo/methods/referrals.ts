import { ReferralsModel } from '../models/Referrals.js'

export const newReferral = async (
  referrer_user_id: number,
  referral_user_id: number
) => {
  const referral = await ReferralsModel.findOne({ referral_user_id })

  if (!referral) {
    return await ReferralsModel.create({ referrer_user_id, referral_user_id })
  }
}

export const setReferralComplied = async (referral_user_id: number) => {
  const document = await ReferralsModel.findOneAndUpdate(
    { referral_user_id },
    {
      $set: { complied: true },
    }
  )

  if (!document) {
    throw new Error('Referral not found')
  }

  return document
}

export const getReferralsByReferrerUserId = async (referrer_user_id: number) => {
  return await ReferralsModel.find({ referrer_user_id })
}

export const getDocumentByReferralUserId = async (referral_user_id: number) => {
  return await ReferralsModel.findOne({ referral_user_id })
}
