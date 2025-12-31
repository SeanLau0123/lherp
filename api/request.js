module.exports = (vm) => {
	// 常量定义
	const ACCESS_TOKEN = 'ACCESS_TOKEN';

	const getTokenStorage = () => {
		let token = ''
		try {
			token = uni.getStorageSync(ACCESS_TOKEN)
		} catch (e) {
			console.log("getTokenStorage error:", e)
		}
		return token
	}

	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
		config.baseURL = 'https://erp.linghanshop.cn/jshERP-boot' // 生产环境
		return config
	})

	// 请求拦截器
	uni.$u.http.interceptors.request.use((config) => {
		// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
		config.data = config.data || {}

		// 添加token到请求头
		const token = getTokenStorage()
		if (token) {
			config.header = {
				...config.header,
				'X-Access-Token': token
			}
		}

		// 根据custom参数中配置的是否需要token，添加对应的请求头
		if (config?.custom?.auth) {
			// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
			config.header.token = vm.$store?.state?.userInfo?.token || ''
		}
		return config
	}, config => {
		return Promise.reject(config)
	})

	// 响应拦截器
	uni.$u.http.interceptors.response.use((response) => {
		const data = response.data
		const custom = response.config?.custom
		return data.data === undefined ? {} : data.data
	}, (response) => {
		console.error('请求响应错误:', response)
		if (response) {
			let data = response.data
			if (!data) {
				let timeout = setTimeout(tip.alert('登录已过期'), 1000);
				store.dispatch('Logout').then(() => {
					clearTimeout(timeout)
					window.location.reload()
				})
			} else {
				const token = uni.getStorageSync(ACCESS_TOKEN)
				console.log("------异常响应------", token)
				console.log("------异常响应------", data.status)
				switch (data.status) {
					case 403:
						tip.error('拒绝访问');
						break
					case 500:
						if (!token || data.message == "Token失效，请重新登录") {
							let timeout = setTimeout(tip.alert('登录已过期'), 1000);
							store.dispatch('Logout').then(() => {
								clearTimeout(timeout)
								window.location.reload()
							})
						}
						break
					case 404:
						break
					case 504:
						break
					case 401:
						if (token) {
							store.dispatch('Logout').then(() => {
								setTimeout(() => {
									window.location.reload()
								}, 1500)
							})
						}
						break
					default:
						tip.error({
							duration: 0,
							forbidClick: true,
							message: data.message
						});
						break
				}
			}
		}
		return Promise.reject(response)
	})
}