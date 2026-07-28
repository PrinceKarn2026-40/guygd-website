import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://guygd-website-production.up.railway.app/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('guygd_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
