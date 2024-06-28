import axios from 'axios'
import { config } from '#root/config.js'

const { TONAPI_URL, TONAPI_KEY } = config

export const tonapi = axios.create({
  baseURL: TONAPI_URL,
  headers: { Authorization: `Bearer ${TONAPI_KEY}` },
})
