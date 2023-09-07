import axios from 'axios';

export const baseURL = 'https://search-functionality-backend-chi.vercel.app';

const api = axios.create({
    baseURL: `${baseURL}`,
  });
  
export default api;