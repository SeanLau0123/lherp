<template>
	<view style="height: 100vh;">
		<u-navbar :is-back="true" :background="background" :title="title" back-icon-color="#ffffff"
			title-color="#ffffff"></u-navbar>
		<view>
			<u-cell-group>
				<u-cell-item icon="bookmark-fill" title="工号" :arrow="false" :value="personal.id"></u-cell-item>
				<u-cell-item icon="edit-pen-fill" title="登录名称" :arrow="false" :value="personal.loginName"></u-cell-item>
				<u-cell-item icon="account-fill" title="用户姓名" :arrow="false" :value="personal.username"></u-cell-item>
				<u-cell-item icon="email-fill" title="邮箱" :arrow="false"
					:value="personal.email || '未绑定邮箱'"></u-cell-item>
				<u-cell-item icon="phone-fill" title="电话号码" :arrow="false"
					:value="personal.phonenum || '未绑定手机号'"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, watch } from 'vue'
	import { getUserSession } from '@/api/api.js'
	import { $u, useTheme } from 'uview-pro'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('个人详情')
	const color = ref('');
	const background = reactive({
		backgroundColor: ""
	})
	const updateNavbarBackground = () => {
		background.backgroundColor = $u.color.primary;
	};
	watch(
		[
			() => currentTheme.value,
			() => darkMode.value
		],
		([newTheme, newDarkMode], [oldTheme, oldDarkMode]) => {
			// 仅当主题或暗黑模式变化时，更新导航栏背景
			if (newTheme !== oldTheme || newDarkMode !== oldDarkMode) {
				updateNavbarBackground();
			}
		},
		{
			immediate: true,
			deep: false
		}
	);
	const personal = ref({
		id: '',
		loginName: '',
		username: '',
		email: '',
		phonenum: ''
	})
	//获取当前用户的详细信息
	const OngetUserSession = async () => {
		const res = await getUserSession()
		if (res) {
			personal.value = res.data.user;
		}
	}
	onMounted(async () => {
		color.value = $u.color.bgColor;
		OngetUserSession();
	})
</script>

<style>

</style>