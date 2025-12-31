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
							<image class="randomImage" style="margin-top: 2px;" :src="base64Data" alt="Base64 Image" />
						</template>
					</u--input>
					<text v-model="uuid"></text>
				</view>
			</u-col>
			<u-col span="6" style="margin-top: 20rpx;">
				<view>
					<u-button text="登录" type="primary" loadingText="登录中"></u-button>
				</view>
			</u-col>
		</u-row>
	</view>
</template>

<script>
export default {
	data() {
		return {
			base64Data: '', // 这里存储你的Base64数据
			uuid: '', // 这里存储你的Base64数据对应唯一码
			code: '',
			src: "https://linghanshop.cn/uploads/attach/2025/11/20251128/c9840ae740abc19c00b3bda853b1abe8.png",
			loginName: 'jsh',
			password: ''
		};
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