<!-- 资料-客户信息 -->
<template>
	<view style="height: 100vh;">
		<u-navbar :is-back="true" :background="background" :title="title" back-icon-color="#ffffff"
			title-color="#ffffff">
			<view class="navbar-right-icon">
				<u-icon name='search' @click="popupShow = true" color="#ffffff" size="48rpx" label-pos="right"></u-icon>
			</view>
		</u-navbar>
		<scroll-view class="scrollviewpadding">
			<u-popup v-model="popupShow" mode="right" width="600rpx" height="300px" border-radius="14">
				<view class="popup-title">
					<u-form label-width="100rpx">
						<u-form-item label="名称："><u-input v-model="searchname" placeholder="请输入名称查询" /></u-form-item>
						<u-form-item label="编号：">	<u-input v-model="serialNo" placeholder="请输入编号查询" /></u-form-item>
						<u-form-item label="备注："><u-input v-model="remark" placeholder="请输入备注查询" /></u-form-item>
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
										<text class="label">是否启用：</text>
										<text v-if="item.enabled == '0'"
											style="color:red; font-size: 32rpx;font-weight: bold">禁用</text>
										<text v-if="item.enabled == '1'"
											style="color:green;font-size: 32rpx;font-weight: bold">启用</text>
										<text class="label">编号：</text>
										<text class="value">{{ item.id || '-' }}</text>
									</view>
									<u-line color="#ffffff"></u-line>
								</u-collapse-item>
							</u-collapse>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">类型：</text>
								<text class="value">{{ item.type || '-' }}</text>
								<text class="label">排序：</text>
								<text class="value">{{ item.sort || '-' }}</text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">备注：</text>
								<text class="value">{{item.remark || '-' }}</text>
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
	import { ref, reactive, onMounted, watch } from 'vue'
	import { getAccounts } from '../../../api/api'
	import { $u, useTheme } from 'uview-pro'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('账户管理')
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
	const headStyle = reactive({
		fontSize: '28rpx',
		color: $u.color.primary,
		lineHeight: '32rpx',
		fontWeight: 'bold',
		paddingLeft: '10rpx'
	})

	const uFormRef = ref();

	function search() {
		popupShow.value = false;
		loadGetaccountList();
	}
	function reset() {
		searchname.value = '';
		remark.value = '';
		serialNo.value='';
		search();
	}

	//加载结算账户列表
	const accountList = ref<Array>([]);
	const searchname = ref<string>('');
	const serialNo = ref<string>('');
	const remark = ref<string>('');
	
	const loadGetaccountList = async () => {
		let params = {
			currentPage: current.value,
			pageSize: pageSize.value,
			search: JSON.stringify({
				name: searchname.value,
				serialNo: serialNo.value,
				remark: remark.value
			})
		}
		const res = await getAccounts(params)
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
		loadGetaccountList();
	}

	onMounted(async () => {
		await loadGetaccountList();
	})
</script>

<style lang="scss">
	.goods-row-coll {
		border-radius: 8rpx;
		width: calc(100% - 32rpx);
		margin: 10rpx 0rpx 10rpx 10rpx;
	}

	.good-item {
		background: rgba(var(--u-type-primary-rgb), 0.15);
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
		/* 层级低于分页栏，不遮挡分页 */
		z-index: 1;
		/* 扣除 navbar 高度，避免内容被导航栏遮挡 */
		padding-top: var(--u-navbar-height, 88rpx);
		/* 扣除分页栏高度，避免内容被分页遮挡 */
		padding-bottom: 40px;
	}
</style>