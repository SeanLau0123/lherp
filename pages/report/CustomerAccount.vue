<!-- 报表-客户对账 -->
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
				<u-text :bold="true" text="期初应收："></u-text>
				<u-text :bold="true" mode="price" :text="firstMoney"></u-text>
				<u-text :bold="true" text="，期末应收："></u-text>
				<u-text :bold="true" mode="price" :text="lastMoney"></u-text>
			</view>
		</u-sticky>
		<scroll-view class="scrollviewpadding">
			<u-popup v-model="popupShow" mode="right" width="600rpx" height="300px" border-radius="14">
				<view class="popup-title">
					<u-form label-width="160rpx">
						<u-form-item label-align="right" label="客户：">
							<u-input v-model="customerName" :type="type" placeholder="请选择客户"
								@click="customerShow = true" /></u-form-item>
						<u-select v-model="customerShow" :list="customerList" :default-value='customerId'
							@confirm="customerConfirm"></u-select>
						<u-form-item label-align="right" label="开始时间：">
							<u-input v-model="beginTime" :type="type" placeholder="请选择开始时间"
								@click="pickBeginDateShow = true" />
							<u-picker v-model="pickBeginDateShow" mode="time" :default-time="beginTime"
								@confirm="beginTimeConfirm"></u-picker>
						</u-form-item>
						<u-form-item label-align="right" label="结束时间：">
							<u-input v-model="endTime" :type="type" placeholder="请选择结束时间"
								@click="pickEndDateShow = true" />
							<u-picker v-model="pickEndDateShow" mode="time" :default-time="endTime"
								@confirm="endTimeConfirm"></u-picker>
						</u-form-item>
						<u-form-item label-align="right" label="欠款情况：">
							<u-input v-model="debType" :type="type" @click="debtShow = true" />
							<u-select v-model="debtShow" :list="debtList" :default-value='debtselected'
								@confirm="debTypeConfirm"></u-select>
						</u-form-item>
						<u-gap></u-gap>
						<u-button type="primary" @click="search()">搜索</u-button>
						<u-gap></u-gap>
						<u-button @click="reset()">重置</u-button>
					</u-form>
				</view>
			</u-popup>
			<view v-for="(item, index) in customerAccountList" :key="item.id || index">
				<view class="good-item" style="min-height: 80rpx;">
					<u-row gutter="10">
						<u-col span="12">
							<u-collapse :head-style="headStyle">
								<u-collapse-item :title="item.supplier">
									<view class="goods-row">
										<text class="label">联系人:</text>
										<u-text :text="item.contacts"></u-text>
										<text class="label">联系方式：</text>
										<u-text :text="item.telephone"></u-text>
									</view>
									<u-line :color="$u.color.primary"></u-line>
								</u-collapse-item>
							</u-collapse>
						</u-col>
						<u-col span="6">
							<view class="goods-row">
								<text class="label">期初应收：</text>
								<u-text mode="price" :text="item.beginNeed"></u-text>
							</view>
						</u-col>
						<u-col span="6">
							<view class="goods-row">
								<text class="label">本期欠款：</text>
								<u-text mode="price" :text="item.debtMoney"></u-text>
							</view>
						</u-col>
						<u-col span="6">
							<view class="goods-row">
								<text class="label">本期收款：</text>
								<u-text mode="price" :text="item.backMoney"></u-text>
							</view>
						</u-col>
						<u-col span="6">
							<view class="goods-row">
								<text class="label">期末应收：</text>
								<u-text mode="price" :text="item.allNeed"></u-text>
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
	import { getStatementAccountList, getAllListBySelect } from '@/api/api.js'
	import { $u, useTheme } from 'uview-pro'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('客户对账')
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
		loadCustomerAccountList();
	}
	function reset() {
		searchname.value = '';
		initDefaultDates();
		search();
	}


	//选择器
	const selectShow = ref<boolean>(false)
	const depotId = ref("");
	const firstMoney = ref(0);
	const lastMoney = ref(0);

	const beginTime = ref("");
	const endTime = ref("");
	const pickBeginDateShow = ref<boolean>(false)
	const pickEndDateShow = ref<boolean>(false)
	const initDefaultDates = () => {
		const today = new Date();
		const threeMonthsAgo = new Date(today);
		threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
		beginTime.value = threeMonthsAgo.toISOString().split('T')[0];
		endTime.value = new Date().toISOString().split('T')[0];
		debtselected.value = [1];
		debType.value = '有欠款';
		customerName.value = "";
		customerId.value = [];

	};
	// 定义确认回调函数
	const beginTimeConfirm = (e : any[]) => {
		// 注意返回值为一个数组，单列时取数组的第一个元素即可(只有一个元素)
		const formattedDate = `${e.year}-${e.month}-${e.day}`;
		beginTime.value = formattedDate
	}
	// 定义确认回调函数
	const endTimeConfirm = (e : any[]) => {
		// 注意返回值为一个数组，单列时取数组的第一个元素即可(只有一个元素)
		const formattedDate = `${e.year}-${e.month}-${e.day}`;
		endTime.value = formattedDate
	}

	const debtShow = ref<boolean>(false)
	const debType = ref<string>('');
	const debtselected = ref<string[]>([]);
	interface ListItem {
		value : string
		label : string
	}
	const debtList = ref<ListItem[]>([
		{ label: '无欠款', value: '0' }, 
		{ label: '有欠款', value: '1' }])
	// 定义确认回调函数
	const debTypeConfirm = (e : any[]) => {
		debType.value = e[0].label;
		debtselected.value = [e[0].value];
	}

	//加载客户列表
	const customerShow = ref<boolean>(false)
	const customerName = ref<string>('');
	const customerId = ref<string[]>([]);
	const customerList = ref<ListItem[]>([]);
	const loadGetCustomerlList = async () => {
		let params = {limit: 1}
		const res = await getAllListBySelect(params)
		if (res) {
			customerList.value = res.map(item => ({
				value: item.id.toString() || '',
				label: item.supplier || ''
			}));
		}
		else {
			uni.showToast({ title: '客户加载失败', icon: 'none' });
		}
	}
	// 定义确认回调函数
	const customerConfirm = (e : any[]) => {
		customerName.value = e[0].label;
		customerId.value = [e[0].value];
	}

	const customerAccountList = ref<Array>([]);
	const searchname = ref<string>('');
	const loadCustomerAccountList = async () => {
		let params = {
			currentPage: current.value,
			pageSize: pageSize.value,
			supplierType: '客户',
			beginTime: beginTime.value,
			endTime: endTime.value,
			hasDebt: debtselected.value
		}

		if (customerId.value) {
			params.organId = customerId.value;
		}
		// if (depotId.value) {
		// 	params.depotId = depotId.value;
		// }
		const res = await getStatementAccountList(params)
		if (res && res.code === 200) {
			listTotal.value = res.data.total
			customerAccountList.value = res.data.rows
			firstMoney.value = res.data.firstMoney
			lastMoney.value = res.data.lastMoney
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
		loadCustomerAccountList();
	}

	onMounted(async () => {
		initDefaultDates();
		loadGetCustomerlList();
		loadCustomerAccountList();


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
		width: calc(100% - 30rpx);
		margin: 10rpx 10rpx 20rpx;
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