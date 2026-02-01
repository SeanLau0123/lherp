<!-- 销售管理-销售出库-详情 -->
<template>
	<view style="min-height: 100vh;">
		<u-navbar :is-back="true" :title="title" title-color='#ffffff' back-icon-color='#ffffff'
			:background="background">
		</u-navbar>
		<!-- 订单表头 -->
		<view class="popup-title">
			<u-form label-width="165rpx">
				<u-form-item label-align="right" label="客户：">
					<u-input v-model="customerName" :type="type" placeholder="请选择客户"
						@click="customerShow = true" /></u-form-item>
				<u-select v-model="customerShow" :list="customerList" @confirm="customerConfirm"></u-select>
				<u-form-item label-align="right" label="单据日期：">
					<u-input v-model="orderTime" :type="type" @click="pickorderDateShow = true" />
					<u-picker v-model="pickorderDateShow" mode="time" :default-time="orderTime" :params="timeparams"
						@confirm="orderTimeConfirm"></u-picker>
				</u-form-item>
				<u-form-item label-align="right" label="单据编号：">
					<u-input v-model="billno" placeholder="" /></u-form-item>
				<u-form-item label-align="right" placeholder="请选择关联订单" label="关联订单：">
					<u-input v-model="linknumber" /></u-form-item>
				<u-gap></u-gap>
				<u-row gutter="10">
					<u-button type="primary" size="default" @click="materialSelect()">插入行</u-button>
					<u-icon name="plus" label="插入行" label-size="32rpx" @click="materialSelect()"> ------</u-icon>
					<u-icon name="minus" label="删除行" label-size="32rpx"></u-icon>
				</u-row>
				<scroll-view class="scrollviewpadding">
					<view v-for="(item, index) in materialDetailList" :key="item.id || index"
						@click="">
						<view class="good-item" style="min-height: 80rpx;">
							<u-row gutter="5">
								<!-- 						<u-col span="4">
								<view class="goods-row">
									<u-text :text="item.id"></u-text>
								</view>
							</u-col> -->
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
				<!-- 订单表尾 -->
				<u-row gutter="10">
					<u-col span="6">
						<u-form-item label-align="right" label="折扣率：">
							<u-input v-model="discount" placeholder="请输入折扣率" />%</u-form-item>
					</u-col>
					<u-col span="6">
						<u-form-item label-align="right" label="收款折扣：">
							<u-input v-model="discountMoney" placeholder="请输入收款折扣" /></u-form-item>
					</u-col>
					<u-col span="6">
						<u-form-item label-align="right" label="折后金额：">
							<u-input v-model="discountLastMoney" placeholder="请输入折后金额" :disabled="true" /></u-form-item>
					</u-col>
					<u-col span="6">
						<u-form-item label-align="right" label="其它费用：">
							<u-input v-model="otherMoney" placeholder="请输入其它费用" /></u-form-item>
					</u-col>
					<u-col span="12">
						<u-form-item label-align="right" label="*结算账户：">
							<u-input v-model="accountName" placeholder="请选择结算账户" @click="accountShow = true" />
							<u-select v-model="accountShow" :list="accountList" @confirm="accountConfirm"></u-select>
						</u-form-item>
					</u-col>
					<u-col span="6">
						<u-form-item label-align="right" label="本次收款：">
							<u-input v-model="changeAmount" placeholder="请输入本次收款" /></u-form-item>
					</u-col>
					<u-col span="6">
						<u-form-item label-align="right" label="*本次欠款：">
							<u-input v-model="debt" :disabled="true" /></u-form-item>
					</u-col>
					<u-col span="12">
						<u-form-item label-align="right" label="销售人员：">
							<u-input v-model="salePersonName" placeholder="请选择销售人员"
								@click="salePersonShow = true" /></u-form-item>
						<u-select v-model="salePersonShow" :list="salePersonList"
							@confirm="salePersonConfirm"></u-select>
					</u-col>
				</u-row>
			</u-form>
			<u-gap></u-gap>
			<view>
				<u-row gutter="10">
					<u-button type="error" size="default" @click="">取消</u-button>
					<u-button type="warning" size="default" @click="">保存并审核</u-button>
					<u-button type="primary" size="default" @click="">保存</u-button>
				</u-row>
			</view>
		</view>
		<view>
		</view>
		<!-- 订单表尾 -->
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, watch } from 'vue'
	import { onLoad,onShow  } from '@dcloudio/uni-app';
	import { $u, useTheme } from 'uview-pro'
	import { getAllListBySelect, getOrderNumber, getAllAccount, getSalePerson } from '@/api/api.js'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('新增')
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
	const orderTime = ref("");
	// 定义响应式参数对象
	const timeparams = reactive({
		year: true,
		month: true,
		day: true,
		hour: true,
		minute: true,
		second: true
	})
	const pickorderDateShow = ref<boolean>(false)

	const initDefaultDates = () => {
		const timestamp = Date.now();
		orderTime.value = $u.timeFormat(timestamp, 'yyyy-mm-dd hh:MM:ss');
	};
	// 定义确认回调函数
	const orderTimeConfirm = (e : any[]) => {
		// 注意返回值为一个数组，单列时取数组的第一个元素即可(只有一个元素)
		const formattedDate = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:${e.second}`;
		orderTime.value = formattedDate
	}


	const billno = ref("");
	const linknumber = ref("");
	const getOrderNo = async () => {
		const res = await getOrderNumber()
		if (res && res.code === 200) {
			billno.value = "XSCK" + res.data.defaultNumber;
		}
		else {
			uni.showToast({ title: '客户加载失败', icon: 'none' });
		}
	}

	//加载客户列表
	const type = ref<string>('select')
	const customerShow = ref<boolean>(false)
	const customerName = ref<string>('');
	const customerId = ref<string>('');
	const customerList = ref<ListItem[]>([]);
	const loadGetCustomerlList = async () => {
		let params = { limit: 1 }
		const res = await getAllListBySelect(params)
		if (res) {
			customerList.value = res.map(item => ({
				value: item.id.toString() || '',
				label: item.supplier || ''
			}));
		}
		else {
			uni.showToast({ title: '客户加载失败', icon: 'none' });
		}
	}
	// 客户列表确认回调函数
	const customerConfirm = (e : any[]) => {
		customerName.value = e[0].label;
		customerId.value = e[0].value;
	}

	const discount = ref<string>('0');
	const discountMoney = ref<string>('0');
	const discountLastMoney = ref<string>('0');
	const otherMoney = ref<string>('0');

	//加载账户列表
	const accountShow = ref<boolean>(false)
	const accountName = ref<string>('');
	const accountId = ref<string>('');
	const accountList = ref<ListItem[]>([]);
	const loadGetAccountList = async () => {
		const res = await getAllAccount()
		if (res && res.code === 200) {
			accountList.value = res.data.accountList.map(item => ({
				value: item.id.toString() || '',
				label: item.name || ''
			}));
			accountName.value = accountList.value[0].label;
			accountId.value = accountList.value[0].value;
		}
		else {
			uni.showToast({ title: '账户列表加载失败', icon: 'none' });
		}
	}
	// 账户列表确认回调函数
	const accountConfirm = (e : any[]) => {
		accountName.value = e[0].label;
		accountId.value = e[0].value;
	}

	const changeAmount = ref<string>('0');
	const debt = ref<string>('0');

	//加载销售员列表
	const salePersonShow = ref<boolean>(false)
	const salePersonName = ref<string>('');
	const salePersonId = ref<string>('');
	const salePersonList = ref<ListItem[]>([]);
	const GetsalePersonList = async () => {
		let params = { type: 1 }
		const res = await getSalePerson(params)
		if (res) {
			salePersonList.value = res.map(item => ({
				value: item.value.toString() || '',
				label: item.text || ''
			}));
		}
		else {
			uni.showToast({ title: '销售员加载失败', icon: 'none' });
		}
	}
	// 销售员确认回调函数
	const salePersonConfirm = (e : any[]) => {
		salePersonName.value = e[0].label;
		salePersonId.value = e[0].value;
	}


	//获取采购入库主表
	const number = ref<string>('')
	const InDetailList = ref<any>('');
	const loadInDetailById = async () => {
		const res = await getInDetailById(number.value)
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

	function materialSelect() {
		uni.$u.route('pages/openorder/MaterialSelect');
	}
	const materialDetailList = ref<MaterialItem[]>([]);
	// 加载商品详情数据
	const materialDetail = ref({
		name: '',
		expiryNum: '',
		billPrice: '',
		total: '',
		remark: ''
	});
	onMounted(() => {
		// 监听全局事件，接收新商品数据
		uni.$on('addMaterialDetail', (newMaterialData) => {
			console.log('接收新商品数据：', newMaterialData);
			// 1. 容错处理：避免空数据
			if (newMaterialData.name || newMaterialData.billPrice) {
				// 2. 追加数据到列表（不是覆盖，是 push，实现累加）
				materialDetailList.value.push(newMaterialData);
				// 可选：更新单个 materialDetail 为最新数据（非必须，仅用于备份）
				materialDetail.value = newMaterialData;
				uni.showToast({ title: '商品已添加到列表', icon: 'success' });
			} else {
				uni.showToast({ title: '商品数据无效', icon: 'none' });
			}
		});
	});

	onLoad((option) => {
		const materialDetailStr = option.materialDetail || '';
		if (materialDetailStr) {
			// 2. 解码并解析为对象，赋值给响应式变量
			const materialDetailObj = JSON.parse(decodeURIComponent(materialDetailStr));
			materialDetail.value = materialDetailObj;

			materialDetailList.value.push(materialDetailObj)
			// 此时即可使用 materialDetail.value 中的数据（如渲染到模板、提交接口等）
			console.log('接收的商品详情：', materialDetail.value);
		}
		loadGetCustomerlList();
		initDefaultDates();
		getOrderNo();
		loadGetAccountList();
		GetsalePersonList();
	});
	
	// 新增：页面每次显示时，打印列表长度（验证响应式，兜底排查）
	onShow(() => {
	  console.log('当前商品列表长度：', materialDetailList.value.length);
	});
</script>

<style lang="scss">
	.scrollviewpadding {
		min-height: calc(100% - 200rpx);
	}

	.popup-title {
		padding: 0rpx 10rpx;
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