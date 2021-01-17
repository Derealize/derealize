import { Action, action, Thunk, thunk } from 'easy-peasy'
import ky from 'ky'
import dayjs from 'dayjs'

const IpapiWarn =
  "Failed to get your region info, which can help us use the cache closer to you. Maybe it's because your ad block plugin blocked the ipapi.co domain"

export interface RegionData {
  ip: string
  country_code: string
  country_name?: string
  city?: string
  region_code?: string
  country?: string
  latitude?: string
  longitude?: string
  utc_offset?: string
}

export interface StorageModel {
  region: RegionData
  setRegion: Action<StorageModel, RegionData>
  judgeRegion: Thunk<StorageModel>

  ousideFirewall: boolean
  setOusideFirewall: Action<StorageModel, boolean>
  judgeOusideFirewall: Thunk<StorageModel>
}

const storageModel: StorageModel = {
  region: { ip: '', city: '', country_code: '' },
  setRegion: action((state, payload) => {
    state.region = payload
    localStorage.setItem('regionData', JSON.stringify({ value: payload, time: dayjs().toJSON() }))
  }),
  judgeRegion: thunk(async (actions) => {
    const region = localStorage.getItem('regionData')
    if (region) {
      const { value, time } = JSON.parse(region)
      if (time && dayjs(time).add(1, 'day').isAfter(dayjs())) {
        actions.setRegion(value || {})
        return
      }
    }

    try {
      const result = await ky.get('https://www.cloudflare.com/cdn-cgi/trace').text()
      const resultLines = result.split(/\r?\n/)

      const locline = resultLines.find((l) => l.startsWith('loc'))
      if (!locline) throw new Error('locline null')
      const ipline = resultLines.find((l) => l.startsWith('ip'))
      if (!ipline) throw new Error('ipline null')

      actions.setRegion({
        ip: ipline?.split('=')[1],
        country_code: locline?.split('=')[1],
      })
    } catch (err) {
      console.warn(err)
      try {
        const result = await ky.get('https://freegeoip.app/json').json<RegionData>()
        actions.setRegion(result)
      } catch (err2) {
        console.error(err2)
      }
    }
  }),

  ousideFirewall: localStorage.getItem('ousideFirewall') !== 'false',
  setOusideFirewall: action((state, payload) => {
    state.ousideFirewall = payload
    localStorage.setItem('ousideFirewall', payload.toString())
  }),
  judgeOusideFirewall: thunk(async (actions) => {
    try {
      await ky('//ajax.googleapis.com/ajax/libs/scriptaculous/1.9.0/scriptaculous.js', {
        timeout: 4000,
      })
      actions.setOusideFirewall(true)
    } catch (err) {
      actions.setOusideFirewall(false)
    }
  }),
}

export default storageModel
