import {authFetch} from './auth-fetch';
import {API_RESOURCE} from '$env/static/private'
import {clientFetch} from './client-fetch';

authFetch.setBaseOptions({
  baseURL: API_RESOURCE
})
clientFetch.setBaseOptions({
  baseURL: import.meta.env.VITE_API_RESOURCE
})
console.log('init-fetch!', API_RESOURCE, import.meta.env.VITE_API_RESOURCE)
