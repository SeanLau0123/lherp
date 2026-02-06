<!-- 报表-采购入库-详情 -->
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
						<text class="label">供应商：</text>
						<u-text :text="InDetailList.organName"></u-text>
					</view>
				</u-col>
				<u-col span="12">
					<view class="goods-row">
						<text class="label">单据日期：</text>
						<u-text>{{ $u.timeFormat(InDetailList.operTime, 'yyyy-mm-dd hh:MM:ss') }}</u-text>
					</view>
				</u-col>
				<u-col span="12">
					<view class="goods-row">
						<text class="label">单据编号：</text>
						<u-text :text="InDetailList.number"></u-text>
					</view>
				</u-col>
				<u-col span="12">
					<view class="goods-row">
						<text class="label">关联订单：</text>
						<u-text :text="InDetailList.linkNumber"></u-text>
					</view>
				</u-col>
			</u-row>
		</view>
		<view>
			<scroll-view scroll-x="true" class="scrollviewpadding">
				<view class="good-item" style="min-height: 80rpx;">
					<u-collapse :head-style="headStyle">
						<u-collapse-item :title="`单据行明细 - 共 ${listTotal} 行`">
							<view v-for="(good, index) in GoodsDetail" :key="good.id || index">
								<template v-if="good.id">
									<view class="good-item" style="min-height: 80rpx;">
										<u-row gutter="10">
											<u-col span="1">
												<view class="goods-row">
													<text class="value">{{ index + 1 }}</text>
												</view>
											</u-col>
											<u-col span="11">
												<view class="goods-row">
													<text class="label">仓库名称：</text>
													<text class="value">{{ good.depotName }}</text>
												</view>
											</u-col>
											<u-col span="12">
												<view class="goods-row">
													<text class="label">条码：</text>
													<text class="value">{{ good.barCode || '-' }}</text>
												</view>
											</u-col>
											<u-col span="12">
												<view class="goods-row">
													<text class="label">名称：</text>
													<text class="value">{{ good.name || '-' }}</text>
												</view>
											</u-col>
											<u-col span="12">
												<view class="goods-row">
													<text class="label">库存：</text>
													<text class="value">{{ good.stock || '-' }}</text>
													<text class="label">数量：</text>
													<text class="value">{{good.operNumber || '-' }}</text>
												</view>
											</u-col>
											<u-col span="12">
												<view class="goods-row" v-if="good.enableSerialNumber === '1'">
													<text class="label">序列号：</text>
													<u-textarea v-model="good.snList" autoHeight :disabled="true" />
												</view>
											</u-col>
											<u-col span="12">
												<view class="goods-row">
													<text class="label">单价：</text>
													<text class="value">{{good.unitPrice || '-' }}</text>
													<text class="label">金额：</text>
													<text class="value">{{good.allPrice || '-' }}</text>
												</view>
											</u-col>
											<u-col span="12">
												<view class="goods-row">
													<text class="label">税额：</text>
													<text class="value">{{good.taxMoney || '-' }}</text>
													<text class="label">价税合计：</text>
													<text class="value">{{good.taxLastMoney || '-' }}</text>
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
								<template v-else>
									<view class="good-item">
										<u-row gutter="10">
											<u-col span="6">
												<view class="goods-row">
													<text class="label">总数：</text>
													<text class="value">{{ good.operNumber }}</text>
												</view>
											</u-col>
											<u-col span="6">
												<view class="goods-row">
													<text class="label">总金额：</text>
													<text class="value">{{ good.allPrice }}</text>
												</view>
											</u-col>
											<u-col span="6">
												<view class="goods-row">
													<text class="label">税额：</text>
													<text class="value">{{ good.taxMoney || '0' }}</text>
												</view>
											</u-col>
											<u-col span="6">
												<view class="goods-row">
													<text class="label">价税合计：</text>
													<text class="value">{{ good.taxLastMoney || '0' }}</text>
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
				<u-col span="6">
					<view class="goods-row">
						<text class="label">付款折扣：</text>
						<u-text :text="InDetailList.discountMoney"></u-text>
					</view>
				</u-col>
				<u-col span="6">
					<view class="goods-row">
						<text class="label">折后金额：</text>
						<u-text :text="InDetailList.discountLastMoney"></u-text>
					</view>
				</u-col>
				<u-col span="12">
					<view class="goods-row">
						<text class="label">其它费用：</text>
						<u-text :text="InDetailList.otherMoney"></u-text>
					</view>
				</u-col>
				<u-col span="12">
					<view class="goods-row">
						<text class="label">结算账户：</text>
						<u-text :text="InDetailList.accountName"></u-text>
					</view>
				</u-col>
				<u-col span="12">
					<view class="goods-row">
						<text class="label">扣除订单：</text>
						<u-text :text="InDetailList.deposit"></u-text>
						<text class="label">本次付款：</text>
						<u-text :text="InDetailList.changeAmount"></u-text>
					</view>
				</u-col>
				<u-col span="12">
					<view class="goods-row">

					</view>
				</u-col>
				<u-col span="12">
					<view class="goods-row">
						<text class="label">本次欠款：</text>
						<u-text :text="InDetailList.debt"></u-text>
					</view>
				</u-col>
			</u-row>
		</view>
		<u-col span="12">
			<view class="good-item" v-if="billNo">
				<view class="goods-row">
					<text class="label">付款单号：</text>
					<u-text :text="billNo"></u-text>
				</view>
			</view>
		</u-col>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, watch } from 'vue'
	import { onLoad } from '@dcloudio/uni-app';
	import { $u, useTheme } from 'uview-pro'
	import { getInOutDetailById, getFinancialBillNoByBillId, getMaterialListByNumber } from '@/api/api.js'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('采购入库-详情')
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

	//获取采购入库主表
	const number = ref<string>('')
	const InDetailList = ref<any>('');
	const loadInDetailById = async () => {
		const res = await getInOutDetailById(number.value)
		if (res && res.code === 200) {
			InDetailList.value = res.data
			billId.value = res.data.id
			loadFinancialBillNoByBillId()
			loadGetGoodsDetail()
		}
		else {
			uni.showToast({ title: '数据加载失败', icon: 'none' });
		}
	}

	// 加载商品详情数据
	const GoodsDetail = ref<Array>([]);
	const listTotal = ref<string>('0')
	const loadGetGoodsDetail = async () => {
		let params = {
			headerId: billId.value,
			mpList: '扩展1,扩展2',
			linkType: 'basic',
			isReadOnly: '1',
		}
		const res = await getMaterialListByNumber(params)
		if (res && res.code === 200) {
			GoodsDetail.value = res.data.rows
			listTotal.value = res.data.total
		}
		else {
			uni.showToast({ title: '供应商加载失败', icon: 'none' });
		}
	}

	//获取付款单号
	const billId = ref<string>('')
	const billNo = ref<string>('')
	const loadFinancialBillNoByBillId = async () => {
		const res = await getFinancialBillNoByBillId(billId.value)
		if (res && res.code === 200) {
			billNo.value = res.data[0].billNo
		}
		else {
			uni.showToast({ title: '数据加载失败', icon: 'none' });
		}
	}
	onLoad((options) => {
		if (options && options.number) {
			number.value = options.number;
			loadInDetailById();
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