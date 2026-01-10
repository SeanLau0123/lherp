import type { RequestConfig, RequestInterceptor, RequestMeta, RequestOptions } from 'uview-pro'
import { ACCESS_TOKEN } from '@/common/util/constants.js'

const baseUrl = 'https://erp.linghanshop.cn/jshERP-boot'

const getTokenStorage = () => {
	let token = ''
	try {
		token = uni.getStorageSync(ACCESS_TOKEN)
	} catch (e) {
		console.error("获取Token失败:", e) // 修正日志
	}
	return token
}

// 全局请求配置
export const httpRequestConfig: RequestConfig = {
	baseUrl,
	header: {
		'content-type': 'application/json'
	},
	meta: {
		originalData: true,
		toast: true,
		loading: true
	}
}

// 全局请求/响应拦截器
export const httpInterceptor: RequestInterceptor = {
	request: (config: RequestOptions) => {
		const meta: RequestMeta = config.meta || {}

		if (meta.loading) {
			uni.showLoading({ title: '加载中...', mask: true })
		}
		// 追加 Token 到请求头
		const token = getTokenStorage()
		if (token) {
			config.header = {
				...config.header,
				'X-Access-Token': token
			}
		}
		return config // 必须返回配置，否则请求会中断
	},
	response: (response: any) => {
		const meta: RequestMeta = response.config?.meta || {}
		if (meta.loading) {
			uni.hideLoading()
		}
		const code = response.data?.code
		if (code !== undefined && code !== 200 && code !== 0) {
			if (meta.toast) {
				uni.showToast({
					title: response.data?.msg || '请求失败',
					icon: 'none',
					duration: 2000
				})
			}
			return Promise.reject(response.data)
		}
		return response.data
	}
}