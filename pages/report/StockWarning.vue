<!-- 报表-库存预警 -->
<template>
	<view style="height: 100vh;">
		<u-navbar :is-back="true" :title="title" title-color='#ffffff' back-icon-color='#ffffff'
			:background="background">
			<view class="navbar-right-icon">
				<u-icon name='search' @click="popupShow = true" color="#ffffff" size="48rpx" label-pos="right"></u-icon>
			</view>
		</u-navbar>
		<u-empty text="没有搜索结果" mode="search" :show="emptyShow" class="u-empty-fullscreen"></u-empty>
		<scroll-view class="scrollviewpadding">
			<u-popup v-model="popupShow" mode="right" width="600rpx" height="300px" border-radius="14">
				<view class="popup-title">
					<u-form label-width="160rpx">
						<u-form-item label-align="right" label="仓库：">
							<u-input v-model="depotName" :type="type" placeholder="请选择仓库"
								@click="depotShow = true" /></u-form-item>
						<u-select v-model="depotShow" :list="depotList" :default-value='depotId'
							@confirm="depotConfirm"></u-select>
						<u-form-item label="商品信息：">
							<u-input v-model="searchname" placeholder="请输入名称、条码、助记码查询" /></u-form-item>
						<u-gap></u-gap>
						<u-button type="primary" @click="search()">搜索</u-button>
						<u-gap></u-gap>
						<u-button @click="reset()">重置</u-button>
					</u-form>
				</view>
			</u-popup>
			<view style="min-height: 80rpx;" v-for="(stock, index) in StockWarningList" :key="stock.barCode || index">
				<view class="good-item">
					<u-row gutter="10">
						<u-col span="12">
							<u-collapse :head-style="headStyle">
								<u-collapse-item :title="stock.mname">
									<view class="goods-row">
										<text class="label">条码：</text>
										<u-text :text="stock.barCode"></u-text>
									</view>
									<view class="goods-row">
										<text class="label">品牌：</text>
										<u-text :text="stock.brand"></u-text>
										<text class="label">制造商：</text>
										<u-text :text="stock.mmfrs"></u-text>
									</view>
									<view class="goods-row">
										<text class="label">规格：</text>
										<u-text :text="stock.mstandard"></u-text>
										<text class="label">型号：</text>
										<u-text :text="stock.mmodel"></u-text>
									</view>
									<u-line :color="$u.color.primary"></u-line>
								</u-collapse-item>
							</u-collapse>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">仓库：</text>
								<u-text :text="stock.depotName"></u-text>
								<text class="label">库存：</text>
								<u-text :text="stock.currentNumber"></u-text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">最低安全库存：</text>
								<u-text :text="stock.lowSafeStock"></u-text>
								<text class="label">最高安全库存：</text>
								<u-text :text="stock.highSafeStock"></u-text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">建议入库量：</text>
								<u-text :text="stock.lowCritical"></u-text>
								<text class="label">建议出库量：</text>
								<u-text :text="stock.highCritical"></u-text>
							</view>
						</u-col>
					</u-row>
				</view>
			</view>
		</scroll-view>
		<view class="pagination-fixed">
			<u-pagination v-model="current" :total="listTotal" :pageSize="pageSize"
				@change="handleChange"></u-pagination>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { ref, reactive, onMounted, watch } from 'vue'
	import { getStockWarning, getDepotInfo } from '@/api/api.js'
	import { $u, useTheme } from 'uview-pro'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('库存预警')
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

	const popupShow = ref<boolean>(false)
	const emptyShow = ref<boolean>(false)
	const type = ref<string>('select')
	const headStyle = reactive({
		fontSize: '28rpx',
		color: $u.color.primary,
		lineHeight: '32rpx',
		fontWeight: 'bold'
	})

	const uFormRef = ref();
	const form = reactive({
		name: '',
		category: ''
	});

	function search() {
		popupShow.value = false;
		loadgetStockWarning();
	}
	function reset() {
		searchname.value = '';
		search();
	}
	interface ListItem {
		value : string
		label : string
	}
	//加载仓库列表
	const selectShow = ref<boolean>(false)
	const depotShow = ref<boolean>(false)
	const depotName = ref<string>('');
	const depotId = ref<string>('');
	const depotList = ref<ListItem[]>([]);
	const getdepotlList = async () => {
		const res = await getDepotInfo()
		if (res && res.code === 200) {
			depotList.value = res.data.map(item => ({
				value: item.id.toString() || '',
				label: item.depotName || ''
			}));

			// const defaultDepot = res.data.find(item => item.isDefault === true);
			// if (defaultDepot) {
			// 	depotName.value = defaultDepot.depotName;
			// 	depotId.value = defaultDepot.id;
			// }
		}
		else {
			uni.showToast({ title: '仓库加载失败', icon: 'none' });
		}
	}
	// 仓库列表确认
	const depotConfirm = (e : any[]) => {
		depotName.value = e[0].label;
		depotId.value = e[0].value;
	}


	const StockWarningList = ref<Array>([]);
	const searchname = ref<string>('');
	const loadgetStockWarning = async () => {
		let params = {
			currentPage: current.value,
			pageSize: pageSize.value,
			materialParam: '',
			mpList: '扩展1,扩展2,扩展3'
		}
		if (searchname.value) {
			params.materialParam = searchname.value;
		}
		if (depotId.value) {
			params.materialParam = depotId.value;
		}
		const res = await getStockWarning(params)
		if (res && res.code === 200) {
			listTotal.value = res.data.total
			StockWarningList.value = res.data.rows
			if (listTotal.value == 0) {
				emptyShow.value = true
				listTotal.value = 1

			}
			else { emptyShow.value = false }
		}
		else {
			uni.showToast({ title: '数据加载失败', icon: 'none' });
		}
	}

	//分页切换
	const current = ref<number>(1);
	const pageSize = ref<number>(20);
	const listTotal = ref<number>(1);
	function handleChange(val : PaginationChangePayload) {
		if (val.type === 'next') {
			current.value = current.value
		}
		else {
			current.value = current.value
		}
		loadgetStockWarning();
	}

	onMounted(async () => {
		await getdepotlList();
		await loadgetStockWarning();

	})
</script>

<style lang="scss">
	.goods-row-coll {
		border-radius: 8rpx;
		width: calc(100% - 32rpx);
		//margin: 5rpx 10rpx 10rpx 10rpx;
	}

	.sticky {
		text-align: center;
		padding: 10rpx 10rpx 10rpx 10rpx;
		background: $u-bg-color;
	}

	.good-item {
		background: rgba(var(--u-type-primary-rgb), 0.05);
		border: 1px solid rgba(var(--u-type-primary-rgb), 0.2);
		border-radius: 8rpx;
		width: calc(100% - 30rpx);
		margin: 10rpx 10rpx 20rpx;
	}

	.goods-row {
		display: flex;
		margin-bottom: 5rpx;
		line-height: 1.5;
		flex-wrap: wrap;
	}

	.label {
		font-size: 28rpx;
		color: $u-type-primary;
		width: 220rpx;
		text-align: right;
		padding-right: 10rpx;
		//border: solid 1px #ffffff;
	}

	.value {
		flex: 1;
		min-width: calc(40% - 240rpx);
		word-break: break-all;
		font-size: 28rpx;
		color: $u-content-color;
	}

	.name {
		font-weight: bold;
		font-size: 30rpx;
	}

	.pagination-fixed {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: $u-bg-color;
		padding: 10rpx 50rpx;
		///border-top: 1rpx solid #f5f5f5;
		z-index: 999;
	}

	.scrollviewpadding {
		padding-bottom: 40px;
		background: $u-bg-color;
		min-height: calc(100vh - 200rpx);
	}

	.navbar-right-icon {
		position: absolute;
		right: 20rpx;
		top: 50%;
		transform: translateY(-50%);
		z-index: 99;
	}

	.popup-title {
		margin-top: 45px;
		padding: 10rpx 20rpx;
	}

	// 新增：u-empty 全屏样式
	.u-empty-fullscreen {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		/* 背景色与页面保持一致，避免透明穿透 */
		background-color: $u-bg-color;
		z-index: 1;
		padding-top: var(--u-navbar-height, 88rpx);
		padding-bottom: 40px;
	}
</style>