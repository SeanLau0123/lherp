<!-- 报表-账户统计 -->
<template>
	<view style="height: 100vh;">
		<u-navbar :is-back="true" :title="title" title-color='#ffffff' back-icon-color='#ffffff'
			:background="background">
			<view class="navbar-right-icon">
				<u-icon name='search' @click="popupShow = true" color="#ffffff" size="48rpx" label-pos="right"></u-icon>
			</view>
		</u-navbar>
		<u-empty text="没有搜索结果" mode="search" :show="emptyShow" class="u-empty-fullscreen"></u-empty>
		<u-sticky>
			<view class="sticky">
				<u-text :bold="true" text="本月发生总额："></u-text>
				<u-text :bold="true" mode="price" :text="accountStatistics.allMonthAmount"></u-text>
				<u-text :bold="true" text="，当前总余额："></u-text>
				<u-text :bold="true" mode="price" :text="accountStatistics.allCurrentAmount"></u-text>
			</view>
		</u-sticky>
		<scroll-view class="scrollviewpadding">
			<u-popup v-model="popupShow" mode="right" width="600rpx" height="300px" border-radius="14">
				<view class="popup-title">
					<u-form label-width="160rpx">
						<u-form-item label-align="right" label="账户名称：">
							<u-input v-model="accountName" placeholder="请输入账户名称" />
						</u-form-item>
						<u-form-item label-align="right" label="编号：">
							<u-input v-model="accountNo" placeholder="请输入编号" />
						</u-form-item>
						<u-gap></u-gap>
						<u-button type="primary" @click="search()">搜索</u-button>
						<u-gap></u-gap>
						<u-button @click="reset()">重置</u-button>
					</u-form>
				</view>
			</u-popup>
			<view v-for="(item, index) in accountList" :key="item.id || index">
				<view class="good-item" style="min-height: 80rpx;">
					<u-row gutter="10">
						<u-col span="12">
							<u-collapse :head-style="headStyle">
								<u-collapse-item :title="item.name">
									<view class="goods-row">
										<text class="label">编号:</text>
										<u-text :text="item.serialNo"></u-text>
										<text class="label">当前余额：</text>
										<u-text mode="price" :text="item.currentAmount"></u-text>
									</view>
									<u-line :color="$u.color.primary"></u-line>
								</u-collapse-item>
							</u-collapse>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">期初金额：</text>
								<u-text mode="price" :text="item.initialAmount"></u-text>
								<text class="label">本月金额：</text>
								<u-text mode="price" :text="item.thisMonthAmount"></u-text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">备注：</text>
								<u-text :text="item.remark"></u-text>
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
	import { getAccountList, getAccountListStatistics } from '@/api/api.js'
	import { $u, useTheme } from 'uview-pro'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('账户统计')
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
		fontWeight: 'bold',
		paddingLeft:"10rpx"
	})

	function search() {
		popupShow.value = false;
		loadgetAccountList();
	}
	function reset() {
		accountName.value = '';
		accountNo.value = '';
		search();
	}

	const accountList = ref<Array>([]);
	const accountStatistics = ref<Array>([]);
	const accountName = ref<string>('');
	const accountNo = ref<string>('');
	const loadgetAccountList = async () => {
		let params = {
			currentPage: current.value,
			pageSize: pageSize.value,
			name: '',
			serialNo: ''
		}
		if (accountName.value) {
			params.name = accountName.value;
		}
		if (accountNo.value) {
			params.serialNo = accountNo.value;
		}
		const res = await getAccountList(params)
		if (res && res.code === 200) {
			listTotal.value = res.data.total
			accountList.value = res.data.rows
			if (listTotal.value == 0) {
				emptyShow.value = true
				listTotal.value = 1

			}
			else { emptyShow.value = false }
		}
		else {
			uni.showToast({ title: '数据加载失败', icon: 'none' });
		}

		const resdata = await getAccountListStatistics(params)
		if (resdata && resdata.code === 200) {
			accountStatistics.value = resdata.data
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
		loadgetAccountList();
	}

	onMounted(async () => {
		loadgetAccountList();
	})
</script>

<style lang="scss">
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
		margin-bottom: 10rpx;
		line-height: 1.5;
		flex-wrap: wrap;
	}

	.label {
		font-size: 28rpx;
		color: $u-type-primary;
		text-align: right;
		width: 170rpx;
		//padding-right: 10rpx;
		//border: solid 1px #ffffff;
	}

	.value {
		flex: 1;
		//min-width: calc(40% - 200rpx);
		word-break: break-all;
		font-size: 28rpx;
		color: $uni-text-color;
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
		height: calc(100% - 200rpx);
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
		text-align: right;
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