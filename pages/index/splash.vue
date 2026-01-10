<template>
	<view>

	</view>
</template>

<script setup lang="ts">
	import { ref,onMounted } from 'vue'
	import {USER_ACCOUNT} from "@/common/util/constants";
	let pageEnterTime = 0;	
	onMounted(() => {	
		
		// 记录起始时间戳（高精度）
		 pageEnterTime = new Date().getTime();
		console.log('[splash] 页面进入起始时间戳（毫秒）：', pageEnterTime);
		
		
		
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
		
		const pageDomReadyTime = new Date().getTime();
			  const domCost = pageDomReadyTime - pageEnterTime;
			  console.log(`[splash] 页面 DOM 渲染完成耗时：${domCost} 毫秒（${(domCost / 1000).toFixed(2)} 秒）`);
		
	})

</script>

<style>

</style>