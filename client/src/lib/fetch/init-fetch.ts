import {authFetch} from './auth-fetch';
import {API_RESOURCE} from '$env/static/private'

const v2 = authFetch
v2.setBaseOptions({
  baseURL: API_RESOURCE
})
