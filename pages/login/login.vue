<template>
	<view class="container">
		<u-toast ref="uToast"></u-toast>
		<view class="image-container">
			<u--image :showLoading="true" duration="450" :src="src" shape="circle" width="200rpx"
				height="200rpx"></u--image>
			<text class="platformTitle" text="">{{platformName}}</text>
		</view>
		<u--form ref="uForm">
			<u-row style="flex-direction: column;">
				<u-col span="12">
					<u-form-item prop="userInfo.loginname" ref="item1"></u-form-item>
						<u--input class="ipt" :border="border" prefixIcon="account"
							prefixIconStyle="font-size: 22px;color: #909399" fontSize="34rpx" placeholder="请输入账号"
							v-model="loginName" clearable @click="showToast(item)"></u--input>

				</u-col>
				<u-col span="12">
					<u-form-item prop="userInfo.loginpwd" ref="item1"></u-form-item>
						<u--input class="ipt" :border="border" prefixIcon="lock"
							prefixIconStyle="font-size: 22px;color: #909399" fontSize="34rpx" placeholder="请输入密码"
							v-model="password" clearable password></u--input>

				</u-col>
			</u-row>
			<u-row justify="start" style="margin-top: 48rpx;">
				<u-col span="8">
					<view>
						<u--input :border="border" prefixIcon="fingerprint"
							prefixIconStyle="font-size: 22px;color: #909399" maxlength="4" fontSize="34rpx"
							placeholder="请输入验证码" v-model="code" clearable></u--input>
						<text v-model="uuid"></text>
					</view>
				</u-col>
				<u-col span="4" style="margin-left: 20rpx;">
					<view>
						<image class="randomImage" :src="base64Data" @click="onRandomImage" />
					</view>
				</u-col>
			</u-row>
			<u-row justify="space-between" style="margin-left: 20rpx;margin-top:48rpx;">
				<u-col span="8">
					<u-checkbox-group>
						<u-checkbox labelSize="28rpx" iconSize="40rpx" activeColor="blue" name="chkRemember"
							label="记住用户名"></u-checkbox>
					</u-checkbox-group></u-col>
				<u-col span="4">
					<u--text type="primary" size="28rpx" text="忘记密码"></u--text>
				</u-col>
			</u-row>
		</u--form>
		<u-row>
			<u-col span="12" style="margin-top: 48rpx;">
				<view style="display: flex; justify-content: center; width: 100%;">
					<u-button text="登录" type="primary" loadingText="登录中" @tap="onLogin" size="large"
						style="width:600rpx; margin: 0;"></u-button>
				</view>
			</u-col>
		</u-row>
	</view>
</template>

<script>
	import md5 from 'md5';
	import {
		ACCESS_TOKEN,
		USER_NAME,
		USER_INFO
	} from "@/common/util/constants";
	import {
		getRandomImage,
		getPlatformName,
		mLogin,
		findMenuByPNumber
	} from '@/api/api.js';
	import {
		warn
	} from "vue";
	import {
		mapActions
	} from 'vuex';

	export default {
		data() {
			return {
				border: 'surround',
				base64Data: '', // 存储base64验证码图片数据
				uuid: '', // 存储验证码唯一标识
				code: '',
				src: "https://linghanshop.cn/uploads/attach/2025/11/20251128/c9840ae740abc19c00b3bda853b1abe8.png",
				loginName: 'jsh',
				password: '123456',
				platformName: '',
				/**
				 * 表单校验相关
				 * */
				errorType: 'toast',
			}
		},
		onLoad() {
			this.loadInfo();
			this.onPlatformName();
			this.onRandomImage();
		},
		methods: {
			...mapActions(['mLogin']), // 映射store的action
			showToast(params) {
				this.$refs.uToast.show({
					...params,
					complete() {
						params.url && uni.navigateTo({
							url: params.url,
						});
					},
				});
			},
			//获取密码加密规则
			getEncrypte() {
				var encryptedString = Vue.ls.get(ENCRYPTED_STRING);
				if (encryptedString == null) {
					getEncryptedString().then((data) => {
						this.encryptedString = data
					});
				} else {
					this.encryptedString = encryptedString;
				}
			},
			onPlatformName() {
				getPlatformName().then((response) => {
					this.platformName = response;
				}).catch(() => {})
			},
			//获取图形验证码
			onRandomImage() {
				getRandomImage().then((response) => {
					this.base64Data = response.data.base64;
					this.uuid = response.data.uuid;
				}).catch(() => {})
			},
			//获取缓存用户密码
			loadInfo() {
				let userInfo = uni.getStorageSync(USER_INFO);
			},
			//获取用户权限列表
			getPermissionList() {
				let userInfo = uni.getStorageSync(USER_INFO);
				let params = {
					pNumber: 0,
					userId: userInfo.id
				};
				findMenuByPNumber(params).then((res) => {
					const menuData = res;
					uni.setStorageSync('permissionList', menuData);
				})
			},
			// 登录方法
			onLogin: function() {
				if (!this.loginName || this.loginName.length == 0) {
					this.$refs.uToast.show({
						type: 'error',
						message: '请输入账号'
					})
					return;
				}
				if (!this.password || this.password.length == 0) {
					this.$refs.uToast.show({
						type: 'error',
						message: '请输入密码'
					})
					return;
				}
				if (!this.code || this.code.length == 0) {
					this.$refs.uToast.show({
						type: 'error',
						message: '请输入验证码'
					})
					return;
				}
				let loginParams = {
					loginName: this.loginName,
					password: md5(this.password),
					code: this.code,
					uuid: this.uuid
				}
				// if (1=="1") {
				// 	//勾选的时候进行缓存
				// 	uni.setStorageSync('cache_loginName', loginName);
				// 	uni.setStorageSync('cache_password', password);
				// } else {
				// 	//没勾选的时候清缓存
				// 	uni.removeStorageSync(cache_loginName);
				// 	uni.removeStorageSync(cache_password)
				// }
				this.loading = true;

				// 优先尝试使用store，如果不可用则直接调用API
				const doLogin = (params) => {
					if (this.$store && this.$store.dispatch) {
						return this.$store.dispatch('mLogin', params)
					} else {
						// 备用方案：直接调用API
						return mLogin(params)
					}
				};
				doLogin(loginParams).then((res) => {
					this.loading = false;
					//console.log('登录响应:', res)
					this.departConfirm(res, this.loginName)
				}).catch((error) => {
					this.loading = false;
					this.$refs.uToast.show({
						type: 'error',
						message: error.message
					})
				}).finally(() => {
					this.loading = false;
					this.onRandomImage();
					this.code = '';
				})
			},
			departConfirm(res, loginName) {
				if (res.data.msgTip) {
					let err = {};
					if (res.data.msgTip == 'user can login') {
						this.getPermissionList()
						uni.switchTab({
							url: '/pages/index/index'
						});
						setTimeout(() => {
							this.$refs.uToast.show({
								type: 'success',
								message: "登录成功",
								duration: 1500,
								iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/success.png'
							})
						}, 500);
					} else if (res.data.msgTip == 'user is not exist') {
						this.$refs.uToast.show({
							type: 'error',
							message: '用户不存在'
						})
					} else if (res.data.msgTip == 'user password error') {
						this.$refs.uToast.show({
							type: 'error',
							message: '用户密码不正确'
						})
					} else if (res.data.msgTip == 'user is black') {
						this.$refs.uToast.show({
							type: 'error',
							message: '用户被禁用'
						})
					} else if (res.data.msgTip == 'tenant is black') {
						if (loginName === 'jsh') {
							err.message = 'jsh用户已停用，请注册租户进行体验！';
						} else {
							err.message = '用户所属的租户被禁用';
						}
						uni.$u.toast(err.message);
					} else if (res.data.msgTip == 'access service error') {
						this.$refs.uToast.show({
							type: 'error',
							message: '查询服务异常'
						})
					}
				} else if (res.data.message == "验证码已失效") {
					this.$refs.uToast.show({
						type: 'error',
						message: res.data.message
					})
				} else if (res.data.message == "验证码错误") {
					this.$refs.uToast.show({
						type: 'error',
						message: res.data.message
					})
				} else {
					uni.$u.toast('登录响应异常');
				}
				this.code = '';
			},
		}
	};
</script>
<style lang="scss" scoped>
	.ipt {
		width: 600rpx;
		margin-top: 48rpx;
	}

	.container {
		width: 680rpx;
		margin: 80rpx auto 0;
		padding: 60rpx 40rpx;
		background: #f8f8f8;
	}

	.image-container {
		margin-top: 100rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		background-color: #f8f8f8;
	}

	.platformTitle {
		margin-top: 10rpx;
		font-size: 35px;
		color: #666;
		font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
		font-weight: 700;
	}

	.randomImage {
		width: 170rpx;
		height: 60rpx;
		background: #94afce;
	}

	/* 点击反馈（移动端必备） */
	.randomImage:active {
		opacity: 0.8;
		background: #7b9bc0;
		/* 点击加深背景色 */
	}
</style>