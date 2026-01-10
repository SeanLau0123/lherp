<template>
	<view>
		<view>
			<u-navbar :is-back="false" title-color='#ffffff' back-icon-color='#ffffff' :background="background">
				<view class="slot-wrap">{{title}}</view>
			</u-navbar>
		</view>
		<!-- 常用服务 -->
		<u-cell-group>
			<u-cell-item icon="setting" icon-size="42" title="基础资料" :arrow="false">
			</u-cell-item>
		</u-cell-group>
		<view>
			<u-grid :border="true" col="4">
				<u-grid-item :customStyle="{ height: 200 + 'rpx' }" v-for="(listItem, listIndex) in usList"
					:key="listIndex">
					<u-image :showLoading="true" :src="listItem.icon" width="30px" height="30px" :lazy-load="true"
						@click="goPage(listItem.page,listItem.url)"></u-image>
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
					<u-image :showLoading="true" :src="listItem.icon" width="30px" height="30px" :lazy-load="true"
						@click="goPage(listItem.page,listItem.url)"></u-image>
					<text class="grid-text">{{ listItem.title }}</text>
				</u-grid-item>
			</u-grid>
		</view>
		<tab-bar v-model="currentTab"></tab-bar>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted } from 'vue'
	const title = ref<string>('管理')
	//定义顶部导航背景数
	const background = reactive({
		backgroundImage: "linear-gradient(45deg, #0081ff, #1cbbb4)"
	})
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
			{ url: "/material/material", page: "material", title: "商品信息", icon: "/static/icon/goods.png" },
			{ url: "/material/material_category", page: "categorys", title: "商品类别", icon: "/static/icon/categorys.png" },
			{ url: "/system/unit", page: "unites", title: "多单位", icon: "/static/icon/unites.png" },
			{ url: "/material/material_attribute", page: "multiAttribute", title: "多属性", icon: "/static/icon/multiAttribute.png" },
			{ url: "/system/vendor", page: "vendors", title: "供应商信息", icon: "/static/icon/vendors.png" },
			{ url: "/system/customer", page: "customers", title: "客户信息", icon: "/static/icon/customers.png" },
			{ url: "/system/member", page: "members", title: "会员信息", icon: "/static/icon/members.png" },
			{ url: "/system/depot", page: "depot", title: "仓库信息", icon: "/static/icon/depot.png" },
			{ url: "/system/in_out_item", page: "inOutItemList", title: "收支项目", icon: "/static/icon/inOutItemList.png" },
			{ url: "/system/account", page: "accounts", title: "账户管理", icon: "/static/icon/accounts.png" },
			{ url: "/system/person", page: "person", title: "经手人管理", icon: "/static/icon/person.png" },
			{ url: "/system/role", page: "role", title: "角色管理", type: 'system', icon: "/static/icon/role.png" },
			{ url: "/system/log", page: "log", title: "日志管理", type: 'system', icon: "/static/icon/logs.png" },
			{ url: "/system/user", page: "user", title: "用户管理", type: 'system', icon: "/static/icon/user.png" }
		]

		// 权限匹配逻辑（保持原逻辑不变）
		if (permissionList?.length) { // 可选链+长度判断，简化健壮性校验
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
								url:targetMaterial.url
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
	
	const goPage = (page: string, url: string) => {
		// 根据实际需求实现点击逻辑
		//console.log('点击了宫格:', page+"--"+url)
		const targetRoute = `/pages/manage${url}`;
		//pages/manage/material/material
		uni.$u.route(targetRoute);
	}
	
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
		color: #000000;
		padding: 10rpx 0 20rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}
</style>