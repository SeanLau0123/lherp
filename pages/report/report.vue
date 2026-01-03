<template>
	<view class="content">
		<view>
			<tab-bar :tabIndex="4"></tab-bar>
		</view>
		<view>
			<u-navbar title="报表"></u-navbar>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'tabbar',
		props: {
			tabIndex: {
				type: Number,
				default: 4
			}
		},
		data() {
			return {src: "https://static.jeecg.com/upload/test/blue_1595818030310.png"}
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
</style>