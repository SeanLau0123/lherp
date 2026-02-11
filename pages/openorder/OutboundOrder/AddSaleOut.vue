<!-- 销售管理-销售出库-详情 -->
<template>
	<view style="min-height: 100vh;">
		<u-navbar :is-back="true" :title="title" title-color='#ffffff' back-icon-color='#ffffff'
			:background="background">
		</u-navbar>
		<!-- 订单表头 -->
		<view class="popup-title">
			<u-form :model="myform" label-width="165rpx" :rules="rules" ref="uFormRef" label-align="right"
				:error-type="errorType">
				<u-form-item label-align="right" label="客户：" prop="customer">
					<u-input v-model="myform.customer" :type="type" placeholder="请选择客户"
						@click="customerShow = true" /></u-form-item>
				<u-select v-model="customerShow" :list="customerList" @confirm="customerConfirm"></u-select>
				<u-form-item label-align="right" label="单据日期：" prop="orderTime">
					<u-input v-model="myform.orderTime" :type="type" @click="pickorderDateShow = true" />
					<u-picker v-model="pickorderDateShow" mode="time" :default-time="myform.orderTime"
						:params="timeparams" @confirm="orderTimeConfirm"></u-picker>
				</u-form-item>
				<u-form-item label-align="right" label="单据编号：">
					<u-input v-model="billno" placeholder="" :disabled="isEdit" />
					<text>{{orderId}}</text>
				</u-form-item>
				<u-form-item label-align="right" label="关联订单：">
					<u-input v-model="linknumber" placeholder="请选择关联订单" /></u-form-item>
				<u-form-item label-align="right" label="备注：">
					<u-input v-model="myform.remark" placeholder="请输入备注" /></u-form-item>
				<u-gap></u-gap>
				<!-- 订单明细 -->
				<view class="rowinfo">
					<u-row gutter="10">
						<u-checkbox v-model="selectAll" @change="handleSelectAll">全选</u-checkbox>
						<u-button type="primary" size="mini" @click="materialSelect()">插入行</u-button>
						<u-button type="primary" size="mini" @click="materialDelete()">删除行</u-button>
						<u-button type="primary" size="mini" @click="">扫码录入</u-button>
					</u-row>
					<scroll-view class="scrollviewpadding">
						<view v-for="(item, index) in materialDetailList" :key="item.id || index">
							<u-row gutter="5">
								<u-col span="1">
									<u-checkbox v-model="item.checked" @change="checkboxChange"
										:name="item.id"></u-checkbox>
								</u-col>
								<u-col span="11">
									<view class="good-item" style="min-height: 80rpx;"
										@click="goMaterialDetail(item,index)">
										<u-col span="12">
											<view class="goods-row">
												<text class="label">名称：</text>
												<text>{{ item.name }}</text>
												<u-text
													type="warning">{{item.enableSerialNumber === '1' ? '【序】' : ''}}</u-text>
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
												<text class="label">库存：</text>
												<text class="value">{{item.stock || '0' }}（{{item.unit || '-' }})</text>
											</view>
										</u-col>
										<u-col span="12">
											<view class="goods-row">
												<text class="label">数量：</text>
												<text class="value">{{ item.expiryNum || '-' }}</text>
												<text class="label">单价：</text>
												<text class="value">{{item.billPrice || '0' }}</text>
											</view>
										</u-col>
										<u-col span="12">
											<view class="goods-row">
												<text class="label">金额：</text>
												<text class="value">{{item.total || '0' }}</text>
											</view>
										</u-col>
										<u-col span="12">
											<view class="goods-row">
												<text class="label">备注：</text>
												<text class="value">{{item.remark}}</text>
											</view>
										</u-col>
									</view>
								</u-col></u-row>
						</view>
						<view class="good-item">
							<u-row gutter="5">
								<u-col span="6">
									<view class="goods-row">
										<text class="label">总数量：</text>
										<text class="value">{{ operNumber || '0' }}</text>
									</view>
								</u-col>
								<u-col span="6">
									<view class="goods-row">
										<text class="label">总金额：</text>
										<text class="value">{{ allPrice || '0' }}</text>
									</view>
								</u-col>
							</u-row>
						</view>
					</scroll-view>
				</view>
				<!-- 订单表尾 -->
				<u-row gutter="10">
					<u-col span="6">
						<u-form-item label-align="right" label="折扣率：" prop="discount">
							<u-input v-model="myform.discount" placeholder="请输入折扣率" type="digit" />%</u-form-item>
					</u-col>
					<u-col span="6">
						<u-form-item label-align="right" label="收款折扣：">
							<u-input v-model="discountMoney" placeholder="请输入收款折扣" /></u-form-item>
					</u-col>
					<u-col span="6">
						<u-form-item label-align="right" label="折后金额：">
							<u-input v-model="myform.discountLastMoney" placeholder="请输入折后金额" type="digit"
								:disabled="true" /></u-form-item>
					</u-col>
					<u-col span="6">
						<u-form-item label-align="right" label="其它费用：" prop="otherMoney">
							<u-input v-model="myform.otherMoney" placeholder="请输入其它费用" type="digit" /></u-form-item>
					</u-col>
					<u-col span="12">
						<u-form-item label-align="right" label="*结算账户：">
							<u-input v-model="accountName" placeholder="请选择结算账户" @click="accountShow = true"
								:type="type" :disabled="true" />
							<u-select v-model="accountShow" :list="accountList" @confirm="accountConfirm"></u-select>
						</u-form-item>
					</u-col>
					<u-col span="6">
						<u-form-item label-align="right" label="本次收款：" prop="changeAmount">
							<u-input v-model="myform.changeAmount" placeholder="请输入本次收款" type="digit" /></u-form-item>
					</u-col>
					<u-col span="6">
						<u-form-item label-align="right" label="*本次欠款：">
							<u-input v-model="myform.debt" :disabled="true" /></u-form-item>
					</u-col>
					<u-col span="12">
						<u-form-item label-align="right" label="销售人员：">
							<u-input v-model="salePersonName" placeholder="请选择销售人员" @click="salePersonShow = true"
								:type="type" /></u-form-item>
						<u-select v-model="salePersonShow" :list="salePersonList"
							@confirm="salePersonConfirm"></u-select>
					</u-col>
				</u-row>
			</u-form>
			<u-gap></u-gap>
			<view style="padding-bottom: 10rpx;">
				<u-row gutter="10">
					<u-button type="error" size="default" @click="">取消</u-button>
					<u-button type="warning" size="default" @click="">保存并审核</u-button>
					<u-button type="primary" size="default" @click="SaveSaleOut()">保存</u-button>
				</u-row>
			</view>
		</view>
		<!-- 明细行 数量金额-->
		<u-popup v-model="popupStock" mode="bottom" height="700rpx" border-radius="8">
			<view style="padding: 10rpx 10rpx;">
				<view>
					<u-row gutter="10" justify="between">
						<view class="u-btn-picker u-btn-picker--tips" @click="materialDetailClose">取消</view>
						<view class="u-btn-picker u-btn-picker--primary" @click="materialDetailSubmit">确认</view>
					</u-row>
					<u-line></u-line>
				</view>
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
								<u-input v-model="materialDetail.remark" /></u-form-item>
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
	import {
		getAllListBySelect, getOrderNumber, getAllAccount, getSalePerson, getDepotInfo,
		addSaveSaleOut, getInOutDetailById, getMaterialListByNumber, updateSaleOut, getMaterialByBarCode
	} from '@/api/api.js'
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
	const linknumber = ref("");
	const getOrderNo = async () => {
		const res = await getOrderNumber()
		if (res && res.code === 200) {
			billno.value = "XSCK" + res.data.defaultNumber;
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
		myform.customer = customerName.value;
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
				depotName.value = defaultDepot.depotName;
				depotId.value = defaultDepot.id.toString();
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

	//新增明细行
	function materialSelect() {
		uni.$u.route('pages/openorder/MaterialSelect');
	}

	const selectAll = ref<boolean>(false)
	// 全选
	const handleSelectAll = (value : boolean) => {
		materialDetailList.value.forEach(item => {
			item.checked = value;
		});
	}

	const checkboxChange = (e : boolean, name : string) => {
		const item = materialDetailList.value.find(item => item.id === name);
		if (item) {
			item.checked = e;
			// 同步全选状态
			const allChecked = materialDetailList.value.every(item => item.checked);
			selectAll.value = allChecked;
		}
	}

	//删除明细行
	function materialDelete() {
		// 过滤掉选中的行
		materialDetailList.value = materialDetailList.value.filter(item => !item.checked);
		// 重新计算汇总
		calculateMaterialSummary();
		calculateAmounts(false);
		// 重置全选
		selectAll.value = false;
	}
	// const materialDetail = ref({
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
	const materialDetailList = ref<MaterialItem[]>([]);

	function addMaterialToList(newMaterialData) {
		if (!newMaterialData.name) {
			uni.showToast({ title: '商品数据无效', icon: 'none' });
			return;
		}
		// 给新行添加checked属性
		const newItem = {
			...newMaterialData,
			checked: false
		};
		materialDetailList.value.push(newMaterialData);
		materialDetailList.value = [...materialDetailList.value];
		calculateMaterialSummary();
		calculateAmounts(false);
	}
	const popupStock = ref<boolean>(false)
	// 核心修改3：新增当前编辑行的索引变量
	const currentEditIndex = ref<number>(-1);
	//获取单据行明细
	const loadMaterialList = async () => {
		let params = {
			headerId: orderId.value,
			mpList: '扩展1,扩展2',
			linkType: 'basic',
		}
		const res = await getMaterialListByNumber(params)
		if (res && res.code === 200) {
			materialDetailList.value = [];
			const formattedRows = res.data.rows.map((row) => ({
				id: row.id || '',
				name: row.name || '',
				enableSerialNumber: row.enableSerialNumber || '0',
				mBarCode: row.barCode || '', // 后端barCode → 前端mBarCode
				standard: row.standard || '',
				model: row.model || '',
				brand: row.brand || '',
				stock: row.stock || '0',
				unit: row.unit || '',
				expiryNum: row.operNumber?.toString() || '', // 后端operNumber → 前端expiryNum
				billPrice: row.unitPrice?.toString() || '0', // 后端unitPrice → 前端billPrice
				total: row.allPrice?.toString() || '0', // 后端allPrice → 前端total
				remark: row.remark || '',
				depotId: row.depotId
			}));
			materialDetailList.value = formattedRows;
			// 明细加载完成后，先计算总金额
			calculateMaterialSummary();
		}
		else {
			uni.showToast({ title: '供应商加载失败', icon: 'none' });
		}
	}

	const materialDetail = ref({
		name: '',
		expiryNum: '1',
		billPrice: '',
		total: '',
		remark: ''
	})
	//编辑单据行信息
	function goMaterialDetail(item : any, index : number) {
		popupStock.value = true;
		currentEditIndex.value = index;
		getdepotlList();
		getMaterialByCode(item)
	}
	const getMaterialByCode = async (item : any) => {
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
		currentEditIndex.value = -1;
	}
	function materialDetailSubmit() {
		if (currentEditIndex.value === -1 || currentEditIndex.value >= materialDetailList.value.length) {
			uni.showToast({ title: '编辑行不存在', icon: 'none' });
			return;
		}

		// 更新原列表中的对应行数据
		materialDetailList.value[currentEditIndex.value] = {
			...materialDetailList.value[currentEditIndex.value],
			expiryNum: materialDetail.value.expiryNum,
			billPrice: materialDetail.value.billPrice,
			total: materialDetail.value.total,
			remark: materialDetail.value.remark,
			depotId: depotId.value
		};

		materialDetailList.value = [...materialDetailList.value];

		// 重新计算汇总和金额
		calculateMaterialSummary();
		calculateAmounts(false);

		// 关闭弹窗并重置索引
		popupStock.value = false;
		currentEditIndex.value = -1;
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

	// 新增：编辑模式相关变量
	const isEdit = ref<boolean>(false); // 是否为编辑模式
	const orderId = ref<string>(''); // 编辑的单据ID（后端主键）
	const editBillNo = ref<string>(''); // 编辑的单据编号（前端展示用）

	const getSaleOutDetailData = async (billNumber : string) => {
		const res = await getInOutDetailById(billNumber);
		if (res && res.code === 200) {
			const detail = res.data;

			orderId.value = detail.id || '';
			customerId.value = detail.organId;
			customerName.value = detail.organName;
			linknumber.value = detail.linkNumber || '';
			accountId.value = detail.accountId || '';
			accountName.value = detail.accountName || '';
			salePersonId.value = detail.salesMan || '';
			salePersonName.value = detail.salesManStr || '';
			myform.customer = customerName.value;
			myform.orderTime = detail.operTimeStr;
			myform.remark = detail.remark;
			await loadMaterialList();
			// 回显明细后重新计算总金额、欠款等
			calculateMaterialSummary();

			allPrice.value = detail.discountLastMoney?.toString() || '0';
			myform.discountLastMoney = detail.discountLastMoney?.toString() || '0';
			myform.discount = detail.discount?.toString() || '0';
			myform.otherMoney = detail.otherMoney?.toString() || '0';
			myform.changeAmount = detail.changeAmount?.toString() || '0';
			myform.debt = detail.debt?.toString() || '0';
		}
	}


	const uFormRef = ref();
	const errorType = ref(['message', 'toast']);
	const myform = reactive({
		customer: '',
		orderTime: '',
		discount: '0',
		otherMoney: '0',
		changeAmount: '0',
		debt: '0'
	});
	const rules : FormRules = {
		customer: [
			{
				required: true,
				message: '请选择客户',
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
		discount: [
			{
				required: true,
				message: '请输入折扣率',
				trigger: ['change', 'blur']
			}
		],
		otherMoney: [
			{
				required: true,
				message: '请输入其他费用',
				trigger: ['change', 'blur']
			}
		],
		changeAmount: [
			{
				required: true,
				message: '请输入金额',
				trigger: ['change', 'blur']
			}
		]
	};

	//新增保存
	const SaveSaleOut = async () => {
		const valid = await uFormRef.value?.validate() as boolean;
		if (!valid) {
			return;
		}
		if (materialDetailList.value.length === 0) {
			uni.showToast({ title: '单据明细不能为空', icon: 'none' });
			return;
		}
		const infoParams = {
			id: orderId.value,
			type: "出库",
			subType: "销售",
			defaultNumber: billno.value,
			number: billno.value, // 完整单据编号
			createTime: myform.orderTime,
			operTime: myform.orderTime, // 单据日期
			organId: customerId.value,
			accountId: Number(accountId.value),
			salesMan: salePersonId.value || "",
			remark: myform.remark,
			discount: Number(myform.discount) || 0, // 转为数字类型，默认0
			discountMoney: Number(discountMoney.value) || 0, // 转为数字类型，默认0
			discountLastMoney: Number(myform.discountLastMoney) || 0, // 转为数字类型，默认0
			otherMoney: Number(myform.otherMoney) || 0,
			changeAmount: Number(myform.changeAmount) || 0, // 本次收款，转为数字类型
			debt: Number(myform.debt) || 0, // 本次欠款，转为数字类型

			totalPrice: Number(myform.discountLastMoney) || 0,
			status: "0" // 保存状态，
		};
		const rowsParams = materialDetailList.value.map((item, index) => {
			const rowId = isEdit ? (item.id || "") : `${Date.now()}${index.toString().padStart(6, '0')}`;
			return {
				id: rowId,
				name: item.name || "",
				standard: item.standard || "",
				model: item.model || "",
				color: "",
				brand: item.brand || "",
				mfrs: "",
				otherField1: "",
				otherField2: "",
				otherField3: "",
				stock: Number(item.stock),
				unit: item.unit,
				snList: "",
				batchNumber: "",
				expirationDate: "",
				sku: "",
				preNumber: "",
				finishNumber: "",
				operNumber: Number(item.expiryNum) || 1,
				unitPrice: Number(item.billPrice) || 0,
				allPrice: Number(item.total) || 0,
				taxRate: 0,
				taxMoney: 0,
				taxLastMoney: Number(item.total) || 0,
				remark: item.remark || "",
				linkId: "",
				depotId: item.depotId,
				barCode: item.mBarCode || ""
			};
		});

		// 4. 构建最终请求参数（与接口要求格式一致）
		const requestParams = {
			info: JSON.stringify(infoParams), // 主表参数转为JSON字符串
			rows: JSON.stringify(rowsParams) // 明细参数转为JSON字符串
		};

		if (isEdit.value === true) {
			const res = await updateSaleOut(requestParams)
			if (res.code === 200) {
				uni.showToast({ title: '更新成功', icon: 'none' });
				uni.$u.route('pages/openorder/OutboundOrder/OutboundOrder');
			} else {
				uni.showToast({ title: '保存失败', icon: 'none' });
			}
		}
		else {
			const res = await addSaveSaleOut(requestParams)
			if (res.code === 200) {
				uni.showToast({ title: '保存成功', icon: 'none' });
				uni.$u.route('pages/openorder/OutboundOrder/OutboundOrder');
			} else {
				uni.showToast({ title: '保存失败', icon: 'none' });
			}
		}
	}

	const operNumber = ref<string>('0');
	const allPrice = ref<string>('0');
	const debt = ref<string>('0');
	// 新增：汇总商品明细，计算总数量、总金额
	const calculateMaterialSummary = () => {
		// 初始化汇总值
		let totalNum = 0; // 总数量
		let totalAmount = 0; // 总金额

		// 遍历商品明细列表，累加数据
		materialDetailList.value.forEach((item) => {
			// 1. 累加总数量（对应 expiryNum 操作数量）
			const itemNum = Number(item.expiryNum) || 0;
			totalNum += itemNum;

			// 2. 累加总金额（对应 total 行金额）
			const itemAmount = Number(item.total) || 0;
			totalAmount += itemAmount;
		});

		operNumber.value = totalNum.toFixed(0);
		allPrice.value = totalAmount.toFixed(2);
	};

	const discountMoney = ref<number>(0);
	// 核心：金额联动计算工具函数
	const calculateAmounts = (isManualReceive = false) => {

		if (isEdit.value && !isManualReceive) {
			return;
		}

		const totalAmount = Number(allPrice.value) || 0; 			// 商品总金额
		const discountRate = (Number(myform.discount) || 0) / 100; // 折扣率（转为小数，如 10% → 0.1）
		const discountMoneyNum = Number(discountMoney.value) || 0; 	// 收款折扣金额
		const otherMoneyNum = Number(myform.otherMoney) || 0; 		// 商品原始总金额
		const changeAmountNum = Number(myform.changeAmount) || 0;	// 本次收款
		// 2. 计算折后金额（商品总金额 - 收款折扣）
		const finalDiscountLastMoney = (totalAmount * (1 - discountRate) - discountMoneyNum).toFixed(2) - 0;
		myform.discountLastMoney = finalDiscountLastMoney.toString();
		// 3. 计算本次收款（未手动修改时，默认等于折后金额；手动修改时保留原值）
		const calcChangeAmount = (finalDiscountLastMoney + otherMoneyNum).toFixed(2) - 0;
		if (!isManualReceive) {
			myform.changeAmount = calcChangeAmount.toString();
		}
		// 4. 计算本次欠款（折后金额 - 本次收款）		
		const finalDebt = Math.max(calcChangeAmount - changeAmountNum, 0);
		myform.debt = finalDebt.toFixed(2)
	};
	// 复选框变化事件
	const handleCheckboxChange = () => {
		// 可添加全选/反选逻辑
	};
	onMounted(() => {
		//监听全局事件，接收新商品数据
		uni.$on('addMaterialDetail', (newMaterialData) => {
			addMaterialToList(newMaterialData);
		});
		calculateAmounts(false);
	});

	onLoad((option) => {
		const itemStr = option.item || '';
		const action = option.action || '';
		if (action === 'edit' && itemStr) {
			isEdit.value = true;
			title.value = '编辑';
			const item = JSON.parse(decodeURIComponent(itemStr));
			billno.value = item.number; // 单据编号
			getSaleOutDetailData(item.number);

		}
		else {
			isEdit.value = false;
			title.value = '新增';
			const materialDetailStr = option.materialDetail || '';
			if (materialDetailStr) {
				const materialDetailObj = JSON.parse(decodeURIComponent(materialDetailStr));
				addMaterialToList(materialDetailObj);
			}
			initDefaultDates();
			getOrderNo();
		}
		loadGetCustomerlList();
		loadGetAccountList();
		GetsalePersonList();
		calculateAmounts(false);
	});
	watch(
		[
			() => currentTheme.value,
			() => darkMode.value,
			() => materialDetailList.value,
			() => isEdit.value
		],
		([newTheme, newDarkMode, newMaterialList, newIsEdit], [oldTheme, oldDarkMode, oldMaterialList, oldIsEdit]) => {
			if (newTheme !== oldTheme || newDarkMode !== oldDarkMode) {
				updateNavbarBackground();
			}
			// 第二部分：商品明细列表变化时，自动汇总总数量、总金额
			if (newMaterialList !== oldMaterialList || newIsEdit !== oldIsEdit) {
				calculateMaterialSummary(); // 调用汇总函数
				calculateAmounts(newIsEdit);
			}
		},
		{
			immediate: true,
			deep: true
		}
	);
	watch(() => myform.discount, () => {
		calculateAmounts(false);
	});
	watch(() => discountMoney.value, () => {
		calculateAmounts(false);
	});
	watch(() => myform.otherMoney, () => {
		calculateAmounts(false);
	});
	watch(() => myform.changeAmount, () => {
		calculateAmounts(true);
	});
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
		width: calc(100% - 30rpx);
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
		width: 130rpx;
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