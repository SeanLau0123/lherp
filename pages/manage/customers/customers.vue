<!-- 资料-客户信息 -->
<template>
	<view>
		<u-navbar :is-back="true" :title="title" title-color='#ffffff' back-icon-color='#ffffff'
			:background="background">
			<view class="navbar-right-icon">
				<u-icon name='search' @click="popupShow = true" color="#ffffff" size="48rpx" label-pos="right"></u-icon>
			</view>
		</u-navbar>
		<view>
			<u-popup v-model="popupShow" mode="right" width="600rpx" height="300px" border-radius="14">
				<view class="popup-title">
					<u-form label-width="100rpx">
						<u-form-item label="名称："><u-input v-model="searchname" placeholder="请输入名称查询" /></u-form-item>
						<!-- 						<u-form-item label="商品类型">
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
		</view>
		<u-empty text="没有搜索结果" mode="search" :show="emptyShow" class="u-empty-fullscreen"></u-empty>
		<scroll-view class="scrollviewpadding">
			<view v-for="(supplier, index) in supplierlList" :key="supplier.id || index">
				<view class="good-item" style="min-height: 80rpx;">
					<u-row gutter="10">
						<u-col span="12">
							<u-collapse :head-style="headStyle">
								<u-collapse-item :title="supplier.supplier">
									<view class="goods-row">
										<text class="label">期初应收：</text>
										<text class="value">{{ supplier.beginNeedPay || '0' }}</text>
										<text class="label">期末应收：</text>
										<text
											style="color: red; font-size: 36rpx;font-weight: bold;">{{supplier.allNeedPay || '0' }}</text>
									</view>
									<u-line color="#ffffff"></u-line>
								</u-collapse-item>
							</u-collapse>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">联系人：</text>
								<text class="value">{{ supplier.contacts || '-' }}</text>
								<text class="label">商品类别：</text>
								<text class="value">{{ supplier.type || '-' }}</text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">手机号码：</text>
								<text class="value">{{supplier.telephone || '-' }}</text>
								<text class="label">联系电话：</text>
								<text class="value">{{ supplier.phoneNum}}</text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">

								<text class="label">备注：</text>
								<text class="value">{{supplier.description || '-' }}</text>
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
	import { ref, reactive, onMounted,watch } from 'vue'
	import { getPartnerlList } from '../../../api/api'
	import { $u, useTheme } from 'uview-pro'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('客户信息')
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
		fontWeight: 'bold'
	})

	const uFormRef = ref();
	const form = reactive({
		name: '',
		category: ''
	});

	function search() {
		popupShow.value = false;
		loadGetSupplierlList();
	}
	function reset() {
		searchname.value = '';
		search();
	}


	//商品分类选择器
	const selectShow = ref<boolean>(false)
	const categoryName = ref<string>('')
	const categoryId = ref<string>('')

	//加载商品列表
	const supplierlList = ref<Array>([]);
	const searchname = ref<string>('');
	const loadGetSupplierlList = async () => {
		let params = {
			currentPage: current.value,
			pageSize: pageSize.value,
			search: JSON.stringify({
				supplier: searchname.value,
				// telephone: this.telephone,
				// phonenum: this.phonenum,
				type: "客户"
			})
		}
		const res = await getPartnerlList(params)
		if (res && res.code === 200) {
			listTotal.value = res.data.total
			supplierlList.value = res.data.rows
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
		loadGetSupplierlList();
	}

	onMounted(async () => {
		await loadGetSupplierlList();
	})
</script>

<style lang="scss">
	.goods-row-coll {
		border-radius: 8rpx;
		width: calc(100% - 32rpx);
		margin: 10rpx 0rpx 10rpx 40rpx;
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