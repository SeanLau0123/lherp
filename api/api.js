const http = uni.$u.http

// post请求，登录系统
export const mLogin = (params, config = {}) => http.post('/user/login', params, config)
	
	/*** 退出 */
export const mLogout = (params, config = {}) => http.post('/user/logout', params, config)

//获取验证码图片
export const getRandomImage = (data = {}) => http.get('/user/randomImage', {
    data,
    custom: {
        auth: false, // 验证码接口不需要token
        toast: false, // 不自动显示错误提示
        catch: true // 启用catch模式
    }
})
//获取用户信息
export const getUserSession = (data = {}) => http.get('/user/getUserSession', {data,
    custom: {
        auth: false, // 验证码接口不需要token
        toast: false, // 不自动显示错误提示
        catch: true // 启用catch模式
    }
})