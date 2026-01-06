<template>
	<view>
		<view>
			<u-navbar :placeholder="true" :title="title" bgColor="#0b3d91" leftIconColor="white" titleStyle ="color:white;"></u-navbar>
		</view>
		<scroll-view scroll-y="true" style="width: 100%;">
			管理
		</scroll-view>
		<view style="width: 100%;">
			<tab-bar :tabIndex="4"></tab-bar>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: '报表',
			};
		},
		mounted() {}
	}
</script>

<style lang="scss">
	@import url("@/common/colorui/main.css");
	@import url(@/common/colorui/icon.css);
	@import url(@/common/colorui/animation.css);
</style>