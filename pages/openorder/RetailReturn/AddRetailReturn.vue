<!-- 销售管理-销售出库-新增 -->
<template>
	<view>
		<u-toast ref="uToastRef" />
	</view>
	<view style="min-height: 100vh;">
		<u-navbar :is-back="true" :title="title" title-color='#ffffff' back-icon-color='#ffffff'
			:background="background">
		</u-navbar>
		<!-- 订单表头 -->
		<view class="popup-title">
			<u-form :model="myform" label-width="165rpx" :rules="rules" ref="uFormRef" label-align="right"
				:error-type="errorType">
				<u-form-item label-align="right" label="会员卡号：" prop="member">
					<u-input v-model="myform.member" :type="type" placeholder="请选择会员卡号"
						@click="memberShow = true" /></u-form-item>
				<u-select v-model="memberShow" :list="memberList" @confirm="memberConfirm"></u-select>
				<u-form-item label-align="right" label="单据日期：" prop="orderTime">
					<u-input v-model="myform.orderTime" :type="type" @click="pickorderDateShow = true" />
					<u-picker v-model="pickorderDateShow" mode="time" :default-time="myform.orderTime"
						:params="timeparams" @confirm="orderTimeConfirm"></u-picker>
				</u-form-item>
				<u-form-item label-align="right" label="单据编号：">
					<u-input v-model="billno" placeholder="" :disabled="isEdit" />
					<text>{{orderId}}</text>
				</u-form-item>
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
					<u-col span="12">
						<u-form-item label-align="right" label="单据金额：">
							<u-input v-model="myform.changeAmount" type="digit" :disabled="true" /></u-form-item>
					</u-col>
					<u-col span="12">
						<u-form-item label-align="right" label="付款金额：" prop="totalAmount">
							<u-input v-model="myform.totalAmount" placeholder="请输入付款金额" type="digit" @input="InputTotalAmount" /></u-form-item>
					</u-col>
					<u-col span="12">
						<u-form-item label-align="right" label="找零：">
							<u-input v-model="myform.backAmount" :disabled="true" /></u-form-item>
					</u-col>
					<u-col span="12">
						<u-form-item label-align="right" label="*付款账户：">
							<u-input v-model="accountName" placeholder="请选择付款账户" @click="accountShow = true"
								:type="type" :disabled="true" />
							<u-select v-model="accountShow" :list="accountList" @confirm="accountConfirm"></u-select>
						</u-form-item>
					</u-col>

				</u-row>
			</u-form>
			<u-gap></u-gap>
			<view style="padding-bottom: 10rpx;">
				<u-row gutter="10">
					<u-button type="error" size="default" @click="Cancel()">取消</u-button>
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
	import { USER_INFO } from "@/common/util/constants";
	import {
		getMemberBySelect, getOrderNumber, getAllAccount, getPartnerlList, getDepotInfo,
		addSaveOrder, getInOutDetailById, getMaterialListByNumber, updateSaleOut, getMaterialByBarCode
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
	const linknumber = ref("");
	const getOrderNo = async () => {
		const res = await getOrderNumber()
		if (res && res.code === 200) {
			billno.value = "LSTH" + res.data.defaultNumber;
		}
	}

	//加载会员列表
	const type = ref<string>('select')
	const memberShow = ref<boolean>(false)
	const memberName = ref<string>('');
	const memberId = ref<string>('');
	const memberList = ref<ListItem[]>([]);
	const loadGetmemberlList = async () => {
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
		}
		else {
			showToast('账户列表加载失败', 'warning');
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
		// 重置全选
		selectAll.value = false;
	}

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
	
	//付款金额变更
	const InputTotalAmount = (val : string) => {
		myform.backAmount = myform.totalAmount-myform.changeAmount;
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
			memberId.value = detail.organId;
			memberName.value = detail.organName;
			accountId.value = detail.accountId || '';
			accountName.value = detail.accountName || '';
			myform.member = memberName.value;
			myform.orderTime = detail.operTimeStr;
			myform.remark = detail.remark;
			await loadMaterialList();
			myform.changeAmount = detail.changeAmount?.toString() || '0';
			myform.backAmount = detail.backAmount?.toString() || '0';
			myform.totalAmount = detail.changeAmount + detail.backAmount;
		}
	}


	const uFormRef = ref();
	const errorType = ref(['message', 'toast']);
	const myform = reactive({
		member: '',
		orderTime: '',
		payType: '',
		changeAmount: '',
		backAmount: '',
		totalAmount: ''
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
		totalAmount: [
			{
				required: true,
				message: '请输入付款金额',
				trigger: ['change', 'blur'],
				validator: (rule : any, value : any, callback : any) => {
					const numValue = Number(value || 0);
					if (numValue <= 0 || !value) {
						callback(new Error('请输入付款金额'));
					} else {
						callback();
					}
				}
			}
		]
	};
	//新增取消
	function Cancel() {
		uni.$u.route('pages/openorder/RetailReturn/RetailReturn');
	}

	//新增保存
	const SaveSaleOut = async () => {
		const valid = await uFormRef.value?.validate() as boolean;
		if (!valid) {
			return;
		}
		if (materialDetailList.value.length === 0) {
			showToast('单据明细不能为空', 'warning');
			return;
		}
		let userInfo = uni.getStorageSync(USER_INFO);
		const infoParams = {
			id: orderId.value,
			type: "入库",
			subType: "零售退货",
			defaultNumber: billno.value,
			number: billno.value, // 完整单据编号
			createTime: myform.orderTime,
			operTime: myform.orderTime, // 单据日期
			organId: memberId.value,
			creator: userInfo.id,
			accountId: Number(accountId.value),
			remark: myform.remark,
			changeAmount: Number(myform.changeAmount) || 0,
			backAmount: Number(myform.backAmount) || 0,
			totalPrice: Number(myform.changeAmount) || 0,
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
		let res;
		try {
			if (isEdit.value === true) {
				res = await updateSaleOut(requestParams)
			}
			else {
				res = await addSaveOrder(requestParams)
			}
			if (res.code === 200) {
				showToast(isEdit.value ? '更新成功' : '保存成功', 'success');
				uni.$u.route('pages/openorder/RetailReturn/RetailReturn');
			}
			else { showToast('保存失败', 'error'); }

		} catch (error) {
			showToast(error.data.message, 'warning');
		}
	}

	const operNumber = ref<string>('0');
	const allPrice = ref<string>('0');
	const backAmount = ref<string>('0');
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

		myform.changeAmount = allPrice.value || 0;
		myform.totalAmount = allPrice.value || 0;
		InputTotalAmount()
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
		loadGetmemberlList();
		loadGetAccountList();
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