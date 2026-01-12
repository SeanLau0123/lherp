<template>
	<view>
		<u-navbar :is-back="true" :title="title" title-color='#ffffff' back-icon-color='#ffffff'
			:background="background">
		</u-navbar>
		<!-- 搜索与筛选区域 -->
		<u-sticky>
			<view style="padding: 0 16rpx;background-color: #062a57;">
				<u-row gutter="11">
					<u-col span="11">
						<u-search placeholder="请输入名称、条码、助记码等查询" shape="square" :clearabled="true" :show-action="true"
							@custom="search" action-text="搜索" v-model="searchname" :action-style="headStyle"
							style="margin: 5px 0 5px 0;"></u-search>
					</u-col>
					<u-col span="1">
						<u-icon name='list' @click="show = true" color="#ffffff" size="48rpx"></u-icon></u-col>
				</u-row>
				<u-popup v-model="show" mode="right" width="500rpx" height="600px" border-radius="14">
					<view style="height: 800px;">
						<u-form>
							<view class="cu-form-group">
								<u-form-item label="姓名"><u-input v-model="form.name" /></u-form-item>
								<u-form-item label="商品类型">
									<view class="">
										<u-input v-model="categoryName" type="select" @click="selectShow = true" />
										<u-input v-model="categoryId" />
										<u-select :list="categoryList" v-model="selectShow" mode="mutil-column-auto"
											@confirm="confirm"></u-select>
									</view>
								</u-form-item>
							</view>

							<!-- 							<view class="cu-form-group" :isBack="true" backRouterName="index">
								<button class="cu-btn bg-gradual-blue shadow-blur round" @tap="reset">重置</button>
								<button class="cu-btn bg-gradual-blue shadow-blur round" @tap="confirm">确定</button>
							</view> -->
						</u-form>
					</view>
				</u-popup>
			</view>
			<u-empty text="没有搜索结果" mode="search" margin-top="100" :show="emptyShow"
				style="width: 100%; height:900rpx;"></u-empty>
		</u-sticky>
		<scroll-view class="scrollviewpadding">
			<view v-for="(good, index) in materialList" :key="good.id || index">
				<view class="good-item" style="min-height: 80rpx;">
					<u-row gutter="10">
						<u-col span="12">
							<u-collapse :head-style="headStyle">
								<u-collapse-item :title="good.name">
									<view class="goods-row-coll">
										<text class="colllabel">名称：</text>
										<text class="collvalue">{{good.name}}</text>
									</view>
									<view class="goods-row-coll">
										<text class="colllabel">采购价：</text>
										<text
											style="color: red; font-size: 36rpx;font-weight: bold;">{{good.purchaseDecimal}}</text>
									</view>
									<u-line color="#ffffff"></u-line>
								</u-collapse-item>
							</u-collapse>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">品牌：</text>
								<text class="value">{{ good.brand || '-' }}</text>
								<text class="label">类别：</text>
								<text class="value">{{ good.categoryName || '-'}}</text>
							</view>
						</u-col>
						<u-col span="11">
							<view class="goods-row">
								<text class="label">销售价：</text>
								<text class="value">{{ good.wholesaleDecimal || '-' }}</text>
								<text class="label">最低售价：</text>
								<text class="value">{{good.lowDecimal || '-' }}</text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">零售价：</text>
								<text class="value">{{ good.commodityDecimal || '-' }}</text>
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
	import { ref, reactive, onMounted } from 'vue'
	import { getMaterialList, getMaterialCategory } from '../../../api/api'
	const title = ref<string>('商品信息')
	const background = reactive({
		backgroundImage: "linear-gradient(45deg, #0081ff, #1cbbb4)"
	})
	const show = ref<boolean>(false)
	const emptyShow = ref<boolean>(false)
	function search() {
		loadGetMaterialList();
	}
	const headStyle = reactive({
		fontSize: '28rpx',
		color: '#ffffff',
		lineHeight: '32rpx',
	})

	const uFormRef = ref();
	const form = reactive({
		name: '',
		category: ''
	});

	//商品分类选择器
	const selectShow = ref<boolean>(false)
	const categoryName = ref<string>('')
	const categoryId = ref<string>('')
	interface LinkedListItem {
		id : number
		title : string
		children ?: LinkedListItem[]
	}
	const categoryList = ref<LinkedListItem[]>([
    {
        "children": [
            {
                "children": [
                    {
                        "children": [],
                        "checked": false,
                        "id": 47,
                        "state": "open",
                        "title": "休闲食品",
                        "value": 47,
                        "key": 47
                    }
                ],
                "checked": false,
                "id": 46,
                "state": "open",
                "title": "储值卡",
                "value": 46,
                "key": 46
            }
        ],
        "checked": false,
        "id": 48,
        "state": "open",
        "title": "兑换卡册",
        "value": 48,
        "key": 48
    }
])
	const loadMaterialCategory = async () => {
		let params = {}
		params.id = ''
		const res = await getMaterialCategory(params)
		if (res) {
			categoryList.value = res;
			console.log("数据赋值成功，categoryList当前值：", categoryList.value); // 打印调试

		}
		else {
			uni.showToast({ title: '数据加载失败', icon: 'none' });
		}
	}

	// 定义确认回调函数
	const confirm = (e : any[]) => {
		// 注意返回值为一个数组，单列时取数组的第一个元素即可(只有一个元素)
		categoryName.value = e[0].title
		categoryId.value = e[0].id
	}
	//加载商品列表
	const materialList = ref<Array>([]);
	const searchname = ref<string>('');
	const loadGetMaterialList = async () => {
		let params = {
			currentPage: current.value,
			pageSize: pageSize.value,
			search: JSON.stringify({
				materialParam: searchname.value
			})
		}
		const res = await getMaterialList(params)
		if (res && res.code === 200) {
			listTotal.value = res.data.total
			materialList.value = res.data.rows
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
	const pageSize = ref<number>(10);
	const listTotal = ref<number>(1);
	function handleChange(val : PaginationChangePayload) {
		if (val.type === 'next') {
			current.value = current.value
		}
		else {
			current.value = current.value
		}
		loadGetMaterialList();
	}



	onMounted(async () => {
		await loadGetMaterialList();
		//await loadMaterialCategory();
	})
</script>

<style lang="scss">
	.goods-row-coll {
		border-radius: 6rpx;
		width: calc(100% - 32rpx);
		margin: 10rpx 10rpx 10rpx 40rpx;
	}

	.colllabel {
		font-size: 28rpx;
		color: #ffffff;
		width: 160rpx;
		text-align: right;
		padding-right: 10rpx;
	}

	.collvalue {
		color: #ffffff;
		flex: 1;
		min-width: calc(40% - 130rpx);
		word-break: break-all;
		font-size: 28rpx;
	}

	.good-item {
		background: #062a57;
		border-radius: 6rpx;
		width: calc(100% - 32rpx);
		padding: 16rpx;
		margin: 10rpx 16rpx 20rpx;
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
		color: #ffffff;
		width: 160rpx;
		text-align: right;
		padding-right: 10rpx;
	}

	.value {
		color: #ffffff;
		flex: 1;
		min-width: calc(40% - 130rpx);
		word-break: break-all;
		font-size: 28rpx;
	}

	.name {
		font-weight: bold;
		font-size: 30rpx;
		color: #007aff;
	}

	.pagination-fixed {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #ffffff;
		padding: 10rpx 50rpx;
		///border-top: 1rpx solid #f5f5f5;
		z-index: 999;
	}

	.scrollviewpadding {
		padding-bottom: 40px;
	}
</style>