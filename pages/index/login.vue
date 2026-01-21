<template>
	<view class="container">
		<u-toast ref="uToastRef" />
		<view class="image-container">
			<u-image :showLoading="true" duration="450" :src="src" shape="circle" width="200rpx"
				height="200rpx"></u-image>
			<text class="platformTitle">{{ platformName }}</text>
		</view>
		<u-row style="flex-direction: column;">
			<u-col span="12">
				<u-input class="ipt" :border="border" :border-color="borderColor" :clearable="clearable"
					fontSize="34rpx" placeholder="请输入账号" v-model="loginName"></u-input>
			</u-col>
			<u-col span="12">
				<u-input class="ipt" :border="border" :border-color="borderColor" :clearable="clearable" type="password"
					placeholder="请输入密码" v-model="password"></u-input>
			</u-col>
		</u-row>
		<u-row gutter=20 justify="start" style="margin-top: 48rpx;">
			<u-col span="8">
				<u-input style="height: 90rpx;" :border="border" :border-color="borderColor" :clearable="clearable"
					maxlength="4" fontSize="34rpx" placeholder="请输入验证码" v-model="code"></u-input>
			</u-col>
			<u-col span="4">
				<image class="randomImage" :src="base64Data" @click="onRandomImage" />
			</u-col></u-row>
		<u-row justify="space-between" style="margin-left: 20rpx;margin-top:48rpx;">
			<u-col span="8">
				<u-checkbox-group>
					<u-checkbox v-model="remChecked" size="28rpx">记住用户名</u-checkbox>
				</u-checkbox-group>
			</u-col>
			<u-col span="4">
				<u-text type="error" size="28rpx" text="忘记密码"></u-text>
			</u-col>
		</u-row>
		<u-row>
			<u-col span="12" style="margin-top: 48rpx;">
				<view style="display: flex; justify-content: center; width: 100%;">
					<u-button type="primary" @tap="onLogin" style="width:650rpx; margin: 0;">登录</u-button>
				</view>
			</u-col>
		</u-row>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted} from 'vue'
	import {
		ACCESS_TOKEN,
		USER_ACCOUNT,
		USER_INFO
	} from "@/common/util/constants";
	import { getPlatformName, getRandomImage, findMenuByPNumber, mLogin } from '@/api/api.js'
	import md5Libs from "uview-pro/libs/function/md5";
	import store from '@/store/index.js'
	import {$u } from 'uview-pro'
	
	const src = ref<string>("https://linghanshop.cn/uploads/attach/2025/11/20251128/c9840ae740abc19c00b3bda853b1abe8.png")
	const platformName = ref<string>("")
	const border = ref<boolean>(true)
	const remChecked = ref<boolean>(true)
	const borderColor = ref<string>("")
	const clearable = ref<boolean>(true)
	const base64Data = ref<string>("")
	const uuid = ref<string>("")
	const code = ref<string>("")
	const loginName = ref<string>("")
	const password = ref<string>("")
	const uToastRef = ref()
	const showToast = (title : string) => {
		uToastRef.value.show({
			type: 'error',
			title
		})
	}
	const showSuccessToast = (title : string) => {
		uToastRef.value.show({
			type: 'success',
			title
		})
	}

	const onPlatformName = async () => {
		const res = await getPlatformName()
		if (res) {
			platformName.value = res
		}
	}

	//获取密码加密规则	
	const md5Result = ref<string>('');
	//获取缓存用户密码
	const loadInfo = () => {
		let login_accout = uni.getStorageSync(USER_ACCOUNT);
		if (!login_accout) {
			return;
		} else {
			uni.switchTab({
				url: '/pages/index/index'
			});
			const accout = JSON.parse(login_accout);
			// loginName.value = accout.username
			// md5Result.value = password.value = accout.password
		}
	}

	//获取图形验证码
	const onRandomImage = async () => {
		const response = await getRandomImage()
		if (response) {
			base64Data.value = response.data?.base64 || ''
			uuid.value = response.data?.uuid || ''
		}
	}
	// 选中某个复选框时，由checkbox时触发
	const checkboxChange = (e : any) => {
		console.log(e);
	}
	//获取菜单列表
	const getPermissionList = async () => {
		let userInfo = uni.getStorageSync(USER_INFO);
		let params = {
			pNumber: 0,
			userId: userInfo.id
		};
		const res = await findMenuByPNumber(params);
		const menuData = res;
		uni.setStorageSync('permissionList', menuData);
	}
	//登录确认后操作
	const departConfirm = async (res, loginName) => {
		if (res.data.msgTip) {
			//let err = {};
			if (res.data.msgTip == 'user can login') {
				getPermissionList()
				uni.switchTab({
					url: '/pages/index/index'
				});
				showSuccessToast('登录成功！')
			} else if (res.data.msgTip == 'user is not exist') {
				showToast('用户不存在!')
			} else if (res.data.msgTip == 'user password error') {
				showToast('用户密码不正确!')
			} else if (res.data.msgTip == 'user is black') {
				showToast('用户被禁用!')
			}
			else if (res.data.msgTip == 'access service error') {
				showToast('查询服务异常!')
			}
		}
		onRandomImage();
		code.value = ''
	}
	const onLogin = async () => {
		if (!loginName.value || loginName.length == 0) {
			showToast('请输入账号')
			return;
		}
		if (!password.value || password.length == 0) {
			showToast('请输入密码')
			return;
		}
		if (!code.value || code.length == 0) {
			showToast('请输入验证码')
			return;
		}
		const loginParams = {
			loginName: loginName.value,
			password: md5Result.value ? md5Result.value : md5Libs.md5(password.value),
			code: code.value,
			uuid: uuid.value
		}
		if (remChecked.value) {
			const accountData = JSON.stringify({
				username: loginParams.loginName,
				password: loginParams.password // 加密后存储
			});
			uni.setStorageSync(USER_ACCOUNT, accountData);
		}
		else {
			uni.removeStorageSync(USER_ACCOUNT)
		}

		try {
			const response = await store.dispatch('userModule/mLogin', loginParams)
			departConfirm(response, loginParams)
		} catch (response) {
			if (response.code === "200") {
				// 业务失败：根据不同code提示不同信息
				switch (response.code) {
					case 500010:
						showToast('验证码错误!');
						break;
					case 500011:
						showToast('验证码已失效!');
						break;
					default:
						showToast(`登录失败: ${response.data?.message || '未知错误'}`);
				}
			}
			onRandomImage();
			code.value = '';
		}
	}
	onMounted(async () => {
		borderColor.value = $u.color.primary;
		onPlatformName();
		onRandomImage();
	})
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		height: 100vh;
		padding: 60rpx 40rpx;
		background: $u-bg-color;
	}

	.image-container {
		margin-top: 100rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		border-radius: 8px;
	}

	.platformTitle {
		margin-top: 10rpx;
		font-size: 35px;
		color: $u-type-primary;
		font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
		font-weight: 700;
	}

	.ipt {
		width: 600rpx;
		margin-top: 48rpx;
		height: 90rpx;
	}

	.randomImage {
		width: 160rpx;
		height: 60rpx;
		background: #94afce;
	}
</style>