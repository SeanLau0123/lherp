<!-- 采购管理-采购入库 - 新增-->
<template>
	<view style="min-height: 100vh;">
		<u-navbar :is-back="true" :title="title" title-color='#ffffff' back-icon-color='#ffffff'
			:background="background">
		</u-navbar>
		<u-toast ref="uToastRef" />
		<!-- 订单表头 -->
		<view class="popup-title">
			<u-form :model="myform" label-width="160rpx" :rules="rules" ref="uFormRef" label-align="right"
				:error-type="errorType">
				<u-form-item label-align="right" label="付款会员：" prop="member">
					<u-input v-model="myform.member" :type="type" placeholder="请选择付款会员"
						@click="memberShow = true" /></u-form-item>
				<u-select v-model="memberShow" :list="memberList" @confirm="memberConfirm"></u-select>
				<u-form-item label-align="right" label="单据日期：" prop="orderTime">
					<u-input v-model="myform.orderTime" :type="type" @click="pickorderDateShow = true" />
					<u-picker v-model="pickorderDateShow" mode="time" :default-time="myform.orderTime"
						:params="timeparams" @confirm="orderTimeConfirm"></u-picker>
				</u-form-item>
				<u-form-item label-align="right" label="单据编号：">
					<u-input v-model="billno" :disabled="isEdit" />
					<text>{{ orderId }}</text>
				</u-form-item>
				<u-form-item label-align="right" label="财务人员：" prop="financialPerson">
					<u-input v-model="myform.financialPerson" placeholder="请选择财务人员" @click="financialPersonShow = true"
						:type="type" /></u-form-item>
				<u-select v-model="financialPersonShow" :list="financialPersonList"
					@confirm="financialPersonConfirm"></u-select>
				<u-form-item label-align="right" label="备注：">
					<u-input v-model="myform.remark" placeholder="请输入备注" /></u-form-item>
				<u-gap></u-gap>
				<!-- 订单明细 -->
				<view class="rowinfo">
					<u-row gutter="10">
						<u-checkbox v-model="selectAll" @change="handleSelectAll">全选</u-checkbox>
						<u-button type="primary" size="mini" @click="accountSelect()">插入行</u-button>
						<u-button type="primary" size="mini" @click="accountDelete()">删除行</u-button>
					</u-row>
					<scroll-view class="scrollviewpadding">
						<view v-for="(item, index) in accountDetailList" :key="item.id || index">
							<u-row gutter="5">
								<u-col span="1">
									<u-checkbox v-model="item.checked" @change="checkboxChange"
										:name="index"></u-checkbox>
								</u-col>
								<u-col span="11">
									<view class="good-item" style="min-height: 80rpx;">
										<u-col span="12">
											<view class="goods-row">
												<text class="label">账户名称：</text>
												<text>{{ item.name }}</text>
											</view>
										</u-col>
										<u-col span="12">
											<view class="goods-row">
												<text class="label">金额：</text>
												<text class="value">{{ item.total || '0' }}</text>
											</view>
										</u-col>
										<u-col span="12">
											<view class="goods-row">
												<text class="label">备注：</text>
												<text class="value">{{ item.remark }}</text>
											</view>
										</u-col>
									</view>
								</u-col></u-row>
						</view>
					</scroll-view>
				</view>
				<!-- 订单表尾 -->
				<view class="good-item">
					<u-row gutter="10">
						<u-col span="12">
							<view class="goods-row">
								<text class="label">合计金额：</text>
								<u-text mode="price" :text="myform.totalAmount"></u-text>
								<text class="label">收款金额：</text>
								<u-text mode="price" :text="myform.totalAmount"></u-text>
							</view>
						</u-col>
					</u-row>
				</view>
			</u-form>
			<u-gap></u-gap>
			<view style="padding-bottom: 10rpx;">
				<u-row gutter="10">
					<u-button type="error" size="default" @click="Cancel()">取消</u-button>
					<u-button type="warning" size="default" @click="">保存并审核</u-button>
					<u-button type="primary" size="default" @click="SavePurchaseIn()">保存</u-button>
				</u-row>
			</view>
		</view>
		<!-- 明细行 账户金额-->
		<u-popup v-model="addShow" mode="bottom" height="700rpx" border-radius="8">
			<view style="padding: 10rpx 10rpx;">
				<view>
					<u-row gutter="10" justify="between">
						<view class="u-btn-picker u-btn-picker--tips" @click="accountDetailClose">取消</view>
						<view class="u-btn-picker u-btn-picker--primary" @click="accountDetailSubmit">确认</view>
					</u-row>
					<u-line></u-line>
				</view>
				<u-form label-width="170rpx">
					<u-form-item label-align="right" label="账户名称：">
						<u-input v-model="accountDetail.name" placeholder="请选择账户名称" @click="accountShow = true"
							:type="type" :disabled="true" />
						<u-select v-model="accountShow" :list="accountList" @confirm="accountConfirm"></u-select>
					</u-form-item>
					<u-row gutter="10">
						<u-col span="12">
							<u-form-item label-align="right" label="金额：">
								<u-input v-model="accountDetail.price" type="digit" /></u-form-item>
						</u-col>
						<u-col span="12">
							<u-form-item label-align="right" label="备注：">
								<u-input v-model="accountDetail.remark" /></u-form-item>
						</u-col>
					</u-row>
				</u-form>
			</view>
		</u-popup>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, watch } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { $u, useTheme } from 'uview-pro'
	import type { FormRules } from 'uview-pro/types/global';
	import { USER_INFO } from "@/common/util/constants";
	import {
		getFinancialPerson, getOrderNumber, getAllAccount, getDepotInfo,
		addSaveFinancial, getFinancialDetailByNumber, getAccountListById, updateFinancial, getMaterialByBarCode,
		getMemberBySelect
	} from '@/api/api.js'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('新增')

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
	const headStyle = reactive({
		fontSize: '28rpx',
		color: $u.color.primary,
		lineHeight: '32rpx',
		padding: '20rpx'
	})
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
		myform.orderTime = $u.timeFormat(timestamp, 'yyyy-mm-dd hh:MM:ss');
	};
	// 定义确认回调函数
	const orderTimeConfirm = (e : any[]) => {
		// 注意返回值为一个数组，单列时取数组的第一个元素即可(只有一个元素)
		const formattedDate = `${e.year}-${e.month}-${e.day} ${e.hour}:${e.minute}:${e.second}`;
		myform.orderTime = formattedDate
	}


	const billno = ref("");
	const getOrderNo = async () => {
		const res = await getOrderNumber()
		if (res && res.code === 200) {
			billno.value = "SYF" + res.data.defaultNumber;
		}
	}

	//加载会员列表
	const type = ref<string>('select')
	const memberShow = ref<boolean>(false)
	const memberName = ref<string>('');
	const memberId = ref<string>('');
	const memberList = ref<ListItem[]>([]);
	const loadGetmemberList = async () => {
		let params = { limit: 1 }
		const res = await getMemberBySelect(params)
		if (res) {
			memberList.value = res.map(item => ({
				value: item.id.toString() || '',
				label: item.supplier || ''
			}));
		}
		else {
			uni.showToast({ title: '会员加载失败', icon: 'none' });
		}
	}
	// 会员列表确认回调函数
	const memberConfirm = (e : any[]) => {
		memberName.value = e[0].label;
		memberId.value = e[0].value;
		myform.member = memberName.value;
	}

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
			accountDetail.value.name = accountName.value;
		}
		else {
			uni.showToast({ title: '账户列表加载失败', icon: 'none' });
		}
	}
	// 账户列表确认回调函数
	const accountConfirm = (e : any[]) => {
		accountName.value = e[0].label;
		accountId.value = e[0].value;
		accountDetail.value.name = accountName.value;
	}

	//加载财务人员列表
	const financialPersonShow = ref<boolean>(false)
	const financialPersonName = ref<string>('');
	const financialPersonId = ref<string>('');
	const financialPersonList = ref<ListItem[]>([]);
	const getFinancialPersonList = async () => {
		let params = { type: '财务员' }
		const res = await getFinancialPerson(params)
		if (res) {
			financialPersonList.value = res.data.personList.map(item => ({
				value: item.id.toString() || '',
				label: item.name || ''
			}));
		}
		else {
			uni.showToast({ title: '财务人员加载失败', icon: 'none' });
		}
	}
	//财务人员确认回调函数
	const financialPersonConfirm = (e : any[]) => {
		financialPersonName.value = e[0].label;
		financialPersonId.value = e[0].value;
		myform.financialPerson = financialPersonName.value;
	}

	const addShow = ref<boolean>(false)
	//新增明细行
	function accountSelect() {
		addShow.value = true;
		loadGetAccountList();
	}
	const selectAll = ref<boolean>(false)
	// 全选
	const handleSelectAll = (value : boolean) => {
		accountDetailList.value.forEach(item => {
			item.checked = value;
		});
		accountDetailList.value = [...accountDetailList.value];
	}

	const checkboxChange = (e : boolean, name : string) => {
		const index = parseInt(name)
		if (index >= 0 && index < accountDetailList.value.length) {
			accountDetailList.value[index].checked = e
		}
		// 同步全选
		const allChecked = accountDetailList.value.every(item => item.checked)
		selectAll.value = allChecked
		accountDetailList.value = [...accountDetailList.value];
	}

	//删除明细行
	function accountDelete() {
		// 过滤掉选中的行
		accountDetailList.value = accountDetailList.value.filter(item => !item.checked);
		// 重置全选
		selectAll.value = false;
		const total = accountDetailList.value.reduce((sum, item) => {
			return sum + Number(item.total || 0);
		}, 0);
		myform.totalAmount = total;
	}
	// const accountDetail = ref({
	// 	id: '',
	// 	name: '',
	// 	enableSerialNumber: '',
	// 	barCode: '',
	// 	standard: '',
	// 	model: '',
	// 	brand: '',
	// 	stock: '',
	// 	unit: '',
	// 	expiryNum: '',
	// 	billPrice: '',
	// 	total: '',
	// 	remark: ''
	// });
	const accountDetailList = ref<AccountItem[]>([]);

	function addAccountToList(newAccountData) {
		if (!newAccountData.name) {
			uni.showToast({ title: '单据明细不能为空', icon: 'none' });
			return;
		}
		// 给新行添加checked属性
		const newItem = {
			...newAccountData,
			checked: false
		};
		accountDetailList.value.push(newItem);
		accountDetailList.value = [...accountDetailList.value];
	}
	// 核心修改3：新增当前编辑行的索引变量
	const currentEditIndex = ref<number>(-1);
	//获取单据行明细
	const loadAccountList = async (headerId : string) => {
		const res = await getAccountListById(headerId)
		if (res && res.code === 200) {
			accountDetailList.value = [];
			const formattedRows = res.data.rows.map((row) => ({
				accountId: row.accountld || '',
				name: row.accountName || '',
				model: row.model || '',
				total: Number(row.eachAmount) || 0,
				remark: row.remark || '',
				checked: false
			}));
			accountDetailList.value = formattedRows;
		}
		else {
			uni.showToast({ title: '行明细加载失败', icon: 'none' });
			myform.totalAmount = 0;
		}
	}

	const accountDetail = ref({
		name: '',
		price: '',
		remark: ''
	})
	function accountDetailClose() {
		addShow.value = false;
		currentEditIndex.value = -1;
	}
	function accountDetailSubmit() {
		// 1. 数据验证
		if (!accountDetail.value.name) {
			showToast('请选择账户名称', 'warning');
			return;
		}
		if (!accountDetail.value.price) {
			showToast('请输入金额', 'warning');
			return;
		}
		const newAccountData = {
			id: Date.now().toString(),
			name: accountDetail.value.name,
			total: accountDetail.value.price,
			remark: accountDetail.value.remark || '',
			checked: false
		};
		// 3. 添加到列表
		accountDetailList.value.push(newAccountData);
		accountDetailList.value = [...accountDetailList.value];

		const total = accountDetailList.value.reduce((sum, item) => {
			return sum + Number(item.total || 0);
		}, 0);
		myform.totalAmount = total;
		// 5. 关闭弹窗并重置表单
		addShow.value = false;
		currentEditIndex.value = -1;
		accountDetail.value = {
			name: '',
			price: '',
			remark: ''
		};
	}

	// 新增：编辑模式相关变量
	const isEdit = ref<boolean>(false); // 是否为编辑模式
	const orderId = ref<string>(''); // 编辑的单据ID（后端主键）
	const editBillNo = ref<string>(''); // 编辑的单据编号（前端展示用）

	const getDetailData = async (billNumber : string) => {
		const res = await getFinancialDetailByNumber(billNumber);
		if (res && res.code === 200) {
			const detail = res.data;
			orderId.value = detail.id || '';
			billno.value = detail.billNo || '';
			memberId.value = detail.organId;
			memberName.value = detail.organName;
			accountId.value = detail.accountId || '';
			accountName.value = detail.accountName || '';
			financialPersonName.value = detail.handsPersonName;
			financialPersonId.value = detail.handsPersonId;
			myform.financialPerson = financialPersonName.value;
			myform.member = memberName.value;
			myform.orderTime = detail.billTimeStr;
			myform.remark = detail.remark;
			myform.totalAmount = detail.totalPrice;
			await loadAccountList(orderId.value);
		}
	}


	const uFormRef = ref();
	const errorType = ref(['message', 'toast']);
	const myform = reactive({
		member: '',
		orderTime: '',
		financialPerson: '',
		totalAmount: 0
	});
	const rules : FormRules = {
		member: [
			{
				required: true,
				message: '请选择会员',
				trigger: 'change'
			}
		],
		orderTime: [
			{
				required: true,
				message: '请选择单据日期',
				trigger: 'change'
			}
		],
		financialPerson: [
			{
				required: true,
				message: '请选择财务人员',
				trigger: 'change'
			}
		],
	};
	//新增取消
	function Cancel() {
		uni.$u.route('pages/openorder/InboundOrder/InboundOrder');
	}
	//新增保存
	const SavePurchaseIn = async () => {
		const valid = await uFormRef.value?.validate() as boolean;
		if (!valid) {
			return;
		}
		if (accountDetailList.value.length === 0) {
			showToast('单据明细不能为空', 'warning');
			return;
		}
		const totalAmount = accountDetailList.value.reduce((sum, item) => {
			const eachAmount = Number(item.total) || 0;
			return sum + eachAmount;
		}, 0);

		let userInfo = uni.getStorageSync(USER_INFO);
		const infoParams = {
			id: orderId.value,
			type: "收预付款",
			organId: memberId.value,
			creator: userInfo.id,
			handsPersonId: financialPersonId.value,
			totalPrice: totalAmount,
			changeAmount: totalAmount,
			defaultNumber: billno.value,
			billNo: billno.value, // 完整单据编号
			createTime: myform.orderTime,
			billTime: myform.orderTime, // 单据日期
			accountId: Number(accountId.value),
			remark: myform.remark || '11',
			status: "0" // 保存状态，
		};
		const rowsParams = accountDetailList.value.map((item, index) => {
			const rowId = isEdit ? (item.id || "") : `${Date.now()}${index.toString().padStart(6, '0')}`;
			return {
				id: rowId,
				eachAmount: Number(item.total) || 0,
				remark: item.remark || "",
				accountId: accountId.value
			};
		});

		// 4. 构建最终请求参数（与接口要求格式一致）
		const requestParams = {
			info: JSON.stringify(infoParams), // 主表参数转为JSON字符串
			rows: JSON.stringify(rowsParams) // 明细参数转为JSON字符串
		};
		let res;
		if (isEdit.value === true) {
			res = await updateFinancial(requestParams)
		}
		else {
			res = await addSaveFinancial(requestParams)
		}
		if (res.code === 200) {
			showToast(isEdit.value ? '更新成功' : '保存成功', 'success');
			uni.$u.route('pages/openorder/Financial/AdvanceIn/AdvanceIn');
		} else {
			showToast('保存失败', 'error');
		}
	}

	// 复选框变化事件
	const handleCheckboxChange = () => {
		// 可添加全选/反选逻辑
	};
	onMounted(() => {
		//监听全局事件，接收新商品数据
		uni.$on('addAccountDetail', (newAccountData) => {
			addAccountToList(newAccountData);
		});
	});

	onLoad((option) => {
		const itemStr = option.item || '';
		const action = option.action || '';
		if (action === 'edit' && itemStr) {
			isEdit.value = true;
			title.value = '编辑';
			const item = JSON.parse(decodeURIComponent(itemStr));
			billno.value = item.billNo; // 单据编号
			getDetailData(item.billNo);
		}
		else {
			isEdit.value = false;
			title.value = '新增';
			const accountDetailStr = option.accountDetail || '';
			if (accountDetailStr) {
				const accountDetailObj = JSON.parse(decodeURIComponent(accountDetailStr));
				addAccountToList(accountDetailObj);
			}
			initDefaultDates();
			getOrderNo();
		}
		loadGetmemberList();
		getFinancialPersonList();
	});
	watch(
		[
			() => currentTheme.value,
			() => darkMode.value,
			() => accountDetailList.value,
			() => isEdit.value
		],
		([newTheme, newDarkMode], [oldTheme, oldDarkMode]) => {
			if (newTheme !== oldTheme || newDarkMode !== oldDarkMode) {
				updateNavbarBackground();
			}
		},
		{
			immediate: true,
			deep: true
		}
	);
</script>

<style lang="scss">
	.scrollviewpadding {
		min-height: calc(100% - 200rpx);
	}

	.popup-title {
		padding: 0rpx 10rpx;
		margin-bottom: 20rpx;
	}

	.good-item {
		background: rgba(var(--u-type-primary-rgb), 0.1);
		border: 1px solid rgba(var(--u-type-primary-rgb), 0.2);
		border-radius: 8rpx;
		width: calc(100% - 20rpx);
		margin: 10rpx 0rpx;
	}

	.rowinfo {
		border: 1px solid rgba(var(--u-type-primary-rgb), 0.2);
		padding-top: 10rpx;
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

	.u-btn-picker {
		min-width: 150rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		text-align: center;
		text-decoration: none;
		font-size: 28rpx;
	}

	.u-btn-picker--primary {
		color: $u-type-primary;
	}

	.u-btn-picker--tips {
		color: $u-tips-color;
	}
</style>