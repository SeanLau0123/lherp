<template>
	<view class="tki-tree">
		<scroll-view class="tki-tree-view-sc" :scroll-y="true">
			<block v-for="(item, index) in treeList" :key="index">
				<view class="tki-tree-item" :style="[{
							paddingLeft: item.rank*15 + 'px',
							zIndex: item.rank*-1 +50
						}]" :class="{
							border: border === true,
							show: item.show,
							last: item.lastRank,
							showchild: item.showChild,
							open: item.open,
						}">
					<view class="tki-tree-label" @tap.stop="_treeItemTap(item, index)">
						<image class="tki-tree-icon"
							:src="item.lastRank ? lastIcon : item.showChild ? currentIcon : defaultIcon"></image>
						{{item.name}}
					</view>
					<view class="tki-tree-check" @tap.stop="_treeItemSelect(item, index)"
						v-if="selectParent?true:item.lastRank">
						<view class="tki-tree-check-yes" v-if="item.checked" :class="{'radio':!multiple}"
							:style="{'border-color':confirmColor}">
							<view class="tki-tree-check-yes-b" :style="{'background-color':confirmColor}"></view>
						</view>
						<view class="tki-tree-check-no" v-else :class="{'radio':!multiple}"
							:style="{'border-color':confirmColor}"></view>
					</view>
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

// 定义Props（Vue3语法）
const props = defineProps({
	range: {
		type: Array,
		default: () => []
	},
	idKey: {
		type: String,
		default: 'id'
	},
	rangeKey: {
		type: String,
		default: 'label'
	},
	title: {
		type: String,
		default: ''
	},
	multiple: { // 是否可以多选
		type: Boolean,
		default: false
	},
	selectParent: { //是否可以选父级
		type: Boolean,
		default: false
	},
	foldAll: { //折叠时关闭所有已经打开的子集
		type: Boolean,
		default: false
	},
	confirmColor: { // 确定按钮颜色
		type: String,
		default: ''
	},
	cancelColor: { // 取消按钮颜色
		type: String,
		default: ''
	},
	titleColor: { // 标题颜色
		type: String,
		default: ''
	},
	currentIcon: { // 展开时候的icon
		type: String,
		default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAYAAACqj0o2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MEQ0QTM0MzQ1Q0RBMTFFOUE0MjY4NzI1Njc1RjI1ODIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MEQ0QTM0MzU1Q0RBMTFFOUE0MjY4NzI1Njc1RjI1ODIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowRDRBMzQzMjVDREExMUU5QTQyNjg3MjU2NzVGMjU4MiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowRDRBMzQzMzVDREExMUU5QTQyNjg3MjU2NzVGMjU4MiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PidwepsAAAK0SURBVHja7JxbTsJAFIYHww7ciStgCeoGvGxAiOsgURegoL5720AXYLiIr0aJviq3Zx3PhIEnKG3ndtr+f3KixrSUj/ZjzjClIqUUiFm2gAAQAREQEUAEREAERAQQAREQAREBREAEREBEEqa67h9RFDWllDv0awWYlqlQHmu1WjMRRMoV1QFttA12y3xRtdNczq8EsE4/f8FumX2q77ROvNXk8UGMEKdUz6tYJHljaZAbuyUH+UR1to5BEohTuqwPCeS4pAA/qY6o/kyHOAMCeRK3owJnj+rH1jjxhqpVsstaebCz6TmnHWyXyY+xHjSBWBY/bvSgadtXBj9u9KCN3rnIfkzkQVsTEEX0Y2IP2oKo/HhMICcFAThUcwVZNGU6FdbX/XURzkbVF4+ybGhjPrFdgP66QdXNurGtSdk6Xdb9nAJ8oDo3OQlsQZzkdPw41ONBo6vI5scDefRjZg+6gpg3Pxp50CXEvPjR2IOuIXL3oxUPuobI3Y9WPOgDIlc/WvOgL4iL/vqFCcD7LH0xB4hj7cfQ/fWH9qCT+FhG0tN+DBk1PzjOM0SVllixcsBT1AvYc/kAPhc0hRg/3uvxoCgKRN9+dOrBUBB9+9GpB0NC9OVH5x4MDdG1H714kANEV3705kEOEBf9dcPi/lQnsuvLg1wgSu3Ha0v7Uh4MMgUXeuG71H407a+VBy9CPQkOdw+MtB+nGbd/D+FBbhBNxo9SjwcngJjNj0E9yBFiFj8G9SBXiGn8GNyDnCEm8SMLD3KHGOdHNh7kDjHOj2w8mAeIi/5arX+c6b/fxHz9oADEdGdjR/fXCw/OOB5oVfCOgnepz8IB14PMw03jCmTE+QBx5z0gAmKSqK9OUF+hcAeIhu/QYr4Qie8rjW83hhMBERARQAREQAREBBABERCLnH8BBgA+TQI7U4t53AAAAABJRU5ErkJggg=='
	},
	defaultIcon: { // 折叠时候的icon
		type: String,
		default: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFEAAABRCAYAAACqj0o2AAACE0lEQVR4Xu3c200DMRCF4XEltJAOkEugA+ggpUAHoQMqiFMCdEAJUMEiS4mEELlIO7bPOeN9i6K1rG/952myyea1WiCtXmEuYBPR4RBMxInoIOCwhOtJLKVszWyXc/5y2BvNEq6I+/3+kFK6M7OHnPM7jcLKjbZAvD/uaZtzflm5P4rbWyJWgDcze1LPuzVihfxUz7sH4ilJ2bx7Isrm3RtRMu8RiHJ5j0SUyXs0okTeCIj0eSMh0uaNhkiZNyIiXd7IiDR5oyNS5M2ACJ83EyJs3myIkHkzIsLlzYwIkzc7IkTeCojD81ZCHJa3GuKQvBURu+etjNgtb3XELnlHQGyedyTEZnlHQ2ySd0RE97wjI7rlHR3RJe+JeIrbLOecD6ePpZQ6W1kn2epo4MUrPOKyLN8ppYq1+y1VStncOjIdGnFZlo+U0uOtWOeOY2TE12Ouq//pEA7xXL7XfvcufR8K0Svfv6CREN3yDYfYIt9QiK3yjYTYLF95xB75SiP2ylcZsVu+cogj8pVCHJWvEuKwfOkREfKlRkTJlxkRJl86RMR8qRBR82VChM0XHpEhX2hElnyREWnyhUNkzBcKkTVfJETafIcjKuQ7FFEl35GIMvl2R1TMtyuiar49EWXzbY5oZpv/hibXTF2h3+s60FRKeT6+3TjMS3nrA3ZFRD8xrfY3ER1kJ+JEdBBwWGKeRAfEH1wS5WFZSDB/AAAAAElFTkSuQmCC'
	},
	lastIcon: { // 没有子集的icon
		type: String,
		default: ''
	},
	border: { // 是否有分割线
		type: Boolean,
		default: false
	},
})

// 定义Emits（Vue3语法）
const emit = defineEmits(['cancel', 'confirm'])

// 响应式数据（替代Vue2的data）
const showTree = ref(false)
const treeList = ref([])
const selectIndex = ref(-1)
const currentSelectedIds = ref('')

// 方法定义（Vue3直接定义函数）
const _show = () => {
	showTree.value = true
}

const _hide = () => {
	showTree.value = false
}

const _cancel = () => {
	_hide()
	emit("cancel", '')
}

const _confirm = () => {
	// 处理所选数据
	let rt = []
	let obj = {}
	treeList.value.forEach((v, i) => {
		if (treeList.value[i].checked) {
			obj = {}
			obj.parents = treeList.value[i].parents
			obj = Object.assign(obj, treeList.value[i].source)
			// 移除子元素
			delete obj.children
			rt.push(obj)
		}
	})
	_hide()
	emit("confirm", rt)
}

const _nodeConfirm = () => {
	// 处理所选数据
	let rt = []
	let obj = {}
	treeList.value.forEach((v, i) => {
		if (treeList.value[i].checked) {
			obj = {}
			obj.parents = treeList.value[i].parents
			obj = Object.assign(obj, treeList.value[i].source)
			// 移除子元素
			delete obj.children
			rt.push(obj)
		}
	})
	_hide()
	emit("confirm", rt)
}

//扁平化树结构（修复了原代码未定义的childrenid变量）
const _renderTreeList = (list = [], rank = 0, parentId = [], parents = []) => {
	list.forEach(item => {
		treeList.value.push({
			id: item[props.idKey],
			name: item[props.rangeKey],
			source: item,
			parentId, // 父级id数组
			parents, // 父级名称/id数组
			rank, // 层级
			showChild: false, //子级是否显示
			open: false, //是否打开
			show: rank === 0, // 自身是否显示
			hideArr: [],
			orChecked: item.checked ? item.checked : false,
			checked: item.checked ? item.checked : false,
		})
		if (Array.isArray(item.children) && item.children.length > 0) {
			let parentid = [...parentId]
			let parentArr = [...parents]
			// 移除children属性（原代码逻辑）
			delete parentArr.children
			parentid.push(item[props.idKey])
			parentArr.push({
				[props.idKey]: item[props.idKey],
				[props.rangeKey]: item[props.rangeKey]
			})
			_renderTreeList(item.children, rank + 1, parentid, parentArr)
		} else {
			// 标记为最后一级节点
			treeList.value[treeList.value.length - 1].lastRank = true
		}
	})
}

// 处理默认选择
const _defaultSelect = () => {
	treeList.value.forEach((v, i) => {
		if (v.checked) {
			treeList.value.forEach((v2, i2) => {
				if (v.parentId.toString().indexOf(v2.parentId.toString()) >= 0) {
					v2.show = true
					if (v.parentId.includes(v2.id)) {
						v2.showChild = true
						v2.open = true
					}
				}
			})
		}
	})
}

// 点击节点事件
const _treeItemTap = (item, index) => {
	if (item.lastRank === true) {
		//点击最后一级时触发勾选
		treeList.value[index].checked = !treeList.value[index].checked
		_fixMultiple(index)
		return
	}
	let list = treeList.value
	let id = item.id
	item.showChild = !item.showChild
	item.open = item.showChild ? true : !item.open
	
	list.forEach((childItem, i) => {
		if (item.showChild === false) {
			//隐藏所有子级
			if (!childItem.parentId.includes(id)) {
				return
			}
			if (!props.foldAll) {
				if (childItem.lastRank !== true && !childItem.open) {
					childItem.showChild = false
				}
				// 为隐藏的内容添加标记
				if (childItem.show) {
					childItem.hideArr[item.rank] = id
				}
			} else {
				if (childItem.lastRank !== true) {
					childItem.showChild = false
				}
			}
			childItem.show = false
		} else {
			// 打开子集
			if (childItem.parentId[childItem.parentId.length - 1] === id) {
				childItem.show = true
			}
			// 打开被隐藏的子集
			if (childItem.parentId.includes(id) && !props.foldAll) {
				if (childItem.hideArr[item.rank] === id) {
					childItem.show = true
					if (childItem.open && childItem.showChild) {
						childItem.showChild = true
					} else {
						childItem.showChild = false
					}
					childItem.hideArr[item.rank] = null
				}
			}
		}
	})
}

// 勾选框点击事件
const _treeItemSelect = (item, index) => {
	treeList.value[index].checked = !treeList.value[index].checked
	_fixMultiple(index)
}

// 处理单选多选逻辑
const _fixMultiple = (index) => {
	if (!props.multiple) {
		// 单选模式：取消其他所有勾选
		treeList.value.forEach((v, i) => {
			treeList.value[i].checked = (i === index)
		})
	}
}

// 重置数据
const _reTreeList = () => {
	treeList.value.forEach((v, i) => {
		treeList.value[i].checked = v.orChecked
	})
}

// 初始化树形数据
const _initTree = (range = props.range) => {
	treeList.value = []
	_renderTreeList(range)
	nextTick(() => {
		_defaultSelect(range)
	})
}

// 监听属性变化（Vue3语法）
watch(() => props.range, (newList) => {
	_initTree(newList)
}, { deep: true })

watch(() => props.multiple, () => {
	if (props.range.length) {
		_reTreeList()
	}
})

watch(() => props.selectParent, () => {
	if (props.range.length) {
		_reTreeList()
	}
})

// 暴露方法给父组件调用（如_show/_hide/_confirm等）
defineExpose({
	_show,
	_hide,
	_confirm,
	_cancel,
	_initTree
})

// 组件挂载时初始化
_initTree()
</script>

<style lang="scss">
.tki-tree-mask {
  position: fixed;
  top: 0rpx;
  right: 0rpx;
  bottom: 0rpx;
  left: 0rpx;
  z-index: 9998;
  opacity: 0;
  transition: all 0.3s ease;
  visibility: hidden;
}
.tki-tree-mask.show {
  visibility: visible;
  opacity: 1;
}
.tki-tree-cnt {
  position: fixed;
  top: 0rpx;
  right: 0rpx;
  bottom: 0rpx;
  left: 0rpx;
  z-index: 9999;
  top: 160rpx;
  transition: all 0.3s ease;
  transform: translateY(100%);
}
.tki-tree-cnt.show {
  transform: translateY(0);
}
.tki-tree-bar {
  background-color: #fff;
  height: 72rpx;
  padding-left: 20rpx;
  padding-right: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-bottom-width: 1rpx !important;
  border-bottom-style: solid;
  border-bottom-color: #f5f5f5;
  font-size: 32rpx;
  color: #757575;
  line-height: 1;
}
.tki-tree-bar-confirm {
  color: #07bb07;
}
.tki-tree-view {
  position: absolute;
  top: 0rpx;
  right: 0rpx;
  bottom: 0rpx;
  left: 0rpx;
  top: 72rpx;
  padding-top: 20rpx;
  padding-right: 20rpx;
  padding-bottom: 20rpx;
  padding-left: 20rpx;
}
.tki-tree-view-sc {
  height: 100%;
  overflow: hidden;
}
.tki-tree-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
  color: #757575;
  line-height: 1;
  height: 0;
  opacity: 0;
  transition: 0.2s;
  position: relative;
  overflow: hidden;
}
.tki-tree-item.show {
  height: 80rpx;
  opacity: 1;
}
.tki-tree-item.showchild:before {
  transform: rotate(90deg);
}
.tki-tree-item.last:before {
  opacity: 0;

}
.tki-tree-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 8rpx;
}
.tki-tree-label {
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
  line-height: 1.2;
}
.tki-tree-check {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tki-tree-check-yes,
.tki-tree-check-no {
  width: 20px;
  height: 20px;
  border-top-left-radius: 20%;
  border-top-right-radius: 20%;
  border-bottom-right-radius: 20%;
  border-bottom-left-radius: 20%;
  border-top-width: 1rpx;
  border-left-width: 1rpx;
  border-bottom-width: 1rpx;
  border-right-width: 1rpx;
  border-style: solid;
  border-color:$u-type-primary;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.tki-tree-check-yes-b {
  width: 12px;
  height: 12px;
  border-top-left-radius: 20%;
  border-top-right-radius: 20%;
  border-bottom-right-radius: 20%;
  border-bottom-left-radius: 20%;
  background-color: $u-type-primary;
}
.tki-tree-check .radio {
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
}
.tki-tree-check .radio .tki-tree-check-yes-b {
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
}
.hover-c {
  opacity: 0.6;
}

</style>