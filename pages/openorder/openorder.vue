<template>
	<view style="height: 100vh;">
		<view>
			<u-navbar :is-back="false" :background="background">
				<view class="slot-wrap">{{title}}</view>
			</u-navbar>
		</view>
		<!-- 常用服务 -->
		<u-cell-group>
			<u-cell-item icon="shopping-cart" icon-size="42" title="出入库管理" :arrow="false">
			</u-cell-item>
		</u-cell-group>
		<view>
			<u-grid :border="true" col="4">
				<u-grid-item :customStyle="{ height: 200 + 'rpx' }" v-for="(listItem, listIndex) in usList"
					:key="listIndex" @click="goPage(listItem.page, listItem.url)">
					<u-icon :name="listItem.icon" custom-prefix="custom-icon" size="62"
						:color="$u.color.primary"></u-icon>
					<text class="grid-text">{{ listItem.title }}</text>
				</u-grid-item>
			</u-grid>
			<u-cell-group>
				<u-cell-item icon="rmb-circle" icon-size="42" title="财务管理" :arrow="false">
				</u-cell-item>
			</u-cell-group>
			<u-grid :border="true" col="4">
				<u-grid-item :customStyle="{ height: 200 + 'rpx' }" v-for="(listItem, listIndex) in financialList"
					:key="listIndex" @click="goPage(listItem.page, listItem.url)">
					<u-icon :name="listItem.icon" custom-prefix="custom-icon" size="62"
						:color="$u.color.primary"></u-icon>
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
	const title = ref<string>('操作中心')
	const { currentTheme, themes, darkMode } = useTheme();
	//定义顶部导航背景数
	const background = reactive({
		backgroundColor: ""
	})
	const updateNavbarBackground = () => {
		background.backgroundColor = $u.color.primary;
	};

	interface GridItem {
		title : string
		icon : string
		description : string
		useCount : number
		page : string
	}
	const currentTab = ref<number>(3)
	const usList = ref<GridItem[]>([])
	const financialList = ref<GridItem[]>([])
	// 初始化报表菜单列表
	const initOpenorderList = () => {
		// 从本地缓存获取权限列表
		const permissionList = uni.getStorageSync("permissionList");
		const data = []
		const financialdata = []


		// 重构：用数组直接定义物料列表，避免重复创建单个对象的冗余写法
		const operOrderList = [
			{ url: "/bill/retail_out", page: "retailOut", title: "零售出库", icon: "retailOutbound" },
			{ url: "/bill/retail_back", page: "retailBackOut", title: "零售退货", icon: "retailReturn" },
			{ url: "/bill/purchase_order", page: "purchaseOrder", title: "采购订单", icon: "purchaseOrder" },
			{ url: "/bill/purchase_in", page: "PurchaseIn", title: "采购入库", icon: "purchaseIn" },
			{ url: "/bill/purchase_back", page: "PurchaseReturn", title: "采购退货", icon: "purchaseReturn" },
			{ url: "/bill/sale_order", page: "saleOrder", title: "销售订单", icon: "saleOrder" },
			{ url: "/bill/sale_out", page: "saleOut", title: "销售出库", icon: "saleOutOrder" },
			{ url: "/bill/sale_back", page: "saleBack", title: "销售退货", icon: "saleBackOrder" },
			{ url: "/bill/other_in", page: "otherIn", title: "其它入库", icon: "otherIn" },
			{ url: "/bill/other_out", page: "otherOut", title: "其它出库", icon: "otherOut" },
			{ url: "/bill/allocation_out", page: "allocation", title: "调拨订单", icon: "allocation" },
			{ url: "/financial/item_in", page: "Income", type: 'financial', title: "收入单", icon: "income" },
			{ url: "/financial/item_out", page: "Expense", type: 'financial', title: "支出单", icon: "expense" },
			{ url: "/financial/money_in", page: "Receipt", type: 'financial', title: "收款单", icon: "receipt" },
			{ url: "/financial/money_out", page: "Payment", type: 'financial', title: "付款单", icon: "payment" },
			{ url: "/financial/giro", page: "Transfer", type: 'financial', title: "转账单", icon: "transfer" },
			{ url: "/financial/advance_in", page: "AdvanceIn", type: 'financial', title: "收预付款", icon: "advanceIn" },
		]

		// 3. 权限匹配核心逻辑（重构后） 
		if (permissionList?.length) { // 可选链+长度判断，简化健壮性校验
			// 步骤1：将报表列表转为 URL -> 报表信息的Map，实现O(1)高效查找
			const reportUrlMap = new Map(operOrderList.map(item => [item.url, item]));
			// 步骤2：扁平化遍历权限列表子项，替代多层嵌套for循环
			permissionList.forEach(permissionItem => {
				// 可选链校验子项存在性，避免空值报错
				if (permissionItem?.children?.length) {
					permissionItem.children.forEach(childPermission => {
						// 步骤3：从Map中快速获取匹配的报表信息
						const targetReport = reportUrlMap.get(childPermission.url);

						// 步骤4：匹配成功则构造数据并分类存入
						if (targetReport) {
							const reportData = {
								title: targetReport.title,
								icon: targetReport.icon || "/static/icon/wendang.png",
								description: targetReport.title,
								useCount: 1000,
								page: targetReport.page
							};

							// 保持原分类逻辑，无system类型则默认存入data
							targetReport.type === 'financial' ? financialdata.push(reportData) : data.push(reportData);
						}
					});
				}
			});
		}
		// 更新响应式数据
		usList.value = data
		financialList.value = financialdata
	}
	const goPage = (page : string, url : string) => {
		let targetRoute = ''
		switch (page) {
			case 'Transfer':
				targetRoute = `/pages/openorder/Financial/Transfer/Transfer`;
				break;
			case 'Income':
				targetRoute = `/pages/openorder/Financial/Income/Income`;
				break;
			case 'Expense':
				targetRoute = `/pages/openorder/Financial/Expense/Expense`;
				break;
			case 'AdvanceIn':
				targetRoute = `/pages/openorder/Financial/AdvanceIn/${page}`;
				break;
			case 'saleOut':
				targetRoute = `/pages/openorder/OutboundOrder/OutboundOrder`;
				break;
			case 'saleBack':
				targetRoute = `/pages/openorder/SalesReturn/SalesReturn`;
				break;
			case 'PurchaseIn':
				targetRoute = `/pages/openorder/InboundOrder/InboundOrder`;
				break;
			case 'PurchaseReturn':
				targetRoute = `/pages/openorder/PurchaseReturn/PurchaseReturn`;
				break;
			case 'retailOut':
				targetRoute = `/pages/openorder/RetailOut/RetailOut`;
				break;
			case 'retailBackOut':
				targetRoute = `/pages/openorder/RetailReturn/RetailReturn`;
				break;

			// 	case 'inOutItemList':
			// 		targetRoute = '收支项目'
			// 		break;
			// 	case 'accounts':
			// 		targetRoute = '账户管理'
			// 		break;
			// 	case 'person':
			// 		targetRoute = '经手人管理'
			// 		break;
			// 	case 'role':
			// 		targetRoute = '角色管理'
			// 		break;
			// 	case 'log':
			// 		targetRoute = '日志管理'
			// 		break;
			// 	case 'user':
			// 		targetRoute = '用户管理'
			// 		break;
			default:
				uni.showToast({
					icon: 'error',
					title: "开发中"
				})
				break;
		}
		if (targetRoute) {
			uni.$u.route(targetRoute);
		}
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
		initOpenorderList()
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