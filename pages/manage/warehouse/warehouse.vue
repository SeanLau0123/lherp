<!-- 资料-仓库信息 -->
<template>
	<view style="height: 100vh;">
		<u-navbar :is-back="true" :title="title" :background="background" back-icon-color="#ffffff" title-color	="#ffffff">
			<view class="navbar-right-icon">
				<u-icon name='search' @click="popupShow = true" size="48rpx" label-pos="right"></u-icon>
			</view>
		</u-navbar>
		<scroll-view class="scrollviewpadding">
			<u-popup v-model="popupShow" mode="right" width="600rpx" height="300px" border-radius="14">
				<view class="popup-title">
					<u-form label-width="160rpx">
						<u-form-item label="仓库名称："><u-input v-model="name" placeholder="请输入名称查询" /></u-form-item>
						<u-form-item label="备注："><u-input v-model="remark" placeholder="请输入备注查询"/></u-form-item>
						<u-gap></u-gap>
						<u-button type="primary" @click="search()">搜索</u-button>
						<u-gap></u-gap>
						<u-button @click="reset()">重置</u-button>
					</u-form>
				</view>
			</u-popup>
			<view v-for="(warehouse, index) in wareHouseList" :key="warehouse.id || index">
				<view class="good-item" style="min-height: 80rpx;">
					<u-row gutter="10">
						<u-col span="12">
							<u-collapse :head-style="headStyle">
								<u-collapse-item :title="warehouse.name">
									<view class="goods-row">
										<text class="label">仓储费：</text>
										<text class="value">{{ warehouse.warehousing || '0' }}</text>
										<text class="label">搬运费：</text>
										<text class="value">{{warehouse.truckage || '0' }}</text>
									</view>
									<u-line :color="$u.color.primary"></u-line>
								</u-collapse-item>
							</u-collapse>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">仓库地址：</text>
								<text class="value">{{warehouse.address || '-' }}</text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">负责人：</text>
								<text class="value">{{ warehouse.principalName || '-' }}</text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">备注：</text>
								<text class="value">{{warehouse.remark || '-' }}</text>
							</view>
						</u-col>
					</u-row>
				</view>
			</view>
		</scroll-view>
		<u-empty text="没有搜索结果" mode="search" :show="emptyShow" class="u-empty-fullscreen"></u-empty>
		<view class="pagination-fixed">
			<u-pagination v-model="current" :total="listTotal" :pageSize="pageSize"
				@change="handleChange"></u-pagination>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { ref, reactive, onMounted,watch } from 'vue'
	import { Request, color, $u, useTheme } from 'uview-pro'
	const {currentTheme,themes,darkMode} = useTheme();
	import { getWareHouselList } from '../../../api/api'
	const title = ref<string>('仓库信息')
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
		color: $u.color.primary,
		lineHeight: '32rpx',
		fontWeight: 'bold'
	})

	const uFormRef = ref();

	function search() {
		popupShow.value = false;
		loadGetWareHouselList();
	}
	function reset() {
		name.value = '';
		remark.value = '';
		search();
	}


	//商品分类选择器
	const selectShow = ref<boolean>(false)
	const categoryName = ref<string>('')
	const categoryId = ref<string>('')

	//加载仓库列表
	const wareHouseList = ref<Array>([]);
	const name = ref<string>('');
	const remark = ref<string>('');
	const loadGetWareHouselList = async () => {
		let params = {
			search: '{"name":"' + name.value + '","remark":"' + remark.value + '"}',
		}
		const res = await getWareHouselList(params)
		if (res && res.code === 200) {
			listTotal.value = res.data.total
			wareHouseList.value = res.data.rows
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
	const pageSize = ref<number>(10);
	const listTotal = ref<number>(1);
	function handleChange(val : PaginationChangePayload) {
		if (val.type === 'next') {
			current.value = current.value
		}
		else {
			current.value = current.value
		}
		loadGetWareHouselList();
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
		await loadGetWareHouselList();
	})
</script>

<style lang="scss">
	.goods-row-coll {
		border-radius: 6rpx;
		width: calc(100% - 32rpx);
		margin: 10rpx 10rpx 10rpx 40rpx;
	}

	.colllabel {
		font-size: 28rpx;
		width: 160rpx;
		text-align: right;
	}

	.collvalue {
		flex: 1;
		min-width: calc(40% - 130rpx);
		word-break: break-all;
		font-size: 28rpx;
	}

	.good-item {
		background: rgba(var(--u-type-primary-rgb), 0.1);
		border: 1px solid rgba(var(--u-type-primary-rgb), 0.2);
		border-radius: 8rpx;
		width: calc(100% - 32rpx);
		margin: 10rpx 12rpx 20rpx;
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
	}

	.value {
		color: $u-main-color;
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
		background-color: $u-bg-color;
		///border-top: 1rpx solid #f5f5f5;
		z-index: 999;
	}

	.scrollviewpadding {
		padding-bottom: 40px;
		background: $u-bg-color;
		height: calc(100% - 120px);
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
</style>