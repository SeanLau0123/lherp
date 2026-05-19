<!-- 报表-查看账户流水- -->
<template>
	<view style="min-height: 100vh;">
		<u-navbar :is-back="true" :title="title" title-width="500" title-color='#ffffff' back-icon-color='#ffffff'
			:background="background">
			<view class="navbar-right-icon">
				<u-icon name='search' @click="popupShow = true" color="#ffffff" size="48rpx" label-pos="right"></u-icon>
			</view>
		</u-navbar>
		<scroll-view class="scrollviewpadding">
			<u-popup v-model="popupShow" mode="right" width="600rpx" height="300px" border-radius="14">
				<view class="popup-title">
					<u-form label-width="160rpx">
						<u-form-item label="单据编号：">
							<u-input v-model="number" placeholder="请输入单据编号" /></u-form-item>
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
			<view style="min-height: 80rpx;" v-for="(account, index) in DetailList" :key="account.depotId || index">
				<view class="good-item">
					<u-row gutter="10">
						<u-col span="12">
							<u-collapse :head-style="headStyle">
								<u-collapse-item :title="account.type">
									<view class="goods-row">
										<text class="label">单据编号：</text>
										<text class="value">{{ account.number }}</text>
									</view>
									<view class="goods-row">
										<text class="label">单位信息：</text>
										<text class="value">{{ account.supplierName }}</text>
									</view>
									<u-line :color="$u.color.primary"></u-line>
								</u-collapse-item>
							</u-collapse>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">金额：</text>
								<u-text mode="price" :text="account.changeAmount"></u-text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">余额：</text>
								<u-text mode="price" :text="account.balance"></u-text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">日期：</text>
								<u-text :text="account.operTime"></u-text>
							</view>
						</u-col>
					</u-row>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, watch } from 'vue'
	import { onLoad } from '@dcloudio/uni-app';
	import { $u, useTheme } from 'uview-pro'
	import { getAccountInOutList } from '@/api/api.js'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('账户流水')
	const background = reactive({
		backgroundColor: ""
	})
	const updateNavbarBackground = () => {
		background.backgroundColor = $u.color.primary;
	};
	const headStyle = reactive({
		fontSize: '28rpx',
		color: $u.color.primary,
		lineHeight: '32rpx',
		padding: '20rpx'
	})
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
	const pickBeginDateShow = ref<boolean>(false)
	const pickEndDateShow = ref<boolean>(false)
	const type = ref<string>('select')

	const beginTime = ref("");
	const endTime = ref("");
	const initDefaultDates = () => {
		const today = new Date();
		const threeMonthsAgo = new Date(today);
		threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
		beginTime.value = threeMonthsAgo.toISOString().split('T')[0];
		endTime.value = new Date().toISOString().split('T')[0];
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

	const uFormRef = ref();
	const form = reactive({
		name: '',
		category: ''
	});

	function search() {
		popupShow.value = false;
		loadInOutList();
	}
	function reset() {
		number.value = '';
		initDefaultDates();
		search();
	}
	//获取库存分布详情
	const show = ref<boolean>(true)
	const accountId = ref<string>('')

	const accountName = ref<string>('');

	const number = ref<string>('');
	const DetailList = ref<any>('');
	const total = ref<number>(1);
	const loadInOutList = async () => {
		let params = {
			initialAmount: '0',
			accountId: accountId.value || '',
			number: number.value,
			beginTime: beginTime.value,
			endTime: endTime.value,
			currentPage: 1,
			pageSize: 10
		}
		const res = await getAccountInOutList(params)
		if (res && res.code === 200) {
			total.value = res.data.total
			DetailList.value = res.data.rows
		}
		else {
			uni.showToast({ title: '数据加载失败', icon: 'none' });
		}
	}

	onLoad((options) => {
		if (options && options.id) {
			accountId.value = options.id;
			accountName.value = options.name;
			if (accountName.value) {
				title.value = `账户流水-${accountName.value}`;
			}
			loadInOutList();
		} else {
			console.warn("未接收到单号参数");
		}
	});
	onMounted(async () => {
		initDefaultDates();
	})
</script>

<style lang="scss">
	.scrollviewpadding {
		min-height: calc(100% - 200rpx);
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
		width: 180rpx;
		text-align: right;
		padding-right: 10rpx;
		//border: solid 1px #ffffff;
	}

	.popup-title {
		margin-top: 45px;
		padding: 10rpx 20rpx;
		text-align: right;
	}

	.value {
		flex: 1;
		//min-width: calc(40% - 200rpx);
		word-break: break-all;
		font-size: 28rpx;
		color: $u-content-color;
	}

	.navbar-right-icon {
		position: absolute;
		right: 20rpx;
		top: 50%;
		transform: translateY(-50%);
		z-index: 99;
	}
</style>