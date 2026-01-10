<template>
	<view>
		<u-navbar :is-back="true" :title="title" title-color='#ffffff' back-icon-color='#ffffff'
			:background="background">
		</u-navbar>
		<!-- 搜索与筛选区域 -->
		<u-sticky>
		<view style="padding: 0 16rpx;background-color: aqua;">
			<u-row gutter="11">
				<u-col span="11">
					<u-search placeholder="请输入名称、条码、助记码等查询" shape="round" :clearabled="true" :show-action="true"
						@custom="search" action-text="搜索" border-color="#5500ff" v-model="searchname"
						style="margin: 5px 0 5px 0;"></u-search></u-col>
				<u-col span="1">
					<u-icon name='list' @click="show = true" color="#2979ff" size="48rpx"></u-icon></u-col>
			</u-row>
			<u-popup v-model="show" mode="right" width="500rpx" height="600px" border-radius="14">
				<view>6666666</view>
			</u-popup>
		</view>
		<u-empty text="没有搜索结果" mode="search" margin-top="100" :show="emptyShow" style="width: 100%; height:900rpx;"></u-empty>
		</u-sticky>
		<view v-for="(good, index) in materialList" :key="good.id || index">
			<view class="good-item" style="min-height: 80rpx;">
				<u-row gutter="10">
					<u-col span="12">
						<view class="goods-row">
							<text class="label">名称：</text>
							<text class="value name">{{ good.name || '-' }}({{good.mBarCode}})</text>
						</view>
					</u-col>
					<u-col span="12">
						<view class="goods-row">
							<text class="label">单位：</text>
							<text class="value">{{ good.unit || '-' }}</text>
							<text class="label">类别：</text>
							<text class="value">{{ good.categoryName || '-'}}</text>
						</view>
					</u-col>
					<u-col span="12">
						<view class="goods-row">
							<text class="label">采购价：</text>
							<text class="value">{{ good.purchaseDecimal || '-' }}</text>
							<text class="label">零售价：</text>
							<text class="value">{{ good.commodityDecimal || '-' }}</text>
						</view>
					</u-col>
					<u-col span="6">
						<view class="goods-row">
							<text class="label">销售价：</text>
							<text class="value">{{ good.wholesaleDecimal || '-' }}</text>
						</view>
					</u-col>
					<u-col span="6">
						<view class="goods-row">
							<text class="label">最低售价：</text>
							<text class="value">{{good.lowDecimal || '-' }}</text>
						</view>
					</u-col>
					<u-col span="12">
						<view class="goods-row">
							<text class="label">库存数量：</text>
							<text class="value" style="font-size: 32rpx; font-weight: bold;">{{good.stock || '-' }}</text>
						</view>
					</u-col>
				</u-row>
			</view>
		</view>
		<view class="pagination-fixed">
			<u-pagination v-model="current" :total="listTotal" :pageSize="pageSize" @change="handleChange"></u-pagination>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { ref, reactive, onMounted } from 'vue'
	import { getMaterialList } from '../../../api/api'
	const title = ref<string>('商品信息')
	const background = reactive({
		backgroundImage: "linear-gradient(45deg, #0081ff, #1cbbb4)"
	})
	const show = ref<boolean>(false)
	const emptyShow = ref<boolean>(false)
	function search() {
		loadGetMaterialList();
	}

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
			if (listTotal.value == 0) 
			{ emptyShow.value = true
			 listTotal.value=1}
			else { emptyShow.value = false }
		}
		else {
			uni.showToast({ title: '数据加载失败', icon: 'none' });
		}
	}

	//分页切换
	const current = ref<number>(1);
	const pageSize = ref<number>(10);
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



	onMounted(async () => {
		await loadGetMaterialList();
	})
</script>

<style lang="scss">
	.good-item {
		background: #ffffff;
		border-radius: 6rpx;
		width: calc(100% - 32rpx);
		margin-bottom: 20rpx;
		padding: 16rpx;
		margin: 10rpx 16rpx 20rpx;
	}

	.goods-row {
		display: flex;
		margin-bottom: 5rpx;
		line-height: 1.5;
		flex-wrap: wrap;
		color: #333;
	}

	.label {
		font-size: 28rpx;
		color: #928893;
		width: 160rpx;
		text-align: right;
		padding-right: 10rpx;
	}

	.value {
		color: #550000;
		flex: 1;
		min-width: calc(40% - 130rpx);
		word-break: break-all;
		font-size: 28rpx;
	}

	.name {
		font-weight: bold;
		font-size: 30rpx;
		color: #007aff;
	}
	
	.pagination-fixed {
	  position: fixed;
	  bottom: 0; 
	  left: 0;
	  right: 0; 
	  background-color: #ffffff;
	  padding: 10rpx 10rpx;
	  border-top: 1rpx solid #f5f5f5;
	  z-index: 999;
	}
</style>