<template>
	<view>

	</view>
</template>

<script setup lang="ts">
	import { ref,onMounted } from 'vue'
	import {USER_ACCOUNT} from "@/common/util/constants";
	let pageEnterTime = 0;	
	onMounted(() => {		
		let token = uni.getStorageSync(USER_ACCOUNT);
		if (token) {
			uni.$u.route({
			      url: '/pages/index/index',
				  type:"reLaunch"
			    });
		} else {
			uni.$u.route({
			      url: '/pages/index/login',
				  type:"reLaunch"
			    });
		}
	})

</script>

<style>

</style>