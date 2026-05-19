<!-- 基础资料-商品信息 - 新增/编辑-->
<template>
	<view style="min-height: 100vh;">
		<u-navbar :is-back="true" :title="title" title-color='#ffffff' back-icon-color='#ffffff'
			:background="background">
		</u-navbar>
		<u-toast ref="uToastRef" />
		<!-- 表单内容 -->
		<view class="popup-title">
			<u-form :model="myform" label-width="160rpx" :rules="rules" ref="uFormRef" label-align="right"
				:error-type="errorType">
				<u-form-item label-align="right" label="商品名称：" prop="name">
					<u-input v-model="myform.name" placeholder="请输入商品名称" /></u-form-item>
				<u-form-item label-align="right" label="商品条码：" prop="mBarCode">
					<u-input v-model="myform.mBarCode" placeholder="请输入商品条码" /></u-form-item>
				<u-form-item label-align="right" label="规格：">
					<u-input v-model="myform.standard" placeholder="请输入规格" /></u-form-item>
				<u-form-item label-align="right" label="型号：">
					<u-input v-model="myform.model" placeholder="请输入型号" /></u-form-item>
				<u-form-item label-align="right" label="品牌：">
					<u-input v-model="myform.brand" placeholder="请输入品牌" /></u-form-item>
				<u-form-item label-align="right" label="制造商：">
					<u-input v-model="myform.mfrs" placeholder="请输入制造商" /></u-form-item>
				<u-row gutter="5">
					<u-text :text="materialsExtendId" :show='false'></u-text>
					<u-col span="6">
						<u-form-item label-align="right" label="采购价：" prop="purchaseDecimal">
							<u-input v-model="myform.purchaseDecimal" type="digit" placeholder="请输入采购价" /></u-form-item>
					</u-col>
					<u-col span="6">
						<u-form-item label-align="right" label="销售价：">
							<u-input v-model="myform.wholesaleDecimal" type="digit"
								placeholder="请输入销售价" /></u-form-item>
					</u-col>
					<u-col span="12">
						<u-form-item label-align="right" label="零售价：">
							<u-input v-model="myform.commodityDecimal" type="digit"
								placeholder="请输入零售价" /></u-form-item>
					</u-col>
					<u-form-item label-align="right" label="备注：">
						<u-input v-model="myform.remark" placeholder="请输入备注" /></u-form-item>
				</u-row>
				<view class="image-grid">
					<view class="grid-item" v-for="(src, index) in imageList" :key="index"
						@click="openPreview(index)">
						<u-image :src="src" width="100%" height="200rpx" mode="aspectFit"></u-image>
					</view>
				</view>
			</u-form>
			<u-gap></u-gap>
			<view style="padding-bottom: 10rpx;">
				<u-row gutter="10">
					<u-button type="error" size="default" @click="Cancel()">取消</u-button>
					<u-button type="primary" size="default" @click="SaveMaterial()">保存</u-button>
				</u-row>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, watch } from 'vue'
	import { onLoad } from '@dcloudio/uni-app';
	import { $u, useTheme } from 'uview-pro'
	import type { FormRules } from 'uview-pro/types/global';
	import { getMaterialCategory, updateMaterial, getMaterialDetailById } from '../../../api/api'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('新增商品')
		
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

	// 编辑模式相关变量
	const isEdit = ref<boolean>(false);
	const materialId = ref<string>('');
	const materialsExtendId = ref<string>('');
	const uFormRef = ref();
	const errorType = ref(['message', 'toast']);
	const myform = reactive({
		name: '',
		mBarCode: '',
		brand: '',
		mfrs: '',
		purchaseDecimal: '',
		wholesaleDecimal: '',
		commodityDecimal: '',
		standard: '',
		model: '',
		unit: '',
		remark: ''
	});
	const rules : FormRules = {
		name: [
			{
				required: true,
				message: '请输入商品名称',
				trigger: 'change'
			}
		],
		mBarCode: [
			{
				required: true,
				message: '请输入商品条码',
				trigger: 'change'
			}
		]
	};

	//取消
	function Cancel() {
		uni.$u.route('pages/manage/material/material');
	}
	// 你的图片地址字符串
	const imageStr = ref<string>('');
	// 解析图片列表
	const imageList = ref<string[]>([])
	
	watch(imageStr, (newVal) => {
	  try {
	    if (newVal && newVal.trim() !== '') {
	      imageList.value = JSON.parse(newVal);
	    } else {
	      imageList.value = [];
	    }
	  } catch (e) {
	    console.error('图片地址解析失败', e);
	    imageList.value = [];
	  }
	}, { immediate: true });
	
	const openPreview = (index: number) => {
	  uni.previewImage({
	    current: index,        // 当前显示第几张
	    urls: imageList.value, // 所有图片地址
	    loop: true,            // 开启循环滑动
	  })
	}
	//获取商品价格扩展
	const getDetailList = async (billNumber : string) => {
		const res = await getMaterialDetailById(billNumber);
		if (res && res.code === 200) {
			const firstRow = res.data.rows[0] || {};
			materialsExtendId.value = firstRow.id || '';
			myform.purchaseDecimal = firstRow.purchaseDecimal || '';
			myform.commodityDecimal = firstRow.commodityDecimal || '';
			myform.wholesaleDecimal = firstRow.wholesaleDecimal || '';
			myform.mBarCode = firstRow.barCode || '';
		}
	}
	
	
	//保存
	const SaveMaterial = async () => {
		const valid = await uFormRef.value?.validate() as boolean;
		if (!valid) {
			return;
		}
		// 构建完整商品对象（1:1 匹配你提供的JSON结构）
		const commodityData = {
			id: isEdit.value ? Number(materialId.value) : null,
			name: myform.name || '',
			mfrs: myform.mfrs || '',
			model: myform.model || '',
			standard: myform.standard || '',
			brand: myform.brand || '',
			remark: myform.remark || '',
			// 条码
			mBarCode: myform.mBarCode || '',
			// 子规格价格列表（meList）
			meList: [
				{
					id: isEdit.value ? materialsExtendId.value : "", // 编辑有ID，新增空
					barCode: myform.mBarCode || '',
					purchaseDecimal: myform.purchaseDecimal || "0",
					commodityDecimal: myform.commodityDecimal || "0",
					wholesaleDecimal: myform.wholesaleDecimal || "0",
					lowDecimal: ""
				}
			],
			sortList: [],
			meDeleteIdList: []
		};

		// 直接传给接口（不再拆分info/meList，完全匹配后端JSON结构）
		let res;
		if (isEdit.value === true) {
			res = await updateMaterial(commodityData)
		} else {
			//res = await addMaterial(commodityData)
		}

		if (res.code === 200) {
			showToast(isEdit.value ? '更新成功' : '保存成功', 'success');
			uni.$u.route('pages/manage/material/material');
		} else {
			showToast('保存失败', 'error');
		}
	}

	onMounted(() => {
	});

	onLoad((option) => {
		const itemStr = option.item || '';
		const action = option.action || '';
		if (action === 'edit' && itemStr) {
			isEdit.value = true;
			title.value = '编辑商品';
			const item = JSON.parse(decodeURIComponent(itemStr));
			materialId.value = item.id || '';
			myform.name = item.name || '';
			myform.mBarCode = item.mBarCode || '';
			myform.brand = item.brand || '';
			myform.mfrs = item.mfrs || '';
			myform.purchaseDecimal = item.purchaseDecimal || '';
			myform.wholesaleDecimal = item.wholesaleDecimal || '';
			myform.commodityDecimal = item.commodityDecimal || '';
			myform.standard = item.standard || '';
			myform.model = item.model || '';
			myform.unit = item.unit || '';
			myform.remark = item.remark || '';
			imageStr.value=item.imgName || '';
			getDetailList(item.id)
		} else {
			isEdit.value = false;
			title.value = '新增商品';
		}
	});
	watch(
		[
			() => currentTheme.value,
			() => darkMode.value,
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

	interface ListItem {
		value : string
		label : string
	}
</script>

<style lang="scss">
	.scrollviewpadding {
		min-height: calc(100% - 200rpx);
	}

	.popup-title {
		padding: 10rpx;
		margin-bottom: 20rpx;
	}

	.good-item {
		background: rgba(var(--u-type-primary-rgb), 0.1);
		border: 1px solid rgba(var(--u-type-primary-rgb), 0.2);
		border-radius: 8rpx;
		width: calc(100% - 20rpx);
		margin: 10rpx 0rpx;
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
	}

	.value {
		flex: 1;
		word-break: break-all;
		font-size: 28rpx;
		color: $u-content-color;
	}
	.image-grid {
	  display: flex;
	  flex-wrap: wrap;
	  padding: 5rpx;
	}
	
	.grid-item {
	  width: calc(25% - 7rpx);
	}
	
	/* 图片样式 */
	:deep(.u-image) {
	  border-radius: 12rpx;
	  overflow: hidden;
	}
</style>