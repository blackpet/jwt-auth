import {authFetch} from './auth-fetch';
import {API_RESOURCE} from '$env/static/private'

authFetch.setBaseOptions({
  baseURL: API_RESOURCE
})
console.log('init-fetch API_RESOURCE', API_RESOURCE)
