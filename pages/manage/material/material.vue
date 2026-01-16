<template>
	<view>
		<u-navbar :is-back="true" :background="background" :title="title" back-icon-color="#ffffff"
			title-color="#ffffff">
			<view class="navbar-right-icon">
				<u-icon name='search' @click="popupShow = true" size="48rpx" label-pos="right"></u-icon>
			</view>
		</u-navbar>
		<u-popup v-model="popupShow" mode="right" width="600rpx" height="300px" border-radius="8">
			<view class="popup-title">
				<u-form label-width="130rpx">
					<u-form-item label="关键词："><u-input border="true" v-model="searchname"
							placeholder="请输入名称、条码、助记码查询" /></u-form-item>
					<!-- <u-form-item label="商品类型">
							<view>
								<u-input v-model="categoryName" type="select" @click="selectShow = true" />
								<u-input v-model="categoryId" />
								<u-select :list="list" v-model="selectShow" mode="mutil-column"
									@confirm="confirm"></u-select>
							</view>
						</u-form-item> -->
					<u-gap></u-gap>
					<u-button type="primary" @click="search()">搜索</u-button>
					<u-gap></u-gap>
					<u-button type="warning" @click="reset()">重置</u-button>
				</u-form>
			</view>
		</u-popup>
		<u-empty text="没有搜索结果" mode="search" margin-top="100" :show="emptyShow"
			style="width: 100%; height:900rpx;"></u-empty>
		<scroll-view class="scrollviewpadding">
			<view v-for="(good, index) in materialList" :key="good.id || index">
				<view class="good-item" style="min-height: 80rpx;">
					<u-row gutter="10">
						<u-col span="12">
							<u-collapse :head-style="headStyle">
								<u-collapse-item :title="good.name">
									<view class="goods-row-coll">
										<text class="label">名称：</text>
										<text class="value">{{ good.name }}</text>
									</view>
									<view class="goods-row-coll">
										<text class="label">采购价：</text>
										<text style="color: red; font-size: 36rpx;font-weight: bold;">{{
											good.purchaseDecimal }}</text>
									</view>
									<u-line :color="$u.color.primary"></u-line>
								</u-collapse-item>
							</u-collapse>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">品牌：</text>
								<text class="value">{{ good.brand || '-' }}</text>
								<text class="label">商品类别：</text>
								<text class="value">{{ good.categoryName || '-' }}</text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">销售价：</text>
								<text class="value">{{ good.wholesaleDecimal || '-' }}</text>
								<text class="label">零售价：</text>
								<text class="value">{{ good.commodityDecimal || '-' }}</text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">商品条码：</text>
								<text class="value">{{good.mBarCode || '-' }}</text>
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
	import { getMaterialList, getMaterialCategory } from '../../../api/api'
	import { Request, color, $u, useTheme } from 'uview-pro'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('商品信息')
	const background = reactive({
		backgroundColor: ""
	})
	const updateNavbarBackground = () => {
		background.backgroundColor = $u.color.primary;
	};
	const popupShow = ref<boolean>(false)
	const emptyShow = ref<boolean>(false)

	const headStyle = reactive({
		fontSize: '28rpx',
		lineHeight: '32rpx',
		color: $u.color.primary,
		fontWeight: 'bold'
	})

	const uFormRef = ref();
	const form = reactive({
		name: '',
		category: ''
	});

	function search() {
		popupShow.value = false;
		loadGetMaterialList();
	}
	function reset() {
		searchname.value = '';
		search();
	}


	//商品分类选择器
	const selectShow = ref<boolean>(false)
	const categoryName = ref<string>('')
	const categoryId = ref<string>('')

	//加载商品列表
	const materialList = ref<Array>([]);
	const searchname = ref<string>('');
	const loadGetMaterialList = async () => {
		let params = {
			currentPage: current.value,
			pageSize: pageSize.value,
			search: JSON.stringify({
				materialParam: searchname.value
			})
		}
		const res = await getMaterialList(params)
		if (res && res.code === 200) {
			listTotal.value = res.data.total
			materialList.value = res.data.rows
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
		loadGetMaterialList();
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
	onMounted(async () => {
		await loadGetMaterialList();
	})
</script>

<style lang="scss">
	.goods-row-coll {
		border-radius: 8rpx;
		width: calc(100% - 32rpx);
		margin: 10rpx 10rpx 10rpx 40rpx;
	}

	.colllabel {
		font-size: 28rpx;
		width: 160rpx;
		text-align: right;
		padding-right: 10rpx;
	}

	.collvalue {
		flex: 1;
		min-width: calc(40% - 130rpx);
		word-break: break-all;
		font-size: 28rpx;
	}

	.good-item {
		background: rgba(var(--u-type-primary-rgb), 0.05);
		border: 1px solid rgba(var(--u-type-primary-rgb), 0.2);
		border-radius: 8rpx;
		width: calc(100% - 32rpx);
		padding: 16rpx;
		margin: 10rpx 10rpx 20rpx 20rpx;
	}

	.goods-row {
		display: flex;
		margin-bottom: 5rpx;
		line-height: 1.5;
		flex-wrap: wrap;
		;
	}

	.label {
		font-size: 28rpx;
		color: $u-type-primary;
		width: 160rpx;
		text-align: right;
		padding-right: 10rpx;
		//border: solid 1px #ffffff;
	}

	.value {
		flex: 1;
		min-width: calc(40% - 130rpx);
		word-break: break-all;
		font-size: 28rpx;
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
		padding: 10rpx 50rpx;
		///border-top: 1rpx solid #f5f5f5;
		z-index: 999;
		background-color: $u-bg-color;
	}

	.scrollviewpadding {
		padding-bottom: 40px;
		background: $u-bg-color;
	}

	.navbar-right-icon {
		position: absolute;
		right: 20rpx;
		top: 50%;
		transform: translateY(-50%);
		z-index: 99;
		color: #ffffff;
	}

	.popup-title {
		margin-top: 45px;
		padding: 10rpx 20rpx;
	}
</style>