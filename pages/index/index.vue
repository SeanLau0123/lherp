<template>
	<view class="content">
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<view>
			<tab-bar :tabIndex="0"></tab-bar>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'tabbar',
		props: {
			tabIndex: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				title: '首页'
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 64rpx;
		color: #8f8f94;
	}
</style>