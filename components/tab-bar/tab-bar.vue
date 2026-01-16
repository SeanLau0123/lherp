<template>
	<view>
		<view class="u-page">
			<!-- 所有内容的容器 -->
		</view>
		<!-- 与包裹页面所有内容的元素u-page同级，且在它的下方 -->
		<u-tabbar v-model="currentIndex" :list="tabList" :activeColor="$u.color.primary"
		@change="handleTabChange"></u-tabbar><!-- bg-color="#062a57" -->
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import type { TabbarItem } from 'uview-pro/types/global';

	// 定义响应式数据
	const tabList = ref<TabbarItem[]>([
		{
			iconPath: "home",
			selectedIconPath: "home-fill",
			text: "首页",
			isDot: false,
			customIcon: false,
			pagePath: "/pages/index/index"
		},
		{
			iconPath: "grid",
			selectedIconPath: "grid-fill",
			text: "资料",
			isDot: false,
			customIcon: false,
			pagePath: "/pages/manage/manage"
		},
		{
			iconPath: "edit-pen",
			selectedIconPath: "edit-pen-fill",
			text: "开单",
			isDot: false,
			customIcon: false,
			pagePath: "/pages/openorder/openorder"
		},
		{
			iconPath: "file-text",
			selectedIconPath: "file-text-fill",
			text: "报表",
			isDot: false,
			customIcon: false,
			pagePath: "/pages/report/report"
		},
		{
			iconPath: "account",
			selectedIconPath: "account-fill",
			text: "我的",
			isDot: false,
			customIcon: false,
			pagePath: "/pages/user/my"
		},
	])
	const currentIndex = ref<number>(0)

	const handleTabChange  = (index : number) => {
		currentIndex.value = index;
	}
</script>