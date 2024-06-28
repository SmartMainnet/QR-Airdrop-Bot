import { WalletsModel } from '../models/index.js'

export const addWalletAddress = async (user_id: number, address: string) => {
  return await WalletsModel.create({ user_id, address })
}

export const getWalletAddress = async (user_id: number) => {
  return await WalletsModel.findOne({ user_id })
}

export const deleteWalletAddress = async (user_id: number) => {
  return await WalletsModel.deleteOne({ user_id })
}
