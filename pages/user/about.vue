<template>
	<view>
		<cu-custom :bgColor="NavBarColor" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">关于</block>
		</cu-custom>
		<view class="content">
			<image class="zai-logo" src="/static/erplogo.png"></image>
			<view class="padding flex flex-direction  text-center">
				当前版本:{{version}}
			</view>
			<view class="text-area" @click="toUpdate">
				<text class="title">{{title}}</text>
			</view>
		</view>
	</view>

</template>

<script>
	import appUpdate from 'common/util/zlUpdate/appUpdate.js'
	export default {
		data() {
			return {
				title: '点我更新',
				version: ''
			}
		},
		methods: {
			onLoad: function() {
				var that = this
				plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
					that.version = wgtinfo.version
				});
			},
			toUpdate() {
				appUpdate()
			}
		}
	}
</script>

<style>
	.zai-logo {
		width: 200upx;
		height: 150upx;
	}

	.text-center {
		text-align: center;
	}

	.content {
		margin-top: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>