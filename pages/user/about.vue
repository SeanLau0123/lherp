<template>
	<view>
		<view>
			<u-navbar :autoBack="true" :safeArea="true" :placeholder="true" :title="title" class="topNavbar"></u-navbar>
		</view>
		<view class="content">
			<image class="zai-logo" src="/static/erplogo.png"></image>
			<view class="padding flex flex-direction text-center">
				当前版本:{{version}}
			</view>
			<view class="text-area" @click="toUpdate">
				<text class="title">检查更新</text>
			</view>
		</view>
	</view>
</template>

<script>
	import appUpdate from 'common/util/zlUpdate/appUpdate.js'
	export default {
		data() {
			return {
				title: '关于我们',
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
		width: 200rpx;
		height: 200rpx;
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

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>