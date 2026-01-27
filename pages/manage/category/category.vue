<template>
	<view style="height: 100vh;background:rgba(var(--u-type-primary-rgb), 0.1);">
		<u-navbar :is-back="true" :background="background" :title="title" back-icon-color="#ffffff"
			title-color="#ffffff">
		</u-navbar>
		<u-toast ref="uToastRef" />
		<scroll-view scroll-y="y" class="scrollviewpadding">
			<tki-tree ref="tkiTreeRef" :selectParent="true" :multiple="true" :range="categoryId_type"
				@confirm="treeConfirm" rangeKey="name"></tki-tree>
			<u-divider :color="$u.color.primary">到底了</u-divider>
		</scroll-view>
		<view>
			<u-form label-width="160rpx" label-align="right">
				<u-row gutter="10">
					<u-col span="12"><u-form-item label="*名称："><u-input v-model="categoryDetail.name"
								placeholder="请输入名称" /></u-form-item></u-col>
					<u-col span="12">
						<u-form-item label="上级目录：">
							<!-- 							<u-action-sheet v-model="tkiTreeShow">
								<u-action-sheet-item>
									<scroll-view scroll-y="y" class="scrollviewpadding">
										<tki-tree ref="tkiTreeParentRef" :selectParent="true" :multiple="false"
											:range="categoryId_type" @confirm="tkiTreeParentConfirm"
											rangeKey="name"></tki-tree>
										<u-divider :color="$u.color.primary">到底了</u-divider>
									</scroll-view>
								</u-action-sheet-item>
							</u-action-sheet> -->
							<u-select v-model="tkiTreeShow" mode="mutil-column-auto" :list="categoryType"
								label-name="title" @confirm="tkiTreeParentConfirm"
								@cancel="tkiTreeParentCancel"></u-select>
							<u-input type='select' v-model="categoryDetail.parentName" placeholder="请选择类别"
								:clearable="false" @click="tkiTreeShow = true" />
						</u-form-item>
					</u-col>
					<u-col span="6"><u-form-item label="*编号："><u-input v-model="categoryDetail.serialNo"
								placeholder="请输入编号" /></u-form-item></u-col>
					<u-col span="6"><u-form-item label="排序："><u-input v-model="categoryDetail.sort"
								placeholder="请输入排序" /></u-form-item></u-col>
				</u-row>
			</u-form>
			<u-gap></u-gap>
			<view class="flex-buttons">
				<u-row gutter="10">
					<u-button type="warning" size="default" @click="editCategory">编辑</u-button>
					<u-button type="primary" size="default" @click="resetSearch">重置</u-button>
					<u-button type="success" size="default" @click="handleSave">保存</u-button>
					<u-button type="error" size="default" @click="openDeleteModal">删除</u-button>
					<u-modal v-model="showDeleteModal" :content="content" :show-cancel-button="true"
						cancel-color="#606266" confirm-color="#2979ff" @confirm="confirm" @cancel="cancel"
						:show-title="false"></u-modal>
				</u-row>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted, watch } from 'vue'
	import { deleteCategory, getMaterialCategory, getMaterialCategoryById, updateCategory, addCategory } from '../../../api/api'
	import { Request, color, $u, useTheme } from 'uview-pro'
	import type { ActionSheetItem } from 'uview-pro/types/global'
	const { currentTheme, themes, darkMode } = useTheme();
	const title = ref<string>('商品类别')
	const uToastRef = ref()
	const showToast = (title : string, type : string) => {
		uToastRef.value.show({
			type,
			title
		})
	}
	const background = reactive({
		backgroundColor: ""
	})
	const updateNavbarBackground = () => {
		background.backgroundColor = $u.color.primary;
	};

	const tkiTreeRef = ref(null)
	const action = ref('') // add/edit 标记
	const selectedName = ref<string>('')
	const selectedId = ref<string>('')
	const categoryDetail = ref({
		id: '',
		name: '',
		serialNo: '',
		sort: '',
		remark: '',
		parentId: '',
		parentName: ''
	})
	// 树形组件 - 编辑/删除分类选择确认
	const treeConfirm = (selectedData) => {
		if (selectedData && selectedData.length > 0) {
			selectedName.value = selectedData.map(item => item.id).join(",")
		}
	}


	const tkiTreeShow = ref(false)
	const tkiTreeParentRef = ref(null)
	// 定义列表项接口
	interface LinkedListItem {
		value : number
		label : string
		children ?: LinkedListItem[]
	}
	const categoryType = ref<LinkedListItem[]>()
	// 上级分类树形组件 - 选择确认
	const tkiTreeParentConfirm = (e : any[]) => {
		//console.log(`选中的ID：${e[0].value} ---- 选中的名称：${e[0].label}`);
		categoryDetail.value.parentName = e[0].label;
		categoryDetail.value.parentId = e[0].value;
	}
	const tkiTreeParentCancel = (e : any[]) => {
		categoryDetail.value.parentName = '';
		categoryDetail.value.parentId = ''
		//console.log(`选中的ID：${categoryDetail.parentId} ---- 选中的名称：${categoryDetail.parentName}`);
	}
	//编辑分类
	const editCategory = async () => {
		tkiTreeRef.value._confirm()
		const selectedId = selectedName.value
		// 校验选中状态
		if (!selectedId) {
			showToast('请先选择要编辑的类别', 'warning');
			return
		}
		// 校验是否多选
		const selectedIds = selectedId.split(",")
		if (selectedIds.length > 1) {
			showToast('请选择一个类别', 'warning');
			return
		}
		action.value = "edit"
		try {
			let params = { id: selectedId }
			const res = await getMaterialCategoryById(params)
			if (res.code === 200) {
				categoryDetail.value = res.data
			}
		} catch (e) {
			console.log("请求错误", res.data)
			uni.showToast({ title: '获取数据失败', icon: 'none' })
		}
	}
	// 重置表单
	const resetSearch = () => {
		categoryDetail.value = {
			id: '',
			name: '',
			serialNo: '',
			sort: '',
			remark: '',
			parentName: '',
			parentId: ''
		}
		action.value = ""
		selectedName.value = ""
		loadCategoryIdTreeData()
	}

	//保存类别
	const handleSave = async () => {
		const myForm = categoryDetail.value
		// 表单校验
		if (!myForm.name || myForm.name.length === 0) {
			showToast('请输入商品名称', 'warning');
			return
		}
		if (!myForm.serialNo || myForm.serialNo.length === 0) {
			showToast('请输入编号', 'warning');
			return
		}

		const params = {
			id: myForm.id,
			name: myForm.name,
			serialNo: myForm.serialNo,
			sort: myForm.sort,
			remark: myForm.remark,
			parentId: myForm.parentId,
		}

		try {
			let res
			if (action.value === 'edit') {
				// 编辑：PUT请求
				res = await updateCategory(params)
				if (res.code === 200) {
					showToast('修改成功', 'success');
					resetSearch()
				} else {
					showToast('修改失败', 'error');
				}
			} else {
				// 新增：POST请求
				res = await addCategory(params)
				if (res.code === 200) {
					showToast('新增成功', 'success');
					resetSearch()
				} else {
					showToast('新增失败', 'error');
				}
			}
		} catch (error) {
			console.error('保存失败：', error)
			showToast('保存失败', 'error');
		} finally {
		}
	}
	// 删除商品类别
	const handleDelete = async () => {
		const id = selectedName.value
		try {
			const res = await deleteCategory(id)
			if (res.code === 200) {
				showToast('删除成功', 'success');
				resetSearch()
			} else {
				showToast('删除失败', 'error');
			}
		} catch (error) {
			console.error('删除失败：', error)
			showToast('删除失败', 'error');
		} finally {
			showDeleteModal.value = false
		}
	}
	const showDeleteModal = ref<boolean>(false)
	const content = ref<string>('确定要删除所选中的数据吗？')
	const openDeleteModal = () => {
		// 触发树形组件的确认事件，获取选中ID
		tkiTreeRef.value._confirm()
		const id = selectedName.value
		if (!id) {
			showToast('请选择删除的类别', 'warning');
			return
		}
		showDeleteModal.value = true
	}
	// 删除确认
	const confirm = () => {
		handleDelete()
	}
	// 删除取消
	const cancel = () => {
		selectedName.value = ""
		showDeleteModal.value = false
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
	onMounted(() => {
		loadCategoryIdTreeData()
	})

	//加载商品分类列表
	const categoryId_type = ref<Array>([]);
	const searchname = ref<string>('');
	const loadCategoryIdTreeData = async () => {
		let params = { id: '' }
		const res = await getMaterialCategory(params)
		if (res && res.length > 0) {
			categoryId_type.value = []
			categoryType.value = res
			res.forEach(annItem => {
				const row = {
					id: annItem.id,
					name: annItem.title, // 接口返回title，转换为树形组件需要的name
					children: [] // 初始化子节点数组
				}
				// 处理子节点（如果有）
				if (Array.isArray(annItem.children) && annItem.children.length > 0) {
					const childList = annItem.children.map(c => ({
						id: c.id,
						name: c.title // 子节点同样转换title为name
					}))
					row.children = childList
				}
				categoryId_type.value.push(row)

			})
		}
		else {
			uni.showToast({ title: '数据加载失败', icon: 'none' });
		}
	}
</script>

<style lang="scss">
	.scrollviewpadding {
		background: $u-bg-color;
		height: 700rpx;
	}
</style>