import { Service } from '../utils/http'
export function playlist (params) {
  //   localhost:3000/playlist/track/all?id=24381616&limit=100&offset=2
  return Service({
    url: '/playlist/track/all',
    method: 'get',
    params
  })
}
