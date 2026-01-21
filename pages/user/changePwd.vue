<template>
	<view>
		<u-navbar :is-back="true" :background="background" :title="title" back-icon-color="#ffffff"
			title-color="#ffffff"></u-navbar>
		<u-toast ref="uToastRef" />
		<view class="form-group">
			<u-form :model="myform" ref="uFormRef" label-width="160rpx" label-align="right" :error-type="errorType">
				<u-form-item label="旧密码:" prop="oldpassword">
					<u-input v-model="myform.oldpassword" type="password" placeholder="请输入原密码" />
				</u-form-item>
				<u-form-item label="输入新密码:" prop="newpassword">
					<u-input v-model="myform.newpassword" type="password" placeholder="请输入新密码" />
				</u-form-item>
				<u-form-item label="确认新密码:" prop="qpassword">
					<u-input v-model="myform.qpassword" type="password" placeholder="请再次输入新密码" />
				</u-form-item>
			</u-form>
		</view>
		<u-button type="primary" @click="submit" :throttle-time="0">确认修改</u-button>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, reactive, watch } from 'vue'
	import { color, $u, useTheme } from 'uview-pro'
	import { USER_INFO } from "@/common/util/constants";
	import store from '@/store/index.js'
	import { updatePwd } from '../../api/api';
	import md5Libs from "uview-pro/libs/function/md5";
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('修改密码');
	const errorType = ref(['message']);


	const uToastRef = ref()
	const showToast = (title : string) => {
		uToastRef.value.show({
			type: 'warning',
			title
		})
	}

	const uFormRef = ref();
	const myform = reactive({
		userId: '',
		oldpassword: '',
		newpassword: '',
		qpassword: ''
	});
	const rules = {
		oldpassword: [
			{
				required: true,
				message: '请输入原密码',
				// 可以单个或者同时写两个触发验证方式
				trigger: ['blur', 'change']
			}
		],
		newpassword: [
			{
				min: 6,
				message: '新密码长度不能少于6位',
				trigger: 'change'
			},
			{
				required: true,
				message: '请输入新密码',
				trigger: ['change', 'blur']
			},
			{
				// 自定义校验规则：验证两次密码是否一致
				validator: (rule : any, value : string, callback : Function) => {
					if (value && myform.oldpassword && value == myform.oldpassword) {
						callback(new Error('新密码和旧密码不能相同!'));
					} else {
						callback();
					}
				},
				trigger: ['change', 'blur']
			}
		],
		qpassword: [
			{
				min: 6,
				message: '确认新密码长度不能少于6位',
				trigger: 'change'
			},
			{
				required: true,
				message: '请输入确认新密码',
				trigger: ['change', 'blur']
			},
			{
				// 自定义校验规则：验证两次密码是否一致
				validator: (rule : any, value : string, callback : Function) => {
					if (value && myform.newpassword && value !== myform.newpassword) {
						callback(new Error('两次输入的新密码不一致，请重新输入'));
					} else {
						callback();
					}
				},
				trigger: ['change', 'blur']
			}
		]
	};
	// 密码提交函数
	const submit = async () => {
		const valid = await uFormRef.value?.validate() as boolean;
		if (!valid) {
			return;
		}

		let userInfo = uni.getStorageSync(USER_INFO);

		let params = {}
		params.userId = userInfo.id
		params.oldpassword = md5Libs.md5(myform.oldpassword)
		params.password = md5Libs.md5(myform.newpassword)
		params.confirmPassword = md5Libs.md5(myform.qpassword)
		const res = await updatePwd(params).then(res => {
			if (res.code == 200) {
				if (res.data.message == '修改成功') {
					///uni.switchTab({url: '/pages/user/my'});
					uToastRef.value?.show({
						isTab:true,
						title: '修改成功',
						type: 'success',
						url: '/pages/user/my',
					})	
				}
				else if (res.data.message == '原始密码输入错误') {
					showToast('原始密码输入错误')
				}
			} else {
				showToast('修改失败')
			}
		});
	}
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
	onMounted(() => {
		uFormRef.value?.setRules(rules);
	});
</script>

<style>
	.form-group {
		padding: 30rpx;
	}
</style>