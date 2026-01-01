<template>
	<view>
		<view class="image-container">
			<u--image :showLoading="true" duration="450" :src="src" width="200rpx" height="200rpx"></u--image>
		</view>
		<view>
			<u--text type="primary" size="28" align="center" text="玲涵商贸ERP"></u--text>
		</view>
		<u-row style="flex-direction: column;">
			<u-col span="12" style="margin-top: 10rpx;">
				<u--input class="ipt" prefixIcon="account" placeholder="请输入账号" border="surround" v-model="loginName"
					clearable></u--input>
			</u-col>
			<u-col span="12" style="margin-top: 10rpx;">
				<u--input class="ipt" prefixIcon="lock" placeholder="请输入密码" border="surround" v-model="password"
					clearable password></u--input>
			</u-col>
			<u-col span="12" style="margin-top: 10rpx;">
				<view>
					<u--input class="ipt" prefixIcon="fingerprint" maxlength="4" placeholder="请输入验证码" border="surround"
						v-model="code" clearable>
						<template slot="suffix">
							<image class="randomImage" style="margin-top: 2px;" :src="base64Data"
								@click="onRandomImage" />
						</template>
					</u--input>
					<text v-model="uuid"></text>
				</view>
			</u-col>
			<u-col span="12" style="margin-top: 20rpx;">
				<view style="display: flex; justify-content: center; width: 100%;">
					<u-button text="登录" type="primary" loadingText="登录中" @click="onLogin"
					style="width:500rpx; margin: 0;"></u-button>
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
		mLogin
	} from '@/api/api.js';
	import {
		warn
	} from "vue";

	export default {
		data() {
			return {
				base64Data: '', // 存储base64验证码图片数据
				uuid: '', // 存储验证码唯一标识
				code: '',
				src: "https://linghanshop.cn/uploads/attach/2025/11/20251128/c9840ae740abc19c00b3bda853b1abe8.png",
				loginName: 'jsh',
				password: '123456'
			}
		},
		onLoad() {
			this.onRandomImage();
		},
		methods: {
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
			//获取图形验证码
			onRandomImage() {
				getRandomImage().then((response) => {
					this.base64Data = response.base64;
					this.uuid = response.uuid;
				}).catch(() => {})
			},
			//获取用户权限列表
			getPermissionList() {
				let userInfo = uni.getStorageSync(USER_INFO);
				let params = {
					pNumber: 0,
					userId: userInfo.id
				};
				this.$http.post("/function/findMenuByPNumber", params).then(res => {
					const menuData = res.data;
					uni.setStorageSync('permissionList', menuData);
				})
			},
			// 登录方法
			onLogin: function() {
				if (!this.loginName || this.loginName.length == 0) {
					uni.$u.toast('请填写账号');
					return;
				}
				if (!this.password || this.password.length == 0) {
					uni.$u.toast('请填写密码');
					return;
				}
				if (!this.code || this.code.length == 0) {
					uni.$u.toast('请填写验证码');
					return;
				}
				let loginParams = {
					loginName: this.loginName,
					password: md5(this.password),
					code: this.code,
					uuid: this.uuid
				}
				this.loading = true;
				mLogin(loginParams).then((res) => {
					this.loading = false;
					this.departConfirm(res, this.loginName)
				}).catch((res) => {
					let msg = res.data || "请求出现错误，请稍后再试"
					this.loading = false;
					uni.$u.toast(msg);
				}).finally(() => {
					this.loading = false;
				})
			},
			departConfirm(res, loginName) {
				if (res.message != "") {
					let err = {};
					if (res.msgTip == 'user can login') {
						//this.getPermissionList()
						uni.$u.toast('登录成功!')
						uni.$u.route('/pages/index/index');
					} else if (res.msgTip == 'user is not exist') {
						err.message = '用户不存在';
						uni.$u.toast(err.message);
					} else if (res.msgTip == 'user password error') {
						err.message = '用户密码不正确';
						uni.$u.toast(err.message, warn);
					} else if (res.msgTip == 'user is black') {
						err.message = '用户被禁用';
						uni.$u.toast(err.message);
					} else if (res.msgTip == 'tenant is black') {
						if (loginName === 'jsh') {
							err.message = 'jsh用户已停用，请注册租户进行体验！';
						} else {
							err.message = '用户所属的租户被禁用';
						}
						uni.$u.toast(err.message);
					} else if (res.msgTip == 'tenant is expire') {
						err.message = '试用期已结束，请联系客服续费';
						uni.$u.toast(err.message);
					} else if (res.msgTip == 'access service error') {
						err.message = '查询服务异常';
						uni.$u.toast(err.message);
					} else if (res.message == "验证码已失效") {
						err.message = '验证码已失效,请点击刷新';
						uni.$u.toast(err.message);
					} else if (res.message == "验证码错误") {
						err.message = '验证码错误，请重新输入';
						uni.$u.toast(err.message);
					}
				} else {
					this.loading = false;
					uni.$u.toast(msg);
				}
				this.onRandomImage()
				this.code = '';
			},
		}
	};
</script>
<style lang="scss" scoped>
	.ipt {
		width: 500rpx;
		margin-top: 20rpx;
		margin-left: 100rpx;
	}

	.image-container {
		margin-top: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	.randomImage {
		width: 85px;
		height: 30px;
		background: #94afce;
	}
</style>