<!-- 报表-收预付款-详情 -->
<template>
	<view style="min-height: 100vh;">
		<u-navbar :is-back="true" :title="title" title-color='#ffffff' back-icon-color='#ffffff'
			:background="background">
		</u-navbar>
		<!-- 订单表头 -->
		<view class="good-item">
			<u-row gutter="10">
				<u-col span="12">
					<view class="goods-row">
						<text class="label">付款会员：</text>
						<u-text :text="AdvanceInList.organName"></u-text>
					</view>
				</u-col>
				<u-col span="12">
					<view class="goods-row">
						<text class="label">财务人员：</text>
						<u-text :text="AdvanceInList.handsPersonName"></u-text>
					</view>
				</u-col>
				<u-col span="12">
					<view class="goods-row">
						<text class="label">单据日期：</text>
						<u-text>{{ $u.timeFormat(AdvanceInList.billTimeStr, 'yyyy-mm-dd hh:MM:ss') }}</u-text>
					</view>
				</u-col>
				<u-col span="12">
					<view class="goods-row">
						<text class="label">单据编号：</text>
						<u-text :text="AdvanceInList.billNo"></u-text>
					</view>
				</u-col>
			</u-row>
		</view>
		<view>
			<scroll-view scroll-x="true" class="scrollviewpadding">
				<view class="good-item" style="min-height: 80rpx;">
					<u-collapse :head-style="headStyle">
						<u-collapse-item :title="`单据行明细 - 共 ${listTotal} 行`">
							<view v-for="(good, index) in accountDetail" :key="good.accountId || index">
								<template v-if="good.accountId">
									<view class="good-item" style="min-height: 80rpx;">
										<u-row gutter="10">
											<u-col span="11">
												<view class="goods-row">
													<text class="label">账户名称：</text>
													<text class="value">{{ good.accountName || '-' }}</text>
												</view>
											</u-col>
											<u-col span="12">
												<view class="goods-row">
													<text class="label">金额：</text>
													<u-text mode="price" :text="good.eachAmount"></u-text>
												</view>
											</u-col>
											<u-col span="12">
												<view class="goods-row">
													<text class="label">备注：</text>
													<text class="value">{{good.remark || '-' }}</text>
												</view>
											</u-col>
										</u-row>
									</view>
								</template>
							</view>
						</u-collapse-item>
					</u-collapse>
				</view>
			</scroll-view>
		</view>
		<!-- 订单表尾 -->
		<view class="good-item">
			<u-row gutter="10">
				<template v-if="AdvanceInList.remark">
					<u-col span="12">
						<view class="goods-row">
							<text class="label">备注：</text>
							<u-text :text="AdvanceInList.remark"></u-text>
						</view>
					</u-col>
				</template>
				<u-col span="12">
					<view class="goods-row">
						<text class="label">合计金额：</text>
						<u-text mode="price" :text="AdvanceInList.totalPrice"></u-text>
						<text class="label">收款金额：</text>
						<u-text mode="price" :text="AdvanceInList.changeAmount"></u-text>
					</view>
				</u-col>
			</u-row>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, watch } from 'vue'
	import { onLoad } from '@dcloudio/uni-app';
	import { $u, useTheme } from 'uview-pro'
	import { getFinancialDetailByNumber, getAccountListById, getMaterialListByNumber } from '@/api/api.js'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('收预付款-详情')
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

	//获取收预付款主表
	const number = ref<string>('');
	const billId = ref<string>('');
	const AdvanceInList = ref<any>('');
	const loadAdvanceInDetailById = async () => {
		const res = await getFinancialDetailByNumber(number.value)
		if (res && res.code === 200) {
			AdvanceInList.value = res.data
			billId.value = res.data.id
			getAccountDetail()
		}
		else {
			uni.showToast({ title: '数据加载失败', icon: 'none' });
		}
	}

	// 加载账户详情数据
	const accountDetail = ref<Array>([]);
	const listTotal = ref<string>('0')
	const getAccountDetail = async () => {
		const res = await getAccountListById(billId.value)
		if (res && res.code === 200) {
			accountDetail.value = res.data.rows
			listTotal.value = res.data.total
		}
		else {
			uni.showToast({ title: '账户加载失败', icon: 'none' });
		}
	}
	onLoad((options) => {
		if (options && options.number) {
			number.value = options.number;
			loadAdvanceInDetailById();
		} else {
			console.log("未接收到单号参数");
		}
	});
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
		color: $u-content-color;
	}
</style>