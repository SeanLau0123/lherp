<!-- 报表-查看进销存统计-库存分布 -->
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
						<text class="label">条码：</text>
						<text class="value">{{ barCode }}</text>
					</view>
				</u-col>
				<u-col span="12">
					<view class="goods-row">
						<text class="label">名称：</text>
						<text class="value">{{ materialName }}</text>
					</view>
				</u-col>
			</u-row>
		</view>
		<scroll-view class="scrollviewpadding">
			<view>
				<!-- 				<u-collapse :head-style="headStyle">
					<u-collapse-item :title="`库存详情 - 共 ${total} 行`" :open="show"> -->
				<view class="good-item" style="min-height: 80rpx;" v-for="(material, index) in DetailList"
					:key="material.depotId || index">
					<u-row gutter="10">
						<u-col span="12">
							<view class="goods-row">
								<text class="label">仓库名称：</text>
								<text class="value">{{ material.depotName }}</text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">成本价：</text>
								<u-text mode="price" :text="material.unitPrice"></u-text>
								<text class="label">库存数量：</text>
								<text class="value">{{ material.currentNumber || '-' }}</text>

							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">库存金额：</text>
								<u-text mode="price" :text="material.allPrice"></u-text>
							</view>
						</u-col>
					</u-row>
				</view>
				<!-- 					</u-collapse-item>
				</u-collapse> -->
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, watch } from 'vue'
	import { onLoad } from '@dcloudio/uni-app';
	import { $u, useTheme } from 'uview-pro'
	import { getMaterialDepotStockByParam } from '@/api/api.js'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('库存分布')
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

	//获取库存分布详情
	const show = ref<boolean>(true)
	const barCode = ref<string>('')
	const materialName = ref<string>('')
	const materialId = ref<string>('')
	const unitPrice = ref<string>('')
	const DetailList = ref<any>('');
	const total = ref<number>(1);
	const loadDetailByParam = async () => {
		let params = {
			depotIds: '',
			unitPrice: unitPrice.value,
			materialId: materialId.value,
			beginTime: '2026-02-17',
			endTime: '2026-03-17',
			currentPage: 1,
			pageSize: 10
		}
		const res = await getMaterialDepotStockByParam(params)
		if (res && res.code === 200) {
			total.value = res.data.total
			DetailList.value = res.data.rows
		}
		else {
			uni.showToast({ title: '数据加载失败', icon: 'none' });
		}
	}

	onLoad((options) => {
		if (options && options.materialId) {
			barCode.value = options.barCode;
			unitPrice.value = options.unitPrice;
			materialId.value = options.materialId;
			materialName.value = options.materialName;
			loadDetailByParam();
		} else {
			console.warn("未接收到单号参数");
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
		width: 180rpx;
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