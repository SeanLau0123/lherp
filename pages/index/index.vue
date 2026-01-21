<template>
	<view>
		<view>
			<u-navbar :is-back="false" :background="background">
				<view class="slot-wrap">{{title}}</view>
			</u-navbar>
		</view>
		<!-- 轮播 -->
		<view>
			<u-swiper height="500rpx" :list="swiperList" interval="5000" :title="true" border-radius="0"></u-swiper>
		</view>
		<scroll-view scroll-y="true">
			<!-- 常用服务 -->
			<u-cell-group>
				<u-cell-item icon="heart-fill" title="常用服务" :arrow="false"></u-cell-item>
			</u-cell-group>
			<u-grid :border="true" col="3">
				<u-grid-item :customStyle="{ height: 160 + 'rpx' }" v-for="(listItem, listIndex) in gridList"
					:key="listIndex">
					<text class="grid-text">{{listItem.title }}</text>
					<text class="grid-text">¥{{listItem.price}}</text>
				</u-grid-item>
			</u-grid>
			<u-line></u-line>
			<!--<!-- 今日统计 -->
			<!--将三个图表合并为一个更紧凑的展示 -->
			<view style="height: 620rpx; margin: 0rpx 30rpx 0rpx 30rpx;">
				<view style="height: 200px;">
					<l-echart ref="chart1Ref"></l-echart>
				</view>
				<u-line margin="10px 0 0 0"></u-line>
				<view style="height: 200px;">
					<l-echart ref="chart2Ref"></l-echart>
				</view>
				<u-line margin="10px 0 0 0"></u-line>
				<view style="height: 200px;">
					<l-echart ref="chart3Ref"></l-echart>
				</view>
			</view>
		</scroll-view>
		<tab-bar v-model="currentTab"></tab-bar>
	</view>
</template>

<script setup lang="ts">
	import { onUnmounted, reactive } from 'vue'
	import { ref, onMounted, watch } from 'vue'
	import { Request, color, $u, useTheme } from 'uview-pro'
	import { getBuyAndSaleStatistics, getPurchaseStatics } from '../../api/api';
	import store from '../../store';
	import * as echarts from 'echarts/core'
	import { LineChart, BarChart } from 'echarts/charts';
	import { TitleComponent, TooltipComponent, GridComponent, DatasetComponent, TransformComponent, LegendComponent } from 'echarts/components';
	// 标签自动布局，全局过渡动画等特性
	import { LabelLayout, UniversalTransition } from 'echarts/features';
	// 引入 Canvas 渲染器，注意引入 CanvasRenderer 是必须的一步
	import { CanvasRenderer } from 'echarts/renderers';
	// 注册必须的组件
	echarts.use([
		LegendComponent,
		TitleComponent,
		TooltipComponent,
		GridComponent,
		DatasetComponent,
		TransformComponent,
		LineChart,
		BarChart,
		LabelLayout,
		UniversalTransition,
		CanvasRenderer
	]);
	const title = ref<string>("首页")
	const currentTab = ref<number>(0)

	const background = reactive({
		backgroundColor: ""
	})
	const {currentTheme,themes,darkMode} = useTheme();
	const updateNavbarBackground = () => {
		background.backgroundColor = $u.color.primary;
	};
	// 轮播图项接口
	interface SwiperItem {
		image : string
		title : string
	}
	// 定义轮播图数据
	const swiperList = ref<SwiperItem[]>([
		{
			image: "https://linghanshop.cn/uploads/attach/2025/12/13/7236a0c8fdafdf174edc0bebb657c115.png",
			title: "昨夜星辰昨夜风，画楼西畔桂堂东",
		},
		{
			image: "https://linghanshop.cn/uploads/attach/2025/12/20251203/1ae2ed7b992b80c2a885d77c3317dca9.png",
			title: "身无彩凤双飞翼，心有灵犀一点通",
		},
		{
			image: "https://linghanshop.cn/uploads/attach/2025/12/03/b836af46efdb76fcaf31d6d72525baf2.png",
			title: "谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳",
		},
	])
	//宫格数据
	const businessData = ref({
		todayBuy: 0,
		todaySale: 0,
		todayRetailSale: 0,
		yesterdayBuy: 0,
		yesterdaySale: 0,
		yesterdayRetailSale: 0,
		monthBuy: 0,
		monthSale: 0,
		monthRetailSale: 0,
		yearBuy: 0,
		yearSale: 0,
		yearRetailSale: 0
	})
	const titleToVariableMap = {
		'今日采购': 'todayBuy',
		'今日销售': 'todaySale',
		'今日零售': 'todayRetailSale',
		'昨日采购': 'yesterdayBuy',
		'昨日销售': 'yesterdaySale',
		'昨日零售': 'yesterdayRetailSale',
		'本月累计采购': 'monthBuy',
		'本月累计销售': 'monthSale',
		'本月累计零售': 'monthRetailSale',
		'今年累计采购': 'yearBuy',
		'今年累计销售': 'yearSale',
		'今年累计零售': 'yearRetailSale'
	}
	const gridList = ref<Array<{ title : string; price : number }>>([])
	const generateGridList = () => {
		gridList.value = Object.entries(titleToVariableMap).map(([title, key]) => ({
			title,
			price: businessData.value[key]
		}))
	}
	const loadGetBuyAndSaleStatistics = async () => {
		const res = await getBuyAndSaleStatistics()
		if (res.code === 200) {
			// 批量赋值
			Object.entries(titleToVariableMap).forEach(([_, variableName]) => {
				businessData.value[variableName] = res.data[variableName]
			})
			generateGridList()
		}
	}

	let chart1 = null;
	let chart2 = null;
	let chart3 = null;
	const chart1Ref = ref(null)
	const chart2Ref = ref(null)
	const chart3Ref = ref(null)
	const option1 = {
		title: {
			text: '采购统计'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: {
			left: 10,
			right: 10,
			top: 50,
			bottom: 10,
		},
		xAxis: [{
			type: 'category',
			axisLine: {
				lineStyle: {
					color: '#999999'
				}
			},
			axisLabel: {
				color: '#666666'
			}
		}],
		yAxis: [{
			type: 'value'
		}],
		series: [{
			name: '金额',
			type: 'bar',
			label: {
				show: true,
				position: 'top'
			},
			data: []
		}]
	}
	const option2 = {
		title: {
			text: '销售统计'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: {
			left: 10,
			right: 10,
			top: 50,
			bottom: 10,
		},
		xAxis: [{
			type: 'category',
			axisLine: {
				lineStyle: {
					color: '#999999'
				}
			},
			axisLabel: {
				color: '#666666'
			}
		}],
		yAxis: [{
			type: 'value'
		}],
		series: [{
			name: '金额',
			type: 'bar',
			label: {
				show: true,
				position: 'top'
			},
			data: []
		}]
	}
	const option3 = {
		title: {
			text: '零售统计'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		grid: {
			left: 10,
			right: 10,
			top: 50,
			bottom: 10,
		},
		xAxis: [{
			type: 'category',
			axisLine: {
				lineStyle: {
					color: '#999999'
				}
			},
			axisLabel: {
				color: '#666666'
			}
		}],
		yAxis: [{
			type: 'value'
		}],
		series: [{
			name: '金额',
			type: 'bar',
			label: {
				show: true,
				position: 'top'
			},
			data: []
		}]
	}
	const loadGetPurchaseStatics = async () => {
		const res = await getPurchaseStatics()
		if (res.code === 200) {
			let buyPriceData = res.data.buyPriceList;
			const buyPriceDataX = buyPriceData.map(o => o?.x);
			const buyPriceDataY = buyPriceData.map(o => o?.y);
			option1.xAxis[0].data = buyPriceDataX
			option1.series[0].data = buyPriceDataY
			if (!chart1) {
				chart1 = await chart1Ref.value.init(echarts)
			}
			chart1.setOption(option1, true)


			let salePriceData = res.data.salePriceList;
			const salePriceDataX = salePriceData.map(o => o?.x || '') // 空值兜底
			const salePriceDataY = salePriceData.map(o => o?.y || 0) // 数值空值默认0
			option2.xAxis[0].data = salePriceDataX
			option2.series[0].data = salePriceDataY
			if (!chart2) {
				chart2 = await chart2Ref.value.init(echarts)
			}
			chart2.setOption(option2, true)

			let retailPriceData = res.data.retailPriceList;
			const retailPriceDataX = retailPriceData.map(o => o?.x || '') // 空值兜底
			const retailPriceDataY = retailPriceData.map(o => o?.y || 0) // 数值空值默认0
			option3.xAxis[0].data = retailPriceDataX
			option3.series[0].data = retailPriceDataY
			if (!chart3) {
				chart3 = await chart3Ref.value.init(echarts)
			}
			chart3.setOption(option3, true)
		}
	}

	const refreshHomeData = () => {
		loadGetBuyAndSaleStatistics();
		loadGetPurchaseStatics();
	};

	watch(
		[
			() => currentTheme.value,
			() => darkMode.value,
			() => store.getters['userModule/userid']
		],
		([newTheme, newDarkMode, newUserId], [oldTheme, oldDarkMode, oldUserId]) => {
			// 仅当主题或暗黑模式变化时，更新导航栏背景
			if (newTheme !== oldTheme || newDarkMode !== oldDarkMode) {
				updateNavbarBackground();
			}

			// 仅当用户ID变化且有效时，刷新数据
			if (newUserId && newUserId !== oldUserId) {
				refreshHomeData();
			}
		},
		{ immediate: true, deep: false }
	);
	onMounted(() => {
		refreshHomeData();
	})
	onUnmounted(() => {
		if (chart1) {
			echarts.dispose(chart1);
			chart1 = null;
		}
		if (chart2) {
			echarts.dispose(chart2);
			chart2 = null;
		}
		if (chart3) {
			echarts.dispose(chart3);
			chart3 = null;
		}
	})
</script>

<style lang="scss" scoped>
	.slot-wrap {
		display: flex;
		align-items: center;
		flex: 1;
		padding: 0 30rpx;
		font-size: 42rpx;
		color: #ffffff;
	}

	.action {
		min-width: 100rpx;
		margin-right: 0;
		min-height: 100rpx;
	}
</style>