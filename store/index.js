import {createStore} from 'vuex'
import {mLogin,	mLogout} from "@/api/api"
import {ACCESS_TOKEN,USER_ACCOUNT,USER_INFO} from "@/common/util/constants"

// 定义用户模块
const userModule = {
	// 开启命名空间（避免模块间命名冲突，必加！）
	namespaced: true,
	// 状态
	state: {
		token: '',
		userid: '',
		username: '',
		password: '',
		user: {}
	},
	// 同步修改状态
	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token
		},
		SET_NAME: (state, {username,password}) => {
			state.username = username
			state.password= password
		},
		SET_USER_INFO: (state, user) => {
			state.user = user
			state.userid = user.id || ''
			state.realname = user.realname || ''
		},
		CLEAR_USER_STATE: (state) => {
			state.token = ''
			state.userid = ''
			state.username = ''
			state.password = ''
			state.user = {}
		}
	},
	actions: {
		// 登录
		mLogin({
			commit
		}, userInfo) {
			return new Promise((resolve, reject) => {
				mLogin(userInfo).then(response => {
					if (response.code == 200 && response.data.msgTip == 'user can login') {
						const result = response.data
						const userInfo = result.user
						// 存储到本地
						uni.setStorageSync(ACCESS_TOKEN, result.token);
						uni.setStorageSync(USER_INFO, userInfo);
						uni.setStorageSync('winBtnStrList', result.userBtn);
						uni.setStorageSync('roleType', result.roleType);

						commit('SET_TOKEN', result.token)
						commit('SET_USER_INFO', userInfo)
						//commit('SET_AVATAR', userInfo.username)
						resolve(response)
					} else {
						resolve(response)
					}
				}).catch(error => {
					console.log("登录请求错误:", error)
					reject(error)
				})
			})
		},
		// 登出
		mLogout({commit,state}) {
			return new Promise((resolve) => {
				let logoutToken = state.token;
				commit('SET_TOKEN', '')

				uni.removeStorageSync(ACCESS_TOKEN)
				uni.removeStorageSync(USER_INFO)
				uni.removeStorageSync("permissionList")
				uni.removeStorageSync(USER_ACCOUNT)
				mLogout(logoutToken).then(() => {
					resolve()
				}).catch(() => {
					resolve()
				})
			})
		},
		// 新增：初始化用户信息（页面刷新后恢复状态）
		initUserInfo({
			commit
		}) {
			const token = uni.getStorageSync(ACCESS_TOKEN)
			const user = uni.getStorageSync(USER_INFO) || {}
			if (token) {
				commit('SET_TOKEN', token)
				commit('SET_NAME', {
					username: user.loginName || ''
				})
				commit('SET_USER_INFO', user)
			}
		}
	},
	getters: {
		token: state => state.token,
		username: state => {
			state.username = uni.getStorageSync(USER_INFO).username;
			return state.username
		},
		nickname: state => {
			state.realname = uni.getStorageSync(USER_INFO).realname;
			return state.user.realname
		},
		userid: state => {
			state.userid = uni.getStorageSync(USER_INFO).id;
			return state.userid
		}
	}
}
const store  = createStore({
	modules: {
		userModule
	}
})
export const userStore = store

export default store
