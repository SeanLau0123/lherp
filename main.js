import App from './App'

// #ifndef VUE3
import Vue from 'vue'


import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {createSSRApp} from 'vue'
import store from './store'
import themes from './src/uview-pro.theme'
import uViewPro from 'uview-pro'
import {
	httpPlugin
} from 'uview-pro/libs'
import {
	httpInterceptor,
	httpRequestConfig
} from './api/httprepuest'

export function createApp() {
	const app = createSSRApp(App)
  app.use(uViewPro, {
      theme: {
          themes: themes,
          defaultTheme: 'green', // 默认主题名称
          defaultDarkMode: 'light' // 默认暗黑模式：auto、light、dark
      }
  });
	app.use(httpPlugin, {
		interceptor: httpInterceptor,
		requestConfig: httpRequestConfig
	})
	app.use(store)
	return {
		app
	}
}
// #endif