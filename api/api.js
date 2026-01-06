const http = uni.$u.http

//获取系统名称
export const getPlatformName = (data = {}) => http.get('/platformConfig/getPlatform/name', {data})
// post请求，登录系统
export const mLogin = (params, config = {}) => http.post('/user/login', params, config)
	
	/*** 退出 */
export const mLogout = (params, config = {}) => http.post('/user/logout', params, config)

//获取验证码图片
export const getRandomImage = (data = {}) => http.get('/user/randomImage', {data})
//获取用户信息
export const getUserSession = (data = {}) => http.get('/user/getUserSession', {data})
//统计采购、销售、零售的总金额
export const getPurchaseStatics = (data = {}) => http.get('/depotItem/buyOrSalePrice', {data})
//统计今日采购额、昨日采购额、本月采购额、今年采购额|销售额|零售额
export const getBuyAndSaleStatistics = (data = {}) => http.get('/depotHead/getBuyAndSaleStatistics', {data})

//根据父编号查询菜单
export const findMenuByPNumber = (params, config = {}) => http.post('/function/findMenuByPNumber', params, config)
