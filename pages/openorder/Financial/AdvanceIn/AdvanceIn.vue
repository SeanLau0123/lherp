<!-- 财务管理-收预付款 -->
<template>
	<view style="height: 100vh;">
		<u-navbar :is-back="true" :title="title" title-color='#ffffff' back-icon-color='#ffffff'
			:background="background">
			<view class="navbar-right-icon">
				<u-icon name='search' @click="popupShow = true" color="#ffffff" size="48rpx" label-pos="right"></u-icon>
			</view>
		</u-navbar>
		<u-toast ref="uToastRef" />
		<u-empty text="没有搜索结果" mode="search" :show="emptyShow" class="u-empty-fullscreen"></u-empty>
		<scroll-view class="scrollviewpadding">
			<u-popup v-model="popupShow" mode="right" width="600rpx" height="300px" border-radius="8">
				<view class="popup-title">
					<u-form label-width="160rpx">
						<u-form-item label="单据编号：">
							<u-input v-model="billno" placeholder="请输入单据编号" /></u-form-item>
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
						<u-form-item label="付款会员：">
							<u-input v-model="billno" placeholder="请输入单据编号" /></u-form-item>
						<u-form-item label="操作员：">
							<u-input v-model="billno" placeholder="请输入单据编号" /></u-form-item>
						<u-form-item label="财务人员：">
							<u-input v-model="billno" placeholder="请输入单据编号" /></u-form-item>
						<u-form-item label="单据状态：">
							<u-input v-model="billno" placeholder="请输入单据编号" /></u-form-item>
						<u-form-item label="单据备注：">
							<u-input v-model="billno" placeholder="请输入单据编号" /></u-form-item>
						<u-gap></u-gap>
						<u-button type="primary" @click="search()">搜索</u-button>
						<u-gap></u-gap>
						<u-button @click="reset()">重置</u-button>
					</u-form>
				</view>
			</u-popup>
			<u-swipe-action :show="advanceIn.show" v-for="(advanceIn, index) in advanceInList"
				:key="advanceIn.id || index" :index="index" @click="click" @open="open"
				:options="getSwipeOptions(advanceIn)" :btn-width="btnWidth">
				<view class="good-item">
					<u-row gutter="10">
						<u-col span="12">
							<u-collapse :head-style="headStyle">
								<u-collapse-item :title="`付款会员：${advanceIn.organName}`">
									<u-col span="12">
										<view class="goods-row">
											<text class="label">单据编号：</text>
											<u-text type="primary" decoration="underline"
												:text="advanceIn.billNo" @click="lookNumberDetail(advanceIn.billNo)"></u-text>
										</view>
									</u-col>
									<u-col span="12">
										<view class="goods-row">
											<text class="label">单据日期：</text>
											<u-text>{{ $u.timeFormat(advanceIn.billTime, 'yyyy-mm-dd hh:MM:ss') }}</u-text>
										</view>
									</u-col>
									<u-line :color="$u.color.primary"></u-line>
								</u-collapse-item>
							</u-collapse>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">操作员：</text>
								<u-text :text="advanceIn.userName"></u-text>
								<text class="label">财务人员：</text>
								<u-text :text="advanceIn.handsPersonName"></u-text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">收款金额：</text>
								<u-text mode="price" :text="advanceIn.changeAmount"></u-text>
							</view>
						</u-col>
						<u-col span="12">
							<view class="goods-row">
								<text class="label">合计金额：</text>
								<u-text mode="price" :text="advanceIn.totalPrice"></u-text>
							</view>
						</u-col>
						<u-col span="9">
							<view class="goods-row">
								<text class="label">备注：</text>
								<u-text :text="advanceIn.remark"></u-text>
							</view>
						</u-col>
						<u-col span="3">
							<view class="goods-row status-right-align">
								<text v-if="advanceIn.status == '0'"
									:style="{color: $u.color.warning,fontSize: '32rpx',fontWeight: 'bold'}">未审核</text>
								<text v-if="advanceIn.status == '1'"
									:style="{color: $u.color.success,fontSize: '32rpx',fontWeight: 'bold'}">已审核</text>
							</view>
						</u-col>
					</u-row>
				</view>
			</u-swipe-action>
			<view>
				<u-modal v-model="deleteShow" :content="content" :show-cancel-button="true" cancel-color="#606266"
					confirm-color="#2979ff" @confirm="confirm" :show-title="false"></u-modal>
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
	import { getFinancialDetail, batchSetStatusFinancial, deleteFinancial } from '@/api/api.js'
	import { $u, useTheme } from 'uview-pro'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('收预付款')
	const background = reactive({
		backgroundColor: ""
	})
	const updateNavbarBackground = () => {
		background.backgroundColor = $u.color.primary;
	};
	const uToastRef = ref()
	const showToast = (title : string, type : string) => {
		uToastRef.value.show({
			type,
			title
		})
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
		loadGetadvanceInList();
	}
	function reset() {
		billno.value = '';
		initDefaultDates();
		search();
	}

	// 定义列表项接口
	interface ListItem {
		id : number
		number : string
		status : '0' | '1'
		show : boolean
	}

	// 定义选项按钮接口
	interface OptionButton {
		text : string
		style : {
			backgroundColor : string,
			fontSize : "42rpx"
		}
	}
	const disabled = ref<boolean>(false)
	const btnWidth = ref<number>(120)
	const show = ref<boolean>(false)
	const selectedId = ref<string>('')
	const selectedIndex = ref<number>(-1)
	const getSwipeOptions = (advanceIn : ListItem) : OptionButton[] => {
		return [
			{
				text: advanceIn.status === '1' ? "反审核" : "审核",
				style: {
					backgroundColor: $u.color.warning
				},
			},
			{
				text: "编辑",
				style: {
					backgroundColor: $u.color.info
				},
			},
			{
				text: "删除",
				style: {
					backgroundColor: $u.color.error
				},
			},
		]
	}
	//设置审核状态
	const batchSetStatus = async (id : number, targetStatus : number) => {
		try {
			const requestParams = {
				status: targetStatus,
				ids: `${id},`
			};
			const res = await batchSetStatusFinancial(requestParams)
			if (res.code === 200) {
				const tipText = targetStatus === 1 ? '审核成功' : '反审核成功';
				showToast(tipText, 'success');
				loadGetadvanceInList();
			} else {
				const tipText = targetStatus === 1 ? '审核失败' : '反审核失败';
				showToast(tipText, 'error');
			}
		} catch (error) {
			showToast('操作失败，请重试', 'error');
		} finally {
		}
	}
	const deleteShow = ref<boolean>(false)
	const content = ref<string>('确定要删除吗？')
	// 删除确认
	const confirm = async () => {
		advanceInList.value.splice(selectedIndex.value, 1)
		try {
			const res = await deleteFinancial(selectedId.value)
			if (res.code === 200) {
				showToast('删除成功', 'success');
			} else {
				showToast('删除失败', 'error');
			}
		} catch (error) {
			console.error('删除失败：', error)
		} finally {
			deleteShow.value = false
			selectedIndex.value = -1;
			selectedId.value = 0;
		}
	}
	// 删除取消
	const cancel = () => {
		deleteShow.value = false
	}
	// 定义打开事件回调函数
	const open = (index : number) => {
		advanceInList.value[index].show = true
		advanceInList.value.map((val, idx) => {
			if (index != idx) advanceInList.value[idx].show = false
		})
	}
	// 定义点击事件回调函数
	const click = (index : number, index1 : number) => {
		const curItem = advanceInList.value[index]; // 缓存当前项，避免多次取值
		selectedId.value = curItem.id;
		selectedIndex.value = index;
		curItem.show = false;
		if (index1 === 2) {
			if (curItem.status === '1') {
				showToast('只有未审核的单据才能删除，请先进行反审核！', 'warning');
				return;
			}
			deleteShow.value = true;
		} else if (index1 === 1) {
			if (curItem.status === '1') {
				showToast('只有未审核的单据才能编辑，请先进行反审核！', 'warning');
				return;
			}
			goAdvanceInDetail(curItem); // 调用已有编辑方法，传递当前单据数据
		} else {
			// 启用/禁用分支（核心：获取当前状态，传递给batchSetStatus）
			const currentEnabled = curItem.status;
			const targetStatus = currentEnabled === '0' ? 1 : 0;
			// 调用修正后的方法，传递id和目标状态
			batchSetStatus(selectedId.value, targetStatus);
		}
	}

	//商品分类选择器
	const selectShow = ref<boolean>(false)
	const categoryName = ref<string>('')
	const categoryId = ref<string>('')
	const organId = ref("");
	const creator = ref("");
	const handsPersonId = ref("");
	const status = ref("");
	const remark = ref("");
	const realityPriceTotal = ref(0);

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

	const advanceInList = ref<Array>([]);
	const billno = ref<string>('');
	const loadGetadvanceInList = async () => {
		let params = {
			currentPage: current.value,
			pageSize: pageSize.value,
			search: JSON.stringify({
				billno: billno.value,
				type: '收预付款',
				beginTime: beginTime.value,
				endTime: endTime.value,
				remark: remark.value
			})
		}
		if (organId.value) {
			params.search = organId.value;
		}
		if (creator.value) {
			params.search = creator.value;
		}
		if (handsPersonId.value) {
			params.search = handsPersonId.value;
		}
		if (status.value) {
			params.search = status.value;
		}
		const res = await getFinancialDetail(params)
		if (res && res.code === 200) {
			listTotal.value = res.data.total
			advanceInList.value = res.data.rows
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
	//查看
	function lookNumberDetail(number : string) {
		uni.$u.route('pages/openorder/Financial/AdvanceIn/AdvanceInDetail',
			{ number: number });
	}
	//新增
	function onBtnClick() {
		uni.$u.route('pages/openorder/Financial/AdvanceIn/AddAdvanceIn');
	}
	//编辑
	function goAdvanceInDetail(item) {
		uni.$u.route('/pages/openorder/Financial/AdvanceIn/AddAdvanceIn?item=' + encodeURIComponent(JSON.stringify(item)) + '&action=edit')
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
		loadGetadvanceInList();
	}

	onMounted(async () => {
		initDefaultDates();
		await loadGetadvanceInList();

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
		width: 200rpx;
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