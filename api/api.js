import { http } from 'uview-pro'

// http.setConfig({
//   baseUrl: 'https://erp.linghanshop.cn/jshERP-boot',
//   meta: {
//     toast: true, // 全局开启错误toast，默认为false关闭
//     loading: true, // 全局开启loading，默认为false关闭
//     originalData: true // 是否在拦截器中返回服务端的原始数据，默认为true返回的是原始数据
//   }
// })
/**
*获取系统名称
*/
export const getPlatformName = (data = {}) => http.get('/platformConfig/getPlatform/name', {data})
// post请求，登录系统
export const mLogin = (params, config = {}) => http.post('/user/login', params, config)
	
	/*** 退出 */
export const mLogout = (params, config = {}) => http.post('/user/logout', params, config)

/**
 * 获取验证码图片
 */
export const getRandomImage = (data = {}) => http.get('/user/randomImage', {data})
//获取用户信息
export const getUserSession = (data = {}) => http.get('/user/getUserSession', {data})
/**
 * 统计采购、销售、零售的总金额
 */
export const getPurchaseStatics = (data = {}) => http.get('/depotItem/buyOrSalePrice', {data})
/**
 * 统计今日采购额、昨日采购额、本月采购额、今年采购额|销售额|零售额
 */
export const getBuyAndSaleStatistics = (data = {}) => http.get('/depotHead/getBuyAndSaleStatistics', {data})

//根据父编号查询菜单
export const findMenuByPNumber = (params, config = {}) => http.post('/function/findMenuByPNumber', params, config)


/**
 *基础资料
 */
//获取商品信息
export const getMaterialList = (params, config = {}) => http.get('/material/list', params, config)
