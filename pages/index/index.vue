<template>
	<view class="content">
		<view class="text-area">
			<text class="title">首页</text>
		</view>
		<view>
			<tab-bar :tabIndex="0"></tab-bar>
		</view>
	</view>
</template>
<script>
import { ACCESS_TOKEN, USER_NAME, USER_INFO } from "@/common/util/constants";

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
		}
	},
	methods: {
		}
}
</script>

<style>
</style>