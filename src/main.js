import axios from "axios";
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

const app = createApp(App)
app.config.globalProperties.$ajax = axios;
axios.defaults.baseURL = 'http://www.mydreamypaint.com';
app.use(router).use(ElementPlus)

app.mount('#app')
