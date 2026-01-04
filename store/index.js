import Vue from 'vue'
import Vuex from 'vuex'
import {mLogin,logout} from "@/api/api"
import MinCache from '@/common/util/MinCache.js'
import {
	ACCESS_TOKEN,
	USER_NAME,
	USER_INFO
} from "@/common/util/constants"

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: '',
		userid: '',
		username:'',
		user: {}
	},
	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token
		},
		SET_NAME: (state, {
			username
		}) => {
			state.username = username
		},
	},
	actions: {
		// 登录
		mLogin({
			commit
		}, userInfo) {
			return new Promise((resolve, reject) => {
				mLogin(userInfo).then(response => {
					if (response.code == 200 && response.data.msgTip ==
						'user can login') {
						const result = response.data
						const userInfo = result.user
						uni.setStorageSync(ACCESS_TOKEN, result.token);
						uni.setStorageSync(USER_INFO, userInfo);
						commit('SET_TOKEN', result.token)
						//commit('SET_AVATAR', userInfo.username)
						commit('SET_NAME', {
							username: userInfo.loginName
							//realname: userInfo.username
						})
						uni.setStorageSync('winBtnStrList', result.userBtn);
						uni.setStorageSync('roleType', result.roleType);
						resolve(response)
					} else {
						resolve(response)
					}
				}).catch(error => {
					console.log("Store登录错误:", error)
					reject(error)
				})
			})
		},
		// 登出
		mLogout({
			commit,
			state
		}) {
			return new Promise((resolve) => {
				let logoutToken = state.token;
				commit('SET_TOKEN', '')
				uni.removeStorageSync(ACCESS_TOKEN)
				uni.removeStorageSync("permissionList")
				logout(logoutToken).then(() => {
					resolve()
				}).catch(() => {
					resolve()
				})
			})
		},
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
})

export default store