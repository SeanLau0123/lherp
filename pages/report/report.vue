<template>
	<view style="height: 100vh;">
		<view>
			<u-navbar :is-back="false" :background="background">
				<view class="slot-wrap">{{title}}</view>
			</u-navbar>
		</view>
		<!-- 常用服务 -->
		<u-cell-group>
			<u-cell-item icon="pushpin" icon-size="42" title="报表" :arrow="false">
			</u-cell-item>
		</u-cell-group>
		<view>
			<u-grid :border="true" col="4">
				<u-grid-item :customStyle="{ height: 200 + 'rpx' }" v-for="(listItem, listIndex) in usList"
					:key="listIndex">
					<u-icon :name="listItem.icon" custom-prefix="custom-icon" size="64" :color="$u.color.primary"
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
	const title = ref<string>('报表中心')
	const { currentTheme, themes, darkMode } = useTheme();
	//定义顶部导航背景数
	const background = reactive({
		backgroundColor: ""
	})
	const updateNavbarBackground = () => {
		background.backgroundColor = $u.color.primary;
	};
	const currentTab = ref<number>(3)
	const usList = ref<string>([])
	// 初始化报表菜单列表
	const initReportlList = () => {
		// 从本地缓存获取权限列表
		const permissionList = uni.getStorageSync("permissionList");
		const data = []

		// 重构：用数组直接定义物料列表，避免重复创建单个对象的冗余写法
		const reportList = [
			{
				url: "/report/material_stock",
				page: "material_stock",
				icon: "material_stock",
				title: "商品库存"
			},
			{
				url: "/report/buy_in_report",
				page: "buyin",
				icon: "buyin",
				title: "采购统计"
			},
			{
				url: "/report/sale_out_report",
				page: "saleout",
				icon: "saleout",
				title: "销售统计"
			},
			{
				url: "/report/in_detail",
				page: "InDetail",
				icon: "indetail",
				title: "入库明细"
			},
			{
				url: "/report/out_detail",
				page: "OutDetail",
				icon: "outdetail",
				title: "出库明细"
			},
			{
				url: "/report/allocation_detail",
				page: "allocationdetail",
				icon: "allocationdetail",
				title: "调拨明细"
			},
			{
				url: "/report/in_material_count",
				page: "inmaterialcount",
				icon: "inmaterialcount",
				title: "入库汇总"
			},
			{
				url: "/report/out_material_count",
				page: "outmaterialcount",
				icon: "outmaterialcount",
				title: "出库汇总"
			},
			{
				url: "/report/in_out_stock_report",
				page: "inoutstockreport",
				icon: "inoutstockreport",
				title: "进销存统计"
			},
			{
				url: "/report/customer_account",
				page: "customeraccount",
				icon: "customeraccount",
				title: "客户对账"
			},
			{
				url: "/report/vendor_account",
				page: "supplierAccount",
				icon: "supplierAccount",
				title: "供应商对账"
			},
			{
				url: "/report/stock_warning_report",
				page: "stockwarningreport",
				icon: "stockwarningreport",
				title: "库存预警"
			},
			{
				url: "/report/retail_out_report",
				page: "retailout",
				icon: "retailout",
				title: "零售统计"
			},
			{
				url: "/report/account_report",
				page: "account",
				icon: "account",
				title: "账户统计"
			}
		];

		// 3. 权限匹配核心逻辑（重构后）
		if (permissionList?.length) { // 可选链+长度判断，简化健壮性校验
			// 步骤1：将报表列表转为 URL -> 报表信息的Map，实现O(1)高效查找
			const reportUrlMap = new Map(reportList.map(item => [item.url, item]));

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
							targetReport.type === 'system' ? sysdata.push(reportData) : data.push(reportData);
						}
					});
				}
			});
		}
		// 更新响应式数据
		usList.value = data
	}
	const goPage = (page : string, url : string) => {
		// 根据实际需求实现点击逻辑
		console.log('点击了宫格:', page + "--" + url)
		let targetRoute = ''
		switch (page) {
			case 'buyin':
				targetRoute = `/pages/report/${page}`;
				break;
			case 'InDetail':
				targetRoute = `/pages/report/${page}`;
				break;
			case 'OutDetail':
				targetRoute = `/pages/report/${page}`;
				break;
			case 'supplierAccount':
				targetRoute = `/pages/report/${page}`;
				break;
			case 'account':
				targetRoute = `/pages/report/${page}`;
				break;
			case 'supplier':
				targetRoute = '/pages/manage/supplier/supplier'
				break;
			case 'customers':
				targetRoute = '/pages/manage/customers/customers'
				break;
			case 'depot':
				targetRoute = '/pages/manage/warehouse/warehouse'
				break;
			case 'inOutItemList':
				targetRoute = '收支项目'
				break;
			case 'accounts':
				targetRoute = '账户管理'
				break;
			case 'person':
				targetRoute = '经手人管理'
				break;
			case 'role':
				targetRoute = '角色管理'
				break;
			case 'log':
				targetRoute = '日志管理'
				break;
			case 'stockwarningreport':
				targetRoute = `/pages/report/${page}`;
				break;
			default:
				break;
		}
		if (targetRoute === '') {
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
		initReportlList()
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