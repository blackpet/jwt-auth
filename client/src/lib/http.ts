import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'
axios.defaults.headers.patch['Content-Type'] = 'application/json'
axios.defaults.headers.delete['Content-Type'] = 'application/json'

export default axios

const api = axios.create({
  baseURL: import.meta.env.VITE_API_RESOURCE,
  timeout: 10000, // 10s
})

export {
  api,
}
