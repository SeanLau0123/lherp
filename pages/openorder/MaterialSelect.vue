<template>
	<view style="height: 100vh;">
		<u-navbar :is-back="true" :background="background" :title="title" back-icon-color="#ffffff"
			title-color="#ffffff">
			<view class="navbar-right-icon">
				<u-icon name='search' @click="popupShow = true" color="#ffffff" size="48rpx" label-pos="right"></u-icon>
			</view>
		</u-navbar>
		<scroll-view class="scrollviewpadding">
			<u-popup v-model="popupShow" mode="right" width="600rpx" height="300px" border-radius="8">
				<view class="popup-title">
					<u-form label-width="130rpx">
						<u-form-item label="关键词："><u-input v-model="searchname"
								placeholder="请输入名称、条码、助记码查询" /></u-form-item>
						<!-- <u-form-item label="商品类型">
							<view>
								<u-input v-model="categoryName" type="select" @click="selectShow = true" />
								<u-input v-model="categoryId" />
								<u-select :list="list" v-model="selectShow" mode="mutil-column"
									@confirm="confirm"></u-select>
							</view>
						</u-form-item> -->
						<u-gap></u-gap>
						<u-button type="primary" @click="search()">搜索</u-button>
						<u-gap></u-gap>
						<u-button @click="reset()">重置</u-button>
					</u-form>
				</view>
			</u-popup>

			<view v-for="(item, index) in materialList" :key="item.id || index" @click="goMaterialDetail(item)">
				<view class="good-item" style="min-height: 80rpx;">
					<u-row gutter="5">
						<u-col span="12">
							<view class="goods-row">
								<text class="label">名称：</text>
								<text class="">{{ item.name }}</text>
								<u-text type="warning">{{item.enableSerialNumber === '1' ? '【序】' : ''}}</u-text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">条码：</text>
								<text class="value">{{ item.mBarCode || '-' }}</text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">类别：</text>
								<text class="value">{{ item.categoryName || '-' }}</text>
								<text class="label">库存：</text>
								<text class="value">{{item.stock || '0' }}（{{item.unit || '-' }})</text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">规格：</text>
								<text class="value">{{ item.standard || '-' }}</text>
								<text class="label">型号：</text>
								<text class="value">{{ item.model || '-' }}</text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">品牌：</text>
								<text class="value">{{ item.brand || '-' }}</text>
								<text class="label">制造商：</text>
								<text class="value">{{ item.mfrs || '-' }}</text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
							</view>
						</u-col>
					</u-row>
				</view>
			</view>
		</scroll-view>
		<!-- 明细行 数量金额-->
		<u-popup v-model="popupStock" mode="bottom" height="800rpx" border-radius="8">
			<view>
				<u-form label-width="120rpx">
					<u-form-item label-align="right" label="仓库：">
						<u-input v-model="depotName" :type="type" placeholder="请选择仓库"
							@click="depotShow = true" /></u-form-item>
					<u-select v-model="depotShow" :list="depotList" @confirm="depotConfirm"></u-select>
					<u-form-item label-align="right" label="名称：">
						<u-input v-model="materialDetail.name" placeholder="请输入名称" :disabled="true" /></u-form-item>
					<u-row gutter="10">
						<u-col span="6">
							<u-form-item label-align="right" label="数量：">
								<u-input v-model="materialDetail.expiryNum" placeholder="请输入数量"
									@input="InputChangeNum" /></u-form-item>
						</u-col>
						<u-col span="6">
							<u-form-item label-align="right" label="单价：">
								<u-input v-model="materialDetail.billPrice" placeholder="请输入单价"
									@input="InputChangePrice" /></u-form-item>
						</u-col>
						<u-col span="12">
							<u-form-item label-align="right" label="金额：">
								<u-input v-model="materialDetail.total" placeholder="金额"
									:disabled="true" /></u-form-item>
						</u-col>
						<u-col span="12">
							<u-form-item label-align="right" label="备注：">
								<u-input v-model="materialDetail.remark"/></u-form-item>
						</u-col>
					</u-row>
				</u-form>
				<u-gap></u-gap>
			</view>
			<view>
				<u-row gutter="10">
					<u-button type="warning" @click="materialDetailClose">取消</u-button>
					<u-button type="primary" @click="materialDetailSubmit">确定</u-button>
				</u-row>
			</view>
		</u-popup>

		<u-empty text="没有搜索结果" mode="search" :show="emptyShow" class="u-empty-fullscreen"></u-empty>
		<view class="pagination-fixed">
			<u-pagination v-model="current" :total="listTotal" :pageSize="pageSize"
				@change="handleChange"></u-pagination>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { ref, reactive, onMounted, watch, nextTick } from 'vue'
	import { getMaterialBySelect, getDepotInfo, getMaterialByBarCode } from '/api/api.js'
	import { Request, color, $u, useTheme } from 'uview-pro'
	const { currentTheme, themes, darkMode } = useTheme();

	const title = ref<string>('选择商品')
	const background = reactive({
		backgroundColor: ""
	})
	const updateNavbarBackground = () => {
		background.backgroundColor = $u.color.primary;
	};
	const popupShow = ref<boolean>(false)
	const popupStock = ref<boolean>(false)
	const emptyShow = ref<boolean>(false)

	const headStyle = reactive({
		fontSize: '28rpx',
		lineHeight: '32rpx',
		color: $u.color.primary,
		fontWeight: 'bold',
		paddingLeft: '10rpx'
	})

	const uFormRef = ref();
	const form = reactive({
		name: '',
		category: ''
	});

	function search() {
		popupShow.value = false;
		getMaterialList();
	}
	function reset() {
		searchname.value = '';
		search();
	}

	interface ListItem {
		value : string
		label : string
	}
	const type = ref<string>('select')
	//商品分类选择器
	const selectShow = ref<boolean>(false)
	const categoryName = ref<string>('')
	const categoryId = ref<string>('')

	//加载商品列表
	const materialList = ref<Array>([]);
	const searchname = ref<string>('');
	const getMaterialList = async () => {
		let params = {
			depotId: depotId.value,
			mpList: '扩展1,扩展2,扩展3',
			page: current.value,
			rows: pageSize.value
		}
		const res = await getMaterialBySelect(params)
		if (res) {
			listTotal.value = res.total
			materialList.value = res.rows
			if (listTotal.value == 0) {
				emptyShow.value = true
				listTotal.value = 0

			}
			else { emptyShow.value = false }
		}
		else {
			uni.showToast({ title: '商品数据加载失败', icon: 'none' });
		}
	}

	//加载仓库列表
	const depotShow = ref<boolean>(false)
	const depotName = ref<string>('');
	const depotId = ref<string>('');
	const depotList = ref<ListItem[]>([]);
	const getdepotlList = async () => {
		const res = await getDepotInfo()
		if (res && res.code === 200) {
			depotList.value = res.data.map(item => ({
				value: item.id.toString() || '',
				label: item.depotName || ''
			}));

			const defaultDepot = res.data.find(item => item.isDefault === true);
			if (defaultDepot) {
				depotName.value = defaultDepot.depotName; // 默认显示的仓库名称
				depotId.value = defaultDepot.id.toString(); // 默认仓库的ID（转为字符串，和列表的value格式一致）
			}
		}
		else {
			uni.showToast({ title: '仓库加载失败', icon: 'none' });
		}
	}
	// 仓库列表确认
	const depotConfirm = (e : any[]) => {
		depotName.value = e[0].label;
		depotId.value = e[0].value;
	}
	function goMaterialDetail(item) {
		popupStock.value = true;
		getdepotlList();
		getMaterialByCode(item)
	}

	const totalAmount = ref<string>('');
	const materialDetail = ref({
		name: '',
		expiryNum: '1',
		billPrice: '',
		total: '',
		remark: ''
	})
	const getMaterialByCode = async (item) => {
		let params = {
			barCode: item.mBarCode,
			depotId: depotId.value,
			mpList: "制造商,自定义1,自定义2,自定义3",
			prefixNo: 'XSCK',
		}
		const res = await getMaterialByBarCode(params);
		if (res && res.code === 200) {
			materialDetail.value = res.data[0]
			materialDetail.value.expiryNum = res.data[0].expiryNum || '1'
			materialDetail.value.total = res.data[0].billPrice
		}
		else {
			uni.showToast({ title: '商品详情加载失败', icon: 'none' });
		}
	}

	function materialDetailClose() {
		popupStock.value = false;
		getMaterialList();
	}
	function materialDetailSubmit() {
		uni.$emit('addMaterialDetail', materialDetail.value);
		uni.navigateBack();
	}
	//数量变更
	const InputChangeNum = (val : string) => {
		const num = Number(val) || 0;
		const price = Number(materialDetail.value.billPrice || 0);
		materialDetail.value.total = num * price;
	};
	//单价变更
	const InputChangePrice = (val : string) => {
		const price = Number(val) || 0;
		materialDetail.value.total = materialDetail.value.expiryNum * price;
	};


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
		getMaterialList();
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
		getMaterialList();
		getdepotlList();
	})
</script>

<style lang="scss">
	.goods-row-coll {
		border-radius: 8rpx;
		width: calc(100% - 32rpx);
		margin: 10rpx 0rpx 10rpx 10rpx;
	}

	.colllabel {
		font-size: 28rpx;
		width: 120rpx;
		text-align: right;
	}

	.collvalue {
		flex: 1;
		min-width: calc(40% - 130rpx);
		word-break: break-all;
		font-size: 28rpx;
	}

	.good-item {
		background: rgba(var(--u-type-primary-rgb), 0.15);
		border: 1px solid rgba(var(--u-type-primary-rgb), 0.2);
		border-radius: 8rpx;
		width: calc(100% - 32rpx);
		margin: 10rpx 10rpx 10rpx;
	}

	.goods-row {
		display: flex;
		margin-bottom: 5rpx;
		flex-wrap: wrap;
	}

	.label {
		font-size: 24rpx;
		color: $u-type-primary;
		width: 140rpx;
		text-align: right;
		padding-right: 10rpx;
		//border: solid 1px #ffffff;
	}

	.value {
		flex: 1;
		min-width: calc(40% - 130rpx);
		word-break: break-all;
		font-size: 24rpx;
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
		padding: 10rpx 50rpx;
		///border-top: 1rpx solid #f5f5f5;
		z-index: 999;
		background-color: $u-bg-color;
	}

	.scrollviewpadding {
		padding-bottom: 40px;
		background: $u-bg-color;
		min-height: calc(100% - 200rpx);
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
		/* 绝对定位，脱离文档流 */
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		/* 高度铺满整个父容器（100vh），扣除导航栏和分页栏高度 */
		height: 100%;
		/* 弹性布局，让内容垂直水平居中（核心） */
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