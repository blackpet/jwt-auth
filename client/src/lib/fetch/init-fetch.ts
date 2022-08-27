import {serverFetch} from './server-fetch';
import {API_RESOURCE} from '$env/static/private'
import {clientFetch} from './client-fetch';

serverFetch.setBaseOptions({
  baseURL: API_RESOURCE
})
clientFetch.setBaseOptions({
  baseURL: API_RESOURCE || import.meta.env.VITE_API_RESOURCE
})
