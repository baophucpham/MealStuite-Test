import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(
      'REQUEST',
      config.baseURL,
      config.url,
      config.data || '',
      config.params || ''
    );

    return config;
  },
  function (error: AxiosError) {
    return Promise.reject(error);
  }
);
// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    console.log(response.data, 'RESPONSE API');
    return response.data;
  },
  function (error: AxiosError) {
    console.error(
      JSON.stringify(error.response?.data, null, 2),
      error.response?.config.url,
      error,
      'ERROR RESPONSE'
    );

    return Promise.reject(error.response?.data);
  }
);
export default axiosClient;
