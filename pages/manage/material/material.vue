<template>
	<view>
		<view>
			<u-navbar :autoBack="true" :placeholder="true" :title="title" bgColor="#0b3d91" leftIconColor="white"
				titleStyle="color:white;"></u-navbar>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '商品信息'
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>