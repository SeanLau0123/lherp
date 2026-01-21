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
			iconSize:48,
			selectedIconPath: "home-fill",
			text: "首页",
			isDot: false,
			customIcon: false,
			pagePath: "/pages/index/index"
		},
		{
			iconPath: "grid",
			iconSize:48,
			selectedIconPath: "grid-fill",
			text: "资料",
			isDot: false,
			customIcon: false,
			pagePath: "/pages/manage/manage"
		},
		{
			iconPath: "edit-pen",
			iconSize:48,
			selectedIconPath: "edit-pen-fill",
			text: "开单",
			isDot: false,
			customIcon: false,
			pagePath: "/pages/openorder/openorder"
		},
		{
			iconPath: "file-text",
			iconSize:48,
			selectedIconPath: "file-text-fill",
			text: "报表",
			isDot: false,
			customIcon: false,
			pagePath: "/pages/report/report"
		},
		{
			iconPath: "account",
			iconSize:48,
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