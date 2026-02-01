<!-- 资料-客户信息 -->
<template>
	<view style="height: 100vh;">
		<u-navbar :is-back="true" :background="background" :title="title" back-icon-color="#ffffff"
			title-color="#ffffff">
			<view class="navbar-right-icon">
				<u-icon name='search' @click="popupShow = true" color="#ffffff" size="48rpx" label-pos="right"></u-icon>
			</view>
		</u-navbar>
		<u-toast ref="uToastRef" />
		<scroll-view class="scrollviewpadding">
			<u-popup v-model="popupShow" mode="right" width="600rpx" height="300px" border-radius="14">
				<view class="popup-title">
					<u-form label-width="100rpx">
						<u-form-item label="名称："><u-input v-model="searchname" placeholder="请输入名称查询" /></u-form-item>
						<u-form-item label="备注："><u-input v-model="remark" placeholder="请输入备注查询" /></u-form-item>
						<u-form-item label-align="right" label="类型：">
							<u-input v-model="typeName" :type="type" @click="typeShow = true" />
							<u-select v-model="typeShow" :list="typeList" @confirm="typeConfirm"></u-select>
						</u-form-item>
						<u-gap></u-gap>
						<u-button type="primary" @click="search()">搜索</u-button>
						<u-gap></u-gap>
						<u-button @click="reset()">重置</u-button>
					</u-form>
				</view>
			</u-popup>
			<view>
				<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in InOutItemList" :key="item.id"
					@click="click" @open="open" :options="getSwipeOptions(item)" :btn-width="btnWidth">
					<view class="good-item" style="min-height: 80rpx;">
						<u-row gutter="10">
							<u-col span="12">
								<view class="goods-row">
									<text class="label">名称：</text>
									<text class="value">{{ item.name || '-' }}</text>
									<u-text v-model="item.id"></u-text>
									<text v-if="item.enabled == '0'"
										style="color:red; font-size: 32rpx;font-weight: bold">禁用</text>
									<text v-if="item.enabled == '1'"
										style="color:green;font-size: 32rpx;font-weight: bold">启用</text>
								</view>
							</u-col>
							<u-col span="12">
								<view class="goods-row">
									<text class="label">类型：</text>
									<text class="value">{{ item.type || '-' }}</text>
									<text class="label">排序：</text>
									<text class="value">{{ item.sort || '-' }}</text>

								</view>
							</u-col>
							<u-col span="12">
								<view class="goods-row">
									<text class="label">备注：</text>
									<text class="value">{{item.remark || '-' }}</text>
								</view>
							</u-col>
						</u-row>
					</view>
				</u-swipe-action>
			</view>
			<view>
				<u-modal v-model="deleteShow" :content="content" :show-cancel-button="true" cancel-color="#606266"
					confirm-color="#2979ff" @confirm="confirm" :show-title="false"></u-modal>
			</view>
		</scroll-view>
		<u-empty text="没有搜索结果" mode="search" :show="emptyShow" class="u-empty-fullscreen"></u-empty>
		<view class="pagination-fixed">
			<u-pagination v-model="current" :total="listTotal" :pageSize="pageSize"
				@change="handleChange"></u-pagination>
		</view>
	</view>
</template>
<script setup lang="ts">
	import { ref, reactive, onMounted, watch } from 'vue'
	import { getInOutItem, batchSetStatusInOutItem, deleteInOutItem } from '../../../api/api'
	import { $u, useTheme } from 'uview-pro'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('收支项目')
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
	// 定义列表项接口
	interface ListItem {
		id : number
		name : string
		enabled : '0' | '1'
		show : boolean
	}

	// 定义选项按钮接口
	interface OptionButton {
		text : string
		style : {
			backgroundColor : string
		}
	}
	const disabled = ref<boolean>(false)
	const btnWidth = ref<number>(120)
	const show = ref<boolean>(false)
	const selectedId = ref<string>('')
	const selectedIndex = ref<number>(-1)
	const getSwipeOptions = (item : ListItem) : OptionButton[] => {
		return [
			{
				text: item.enabled == '1' ? "禁用" : "启用",
				style: {
					backgroundColor: "#ff9900",
				},
			},
			{
				text: "删除",
				style: {
					backgroundColor: "#fa3534",
				},
			},
		]
	}
	//设置启用，禁用状态
	const batchSetStatus = async (id : number, targetStatus : boolean) => {
		try {
			const requestParams = {
				status: targetStatus,
				ids: String(id)
			};
			const res = await batchSetStatusInOutItem(requestParams)
			if (res.code === 200) {
				const tipText = targetStatus ? '启用成功' : '禁用成功';
				showToast(tipText, 'success');
				await loadGetInOutItemList();
			} else {
				const tipText = targetStatus ? '启用失败' : '禁用失败';
				showToast(tipText, 'error');
			}
		} catch (error) {
			console.error('切换启用/禁用失败：', error);
			showToast('操作失败，请重试', 'error');
		} finally {
		}
	}
	const deleteShow = ref<boolean>(false)
	const content = ref<string>('确定要删除所选中的数据吗？')

	// 删除确认
	const confirm = async () => {
		InOutItemList.value.splice(selectedIndex.value, 1)
		try {
			const res = await deleteInOutItem(selectedId.value)
			if (res.code === 200) {
				showToast('删除成功', 'success');
			} else {
				showToast('删除失败', 'error');
			}
		} catch (error) {
			console.error('删除失败：', error)
			showToast('删除失败', 'error');
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
	// 定义点击事件回调函数
	const click = (index : number, index1 : number) => {
		selectedId.value = InOutItemList.value[index].id;
		selectedIndex.value = index;
		if (index1 == 1) {
			deleteShow.value = true;
		} else {
			// 启用/禁用分支（核心：获取当前状态，传递给batchSetStatus）
			const currentEnabled = InOutItemList.value[index].enabled;
			const targetStatus = !currentEnabled; // 目标状态：反转当前状态
			// 调用修正后的方法，传递id和目标状态
			batchSetStatus(selectedId.value, targetStatus);
			InOutItemList.value[index].show = false
		}
	}

	// 定义打开事件回调函数
	const open = (index : number) => {
		InOutItemList.value[index].show = true
		InOutItemList.value.map((val, idx) => {
			if (index != idx) InOutItemList.value[idx].show = false
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
	const type = ref<string>('select')
	const headStyle = reactive({
		fontSize: '28rpx',
		color: $u.color.primary,
		lineHeight: '32rpx',
		fontWeight: 'bold',
		paddingLeft: '10rpx'
	})

	const uFormRef = ref();

	function search() {
		popupShow.value = false;
		loadGetInOutItemList();
	}
	function reset() {
		searchname.value = '';
		remark.value = '';
		typeName.value = '';
		search();
	}


	//分类选择器
	const typeShow = ref<boolean>(false)
	const typeName = ref<string>('')
	interface ListItem {
		label : string
	}
	const typeList = ref<ListItem[]>([
		{ label: '收入' }, { label: '支出' }])
	// 定义确认回调函数
	const typeConfirm = (e : any[]) => {
		typeName.value = e[0].label;
	}


	//加载收支项目列表
	const InOutItemList = ref<Array>([]);
	const searchname = ref<string>('');
	const remark = ref<string>('');
	const loadGetInOutItemList = async () => {
		let params = {
			currentPage: current.value,
			pageSize: pageSize.value,
			search: JSON.stringify({
				name: searchname.value,
				type: typeName.value,
				remark: remark.value
			})
		}
		const res = await getInOutItem(params)
		if (res && res.code === 200) {
			listTotal.value = res.data.total
			InOutItemList.value = res.data.rows
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
		loadGetInOutItemList();
	}

	onMounted(async () => {
		await loadGetInOutItemList();
	})
</script>

<style lang="scss">
	.goods-row-coll {
		border-radius: 8rpx;
		width: calc(100% - 32rpx);
		margin: 10rpx 0rpx 10rpx 10rpx;
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
		/* 层级低于分页栏，不遮挡分页 */
		z-index: 1;
		/* 扣除 navbar 高度，避免内容被导航栏遮挡 */
		padding-top: var(--u-navbar-height, 88rpx);
		/* 扣除分页栏高度，避免内容被分页遮挡 */
		padding-bottom: 40px;
	}
</style>