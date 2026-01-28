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
export const getPlatformName = (data = {}) => http.get('/platformConfig/getPlatform/name', { data })
// post请求，登录系统
export const mLogin = (params, config = {}) => http.post('/user/login', params, config)

/*** 退出 */
export const mLogout = (params, config = {}) => http.post('/user/logout', params, config)

/**
 * 获取验证码图片
 */
export const getRandomImage = (data = {}) => http.get('/user/randomImage', { data })
//获取用户信息
export const getUserSession = (data = {}) => http.get('/user/getUserSession', { data })
//修改密码
export const updatePwd = (params, config = {}) => http.put('/user/updatePwd', params, config)
//统计采购、销售、零售的总金额
export const getPurchaseStatics = (data = {}) => http.get('/depotItem/buyOrSalePrice', { data })
//统计今日采购额、昨日采购额、本月采购额、今年采购额|销售额|零售额
export const getBuyAndSaleStatistics = (data = {}) => http.get('/depotHead/getBuyAndSaleStatistics', { data })
//根据父编号查询菜单
export const findMenuByPNumber = (params, config = {}) => http.post('/function/findMenuByPNumber', params, config)


/**
 *基础资料
 */
//获取商品信息
export const getMaterialList = (params, config = {}) => http.get('/material/list', params, config)

//获取商品类型
export const getMaterialCategory = (params, config = {}) => http.get('/materialCategory/getMaterialCategoryTree', params, config)
//根据ID获取商品类型
export const getMaterialCategoryById = (params, config = {}) => http.get('/materialCategory/findById', params, config)
//商品类型更新
export const updateCategory = (params, config = {}) => http.put('/materialCategory/update', params, config)
//商品类型删除
export const deleteCategory = (id, config = {}) => http.delete(`/materialCategory/deleteBatch?ids=${id}`, config)
//商品类型新增
export const addCategory = (params, config = {}) => http.post('/materialCategory/add', params, config)


//获取供应商，客户，会员信息
export const getPartnerlList = (params, config = {}) => http.get('/supplier/list', params, config)

//获取仓库信息
export const getWareHouselList = (params, config = {}) => http.get('/depot/list', params, config)
//获取收支面目列表
export const getInOutItem = (params, config = {}) => http.get('/inOutItem/list', params, config)
//获取结算账户列表
export const getAccounts = (params, config = {}) => http.get('/account/list', params, config)
//获取经手人列表
export const getHandler = (params, config = {}) => http.get('/person/list', params, config)
/*
*系统管理
*/
//获取操作日志
export const getLogs = (params, config = {}) => http.get('/log/list', params, config)
/**
 *报表中心
 */
//获取采购统计信息
export const getbuyInList = (params, config = {}) => http.get('/depotItem/buyIn', params, config)
//获取供应商对账信息
export const getsupplierAccountList = (params, config = {}) => http.get('/depotHead/getStatementAccount', params, config)

//获取账户信息余额
export const getAccountList = (params, config = {}) => http.get('/account/listWithBalance', params, config)

//获取结算账户信息余额的统计
export const getAccountListStatistics = (params, config = {}) => http.get('/account/getStatistics', params, config)

//获取入库明细,出库明细
export const getInOutDetail = (params, config = {}) => http.get('/depotHead/findInOutDetail', params, config)
/*
*采购入库详情
*/
//根据单号获取采购入库主表明细,销售出库详情
export const getInDetailById = (number, config = {}) => http.get(`/depotHead/getDetailByNumber?number=${number}`, config)
//根据单号获取付款单
export const getFinancialBillNoByBillId = (billId, config = {}) => http.get(`/accountHead/getFinancialBillNoByBillId?billId=${billId}`, config)

//获取采购入库单商品明细，销售出库单商品明细
export const getGoodsDetailByNumber = (params, config = {}) => http.get('depotItem/getDetailList', params, config)