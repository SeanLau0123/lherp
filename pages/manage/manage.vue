<template>
	<view style="height: 100vh;">
		<view>
			<u-navbar :is-back="false" :background="background">
				<view class="slot-wrap">{{title}}</view>
			</u-navbar>
		</view>
		<!-- 常用服务 -->
		<u-cell-group>
			<u-cell-item icon="star" icon-size="42" title="基础资料" :arrow="false">
			</u-cell-item>
		</u-cell-group>
		<view>
			<u-grid :border="true" col="4">
				<u-grid-item :customStyle="{ height: 200 + 'rpx' }" v-for="(listItem, listIndex) in usList"
					:key="listIndex">
					<u-icon :name="listItem.icon" custom-prefix="custom-icon" size="62" :color="$u.color.primary"
						@click="goPage(listItem.page, listItem.url)"></u-icon>
					<text class="grid-text">{{ listItem.title }}</text>
				</u-grid-item>
			</u-grid>
			<u-cell-group>
				<u-cell-item icon="setting" icon-size="42" title="系统设置" :arrow="false">
				</u-cell-item>
			</u-cell-group>
			<u-grid :border="true" col="4">
				<u-grid-item :customStyle="{ height: 200 + 'rpx' }" v-for="(listItem, listIndex) in systemList"
					:key="listIndex">
					<u-icon :name="listItem.icon" custom-prefix="custom-icon" size="62" :color="$u.color.primary"
						@click="goPage(listItem.page, listItem.url)"></u-icon>
					<text class="grid-text">{{ listItem.title }}</text>
				</u-grid-item>
			</u-grid>
		</view>
		<tab-bar v-model="currentTab"></tab-bar>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, watch } from 'vue'
	import { Request, color, $u, useTheme } from 'uview-pro'
	const title = ref<string>('管理')
	const { currentTheme, themes, darkMode } = useTheme();
	//定义顶部导航背景数
	const background = reactive({
		backgroundColor: ""
	})
	const updateNavbarBackground = () => {
		background.backgroundColor = $u.color.primary;
	};

	const currentTab = ref<number>(1)

	const usList = ref<string>([])
	const systemList = ref<string>([])
	// 初始化物料列表
	const initMaterialList = () => {
		// 从本地缓存获取权限列表
		const permissionList = uni.getStorageSync("permissionList");
		const data = []
		const sysdata = []

		// 重构：用数组直接菜单列表
		const materialList = [
			{ url: "/material/material", page: "material", title: "商品信息", icon: "material" },
			{ url: "/material/material_category", page: "categorys", title: "商品类别", icon: "categorys" },
			{ url: "/system/unit", page: "unites", title: "多单位", icon: "unites" },
			{ url: "/material/material_attribute", page: "multiAttribute", title: "多属性", icon: "SKU" },
			{ url: "/system/vendor", page: "supplier", title: "供应商信息", icon: "supplier" },
			{ url: "/system/customer", page: "customers", title: "客户信息", icon: "customers" },
			{ url: "/system/member", page: "members", title: "会员信息", icon: "members" },
			{ url: "/system/depot", page: "depot", title: "仓库信息", icon: "depot" },
			{ url: "/system/in_out_item", page: "inOutItemList", title: "收支项目", icon: "inOutItemList" },
			{ url: "/system/account", page: "accounts", title: "账户管理", icon: "accounts" },
			{ url: "/system/person", page: "person", title: "经手人管理", icon: "person" },
			{ url: "/system/role", page: "role", title: "角色管理", type: 'system', icon: "role" },
			{ url: "/system/log", page: "log", title: "日志管理", type: 'system', icon: "log" },
			{ url: "/system/user", page: "user", title: "用户管理", type: 'system', icon: "user" }
		]

		// 权限匹配逻辑（保持原逻辑不变）
		if (permissionList?.length) {
			// 步骤1：将物料列表转为 URL -> 物料信息的Map，优化查询性能（O(1) 查找）
			const materialUrlMap = new Map(materialList.map(item => [item.url, item]));

			// 步骤2：扁平化遍历权限列表的子项（避免多层嵌套for循环，可读性更强）
			permissionList.forEach(permissionItem => {
				// 校验子项存在性，避免报错
				if (permissionItem?.children?.length) {
					permissionItem.children.forEach(childPermission => {
						const targetMaterial = materialUrlMap.get(childPermission.url);

						// 步骤3：找到匹配的物料，构造数据并分类存入
						if (targetMaterial) { // 仅当匹配成功时执行后续逻辑，减少无效操作
							const materialData = {
								title: targetMaterial.title,
								icon: targetMaterial.icon || "/static/icon/wendang.png",
								description: targetMaterial.title,
								useCount: 1000,
								page: targetMaterial.page,
								url: targetMaterial.url
							};

							// 三元表达式简化分类逻辑，语义清晰
							targetMaterial.type === 'system' ? sysdata.push(materialData) : data.push(materialData);
						}
					});
				}
			});
		}

		// 更新响应式数据
		usList.value = data
		systemList.value = sysdata
	}

	const goPage = (page : string, url : string) => {
		// 根据实际需求实现点击逻辑
		console.log('点击了宫格:', page + "--" + url)
		let targetRoute = ''
		switch (page) {
			case 'material':
				targetRoute = `/pages/manage${url}`;
				break;
			case 'categorys':
				targetRoute = '/pages/manage/category/category'
				break;
			case 'unites':
				targetRoute = ''
				break;
			case 'multiAttribute':
				targetRoute = ''
				break;
			case 'supplier':
				targetRoute = '/pages/manage/supplier/supplier'
				break;
			case 'customers':
				targetRoute = '/pages/manage/customers/customers'
				break;
			case 'members':
				targetRoute = '/pages/manage/members/members'
				break;
			case 'depot':
				targetRoute = '/pages/manage/warehouse/warehouse'
				break;
			case 'inOutItemList':
				targetRoute = '/pages/manage/inoutItem/inoutItem'
				break;
			case 'accounts':
				targetRoute = '/pages/manage/accounts/accounts'
				break;
			case 'person':
				targetRoute = '/pages/manage/handler/handler'
				break;
			case 'role':
				targetRoute = ''
				break;
			case 'log':
				targetRoute = '/pages/manage/logs'
				break;
			case 'user':
				targetRoute = ''
				break;
			default:
				break;
		}
		if (targetRoute === ''){
			uni.showToast({
				icon: 'error',
				title: "开发中"
			})
		}
		uni.$u.route(targetRoute);
	}

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
		initMaterialList()
	})
</script>
<style lang="scss">
	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
		padding: 0 30rpx;
		font-size: 42rpx;
		color: #ffffff;
	}

	.grid-text {
		font-size: 12px;
		padding: 10rpx 0 20rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}
</style>