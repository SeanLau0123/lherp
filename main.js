import App from './App.vue'

// #ifndef VUE3
import Vue from 'vue'

// 条件导入store，确保在H5平台的兼容性
let store = null
try {
  store = require('@/store').default
} catch (e) {
  console.warn('Store初始化失败，使用默认配置:', e)
  store = null
}

import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

import uView from "uview-ui";
Vue.use(uView);
Vue.config.productionTip = false
App.mpType = 'app'

const appConfig = {
  ...App
}

// 只有在store有效时才注入
if (store) {
  appConfig.store = store
}

const app = new Vue(appConfig)

// 引入请求封装，将app参数传递到配置中
try {
  require('@/api/request.js')(app)
} catch (e) {
  console.warn('请求初始化失败:', e)
}

app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif