<!-- 销售管理-销售出库 -->
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
			<u-popup v-model="popupShow" mode="right" width="600rpx" height="300px" border-radius="8">
				<view class="popup-title">
					<u-form label-width="160rpx">
						<u-form-item label="商品信息：">
							<u-input v-model="billno" placeholder="请输入名称、条码、助记码查询" /></u-form-item>
						<u-form-item label="开始时间：">
							<u-input v-model="beginTime" :type="type" placeholder="请选择开始时间"
								@click="pickBeginDateShow = true" />
							<u-picker v-model="pickBeginDateShow" mode="time" :default-time="beginTime"
								@confirm="beginTimeConfirm"></u-picker>
						</u-form-item>
						<u-form-item label="结束时间：">
							<u-input v-model="endTime" :type="type" placeholder="请选择结束时间"
								@click="pickEndDateShow = true" />
							<u-picker v-model="pickEndDateShow" mode="time" :default-time="endTime"
								@confirm="endTimeConfirm"></u-picker></u-form-item>
						<u-gap></u-gap>
						<u-button type="primary" @click="search()">搜索</u-button>
						<u-gap></u-gap>
						<u-button @click="reset()">重置</u-button>
					</u-form>
				</view>
			</u-popup>
			<view v-for="(saleOut, index) in saleOutList" :key="saleOut.id || index">
				<view class="good-item">
					<u-row gutter="10">
						<u-col span="12">
							<u-collapse :head-style="headStyle">
								<u-collapse-item :title="`客户：${saleOut.organName}`">
									<u-col span="12">
										<view class="goods-row">
											<text class="label">单据编号：</text>
											<u-text type="primary" decoration="underline"
												:text="(saleOut.number || '') + (saleOut.linkNumber ? '[订]' : '') + (saleOut.hasBackFlag ? '[退]' : '')"
												@click="lookNumberDetail(saleOut.number)" </u-text>
										</view>
									</u-col>
									<u-col span="12">
										<view class="goods-row">
											<text class="label">商品信息：</text>
											<u-text :text="saleOut.materialsList"></u-text>
										</view>
									</u-col>
									<u-col span="12">
										<view class="goods-row">
											<text class="label">单据日期：</text>
											<u-text>{{ $u.timeFormat(saleOut.billTime, 'yyyy-mm-dd hh:MM:ss') }}</u-text>
										</view>
									</u-col>
									<u-line :color="$u.color.primary"></u-line>
								</u-collapse-item>
							</u-collapse>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">操作员：</text>
								<u-text :text="saleOut.userName"></u-text>
								<text class="label">数量：</text>
								<u-text :text="saleOut.materialCount"></u-text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">金额合计：</text>
								<u-text mode="price" :text="saleOut.totalPrice"></u-text>
								<text class="label">含税合计：</text>
								<u-text mode="price" :text="saleOut.discountLastMoney"></u-text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">待收金额：</text>
								<u-text mode="price"
									:text="saleOut.discountLastMoney + saleOut.otherMoney - saleOut.deposit"></u-text>
								<text class="label">本次收款：</text>
								<u-text mode="price" :text="saleOut.changeAmount"></u-text>
							</view>
						</u-col>
						<u-col span="9">
							<view class="goods-row">
								<text class="label">本次欠款：</text>
								<u-text mode="price" :text="saleOut.debt"></u-text>
							</view>
						</u-col>
						<u-col span="3">
							<view class="goods-row status-right-align">
								<text v-if="saleOut.status == '0'"
									:style="{color: $u.color.warning,fontSize: '32rpx',fontWeight: 'bold'}">未审核</text>
								<text v-if="saleOut.status == '1'"
									:style="{color: $u.color.success,fontSize: '32rpx',fontWeight: 'bold'}">已审核</text>
							</view>
						</u-col>
					</u-row>
				</view>
			</view>
		</scroll-view>
		<u-fab :position="'right-bottom'" :gap="{ top: 20, right: 20, bottom: 50, left: 20 }" :draggable="true"
			@trigger="onBtnClick">
		</u-fab>
		<view class="pagination-fixed">
			<u-pagination v-model="current" :total="listTotal" :pageSize="pageSize"
				@change="handleChange"></u-pagination>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { ref, reactive, onMounted, watch } from 'vue'
	import { getDepotInfo } from '@/api/api.js'
	import { $u, useTheme } from 'uview-pro'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('销售出库')
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

	function lookNumberDetail(number) {
		uni.$u.route('pages/openorder/OutboundOrder/OutboundOrderDetail',
			{ number: number });
	}
	const popupShow = ref<boolean>(false)
	const emptyShow = ref<boolean>(false)
	const pickBeginDateShow = ref<boolean>(false)
	const pickEndDateShow = ref<boolean>(false)
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
		loadSaleOutList();
	}
	function reset() {
		billno.value = '';
		initDefaultDates();
		search();
	}


	//商品分类选择器
	const selectShow = ref<boolean>(false)
	const categoryName = ref<string>('')
	const categoryId = ref<string>('')
	const materialParam = ref("");
	const linkNumber = ref("");
	const handsPersonId = ref("");
	const status = ref("");
	const remark = ref("");
	const realityPriceTotal = ref(0);

	const beginTime = ref("");
	const endTime = ref("");
	const formatLocalDate = (date) => {
		const year = date.getFullYear(); 
		const month = String(date.getMonth() + 1).padStart(2, '0'); 
		const day = String(date.getDate()).padStart(2, '0'); 
		return `${year}-${month}-${day}`;
	}
	
	const initDefaultDates = () => {
		const today = new Date();
		const threeMonthsAgo = new Date(today);
		threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
		beginTime.value = formatLocalDate(threeMonthsAgo);
		endTime.value = formatLocalDate(today);
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

	const saleOutList = ref<Array>([]);
	const billno = ref<string>('');
	const loadSaleOutList = async () => {
		let params = {
			currentPage: current.value,
			pageSize: pageSize.value,
			search: JSON.stringify({
				number: billno.value,
				type: '出库',
				subType: '销售',
				beginTime: beginTime.value,
				endTime: endTime.value,
				remark: remark.value
			})
		}
		if (materialParam.value) {
			params.search = materialParam.value;
		}
		if (linkNumber.value) {
			params.search = linkNumber.value;
		}
		// if (handsPersonId.value) {
		// 	params.search = handsPersonId.value;
		// }
		// if (status.value) {
		// 	params.search = status.value;
		// }
		const res = await getDepotInfo(params)
		if (res && res.code === 200) {
			listTotal.value = res.data.total
			saleOutList.value = res.data.rows
			realityPriceTotal.value = res.data.realityPriceTotal
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

	function onBtnClick() {
		uni.$u.route('pages/openorder/OutboundOrder/AddSaleOut');
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
		loadSaleOutList();
	}

	onMounted(async () => {
		initDefaultDates();
		loadSaleOutList();
	})
</script>

<style lang="scss">
	.goods-row-coll {
		border-radius: 8rpx;
		width: calc(100% - 32rpx);
		//margin: 5rpx 10rpx 10rpx 10rpx;
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

	.status-right-align {
		justify-content: flex-end;
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