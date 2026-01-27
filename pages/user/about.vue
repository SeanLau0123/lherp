<template>
	<view style="height: 100vh;">
		<u-toast ref="uToastRef" />
		<u-navbar :is-back="true" :background="background" :title="title" back-icon-color="#ffffff"
			title-color="#ffffff"></u-navbar>
			<view class="content">
				  <u-image width="200rpx" height="200rpx" :src="src" shape="circle">
				    <template #loading>
				      <u-loading></u-loading>
				    </template>
				  </u-image>
				<view class="text-center">{{version}}</view>
			</view>
			<u-cell-group class="cell">
				<u-cell-item title="检查更新" :value-style="versionStyle" :value="versionValue"
					@click="appUpdate()"></u-cell-item>
			</u-cell-group>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, reactive, watch } from 'vue'
	import { color, $u, useTheme } from 'uview-pro'
	const { currentTheme, themes, darkMode } = useTheme();	
	const title = ref<string>('关于我们')
	const versionValue = ref('')
	const version = ref('')
	const src = ref<string>("https://linghanshop.cn/uploads/attach/2025/11/20251128/c9840ae740abc19c00b3bda853b1abe8.png")
	const uToastRef = ref()
	const versionStyle = ref({});
	const showToast = (title : string) => {
		uToastRef.value.show({
			type: 'default',
			title
		})
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
	// 提取版本对比公共函数（复用性更强）
	function isNeedUpdate(clientVersion, serverVersion) {
		const clientArr = clientVersion.split(".").map(item => parseInt(item, 10));
		const serverArr = serverVersion.split(".").map(item => parseInt(item, 10));
		const maxLength = Math.max(clientArr.length, serverArr.length);
		for (let i = 0; i < maxLength; i++) {
			const clientNum = clientArr[i] || 0;
			const serverNum = serverArr[i] || 0;
			if (serverNum > clientNum) {
				return true;
			} else if (serverNum < clientNum) {
				return false;
			}
		}
		return false;
	}

	// 获取当前APP版本号
	const getAppVersion = () => {
		if (typeof plus !== 'undefined') {
			plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
				version.value = wgtinfo.version;
			});
		}
	}

	// 提取公共的检测更新函数（支持自动检测和手动触发）
	const checkUpdate = (isManual = false) => {
		// 先判断 plus 对象是否存在（仅 App 端可用，避免非 App 端报错）
		if (typeof plus === 'undefined') {
			if (isManual) { // 仅手动点击时显示提示，自动检测时不弹窗（避免干扰用户）
				showToast('当前环境不支持APP更新')
			}
			return;
		}

		uni.request({
			url: 'https://erp.linghanshop.cn/doc/update.json', //检查更新的服务器地址
			data: {
				appid: plus.runtime.appid,
				version: plus.runtime.version
			},
			success: (res) => {
				// 校验接口返回数据是否有效
				if (!res.data || !res.data.version) {
					if (isManual) { // 仅手动点击时提示错误
						showToast('更新检测失败，返回数据异常:')
					}
					return;
				}

				plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
					let client_version = wgtinfo.version;
					const server_version = res.data.version;
					const flag_update = isNeedUpdate(client_version, server_version);

					// 核心逻辑：判断存在更新时，给versionValue赋值新版本号
					if (flag_update) {
						versionValue.value = "发现新版本";
						versionStyle.value =
							{ color: '#ff0000', fontWeight: 500 }
						if (isManual) {
							uni.$u.route({
								url: 'common/zlUpdate/zlUpdate?dowInfo=' + JSON.stringify(
									res.data)
							});
						}
					} else {
						// 无更新时：手动点击提示，自动检测时清空versionValue（可选，根据需求调整）
						if (isManual) {
							showToast('暂无更新,当前版本:' + client_version)
						}
						versionValue.value = '当前已是最新';
						versionStyle.value =
							{ color: '#666666' }
					}
				});
			},
			// 补充请求失败回调，提高鲁棒性
			fail: (err) => {
				if (isManual) { // 仅手动点击时提示网络错误
					showToast('更新检测请求失败，请检查网络:')
				}
				console.error("更新接口请求失败：", err);
			}
		})
	}

	// 手动触发更新（调用公共检测函数，标记为手动操作）
	function appUpdate() {
		checkUpdate(true);
	}

	onMounted(() => {
		getAppVersion(); // 获取当前本地版本
		checkUpdate(false); // 页面挂载后自动检测更新（标记为自动操作，不弹窗仅赋值版本号）
	})
</script>

<style>
	.text-center {
		margin-top: 10px;
		text-align: center;
		font-size: 42rpx;
	}

	.content {
		margin-top: 50px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.cell {
		margin-top: 100px;
	}
</style>