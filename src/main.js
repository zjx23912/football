import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios';

createApp(App).mount('#app')

axios.defaults.baseURL = 'http://localhost:8080'; // 替换为你的本地后端 API URL 和端口号

app.config.globalProperties.$axios = axios;

app.mount('#app');
