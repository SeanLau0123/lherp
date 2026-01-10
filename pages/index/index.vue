<template>
	<view>
		<view>
			<u-navbar :is-back="false" title-color='#ffffff' back-icon-color='#ffffff' :background="background">
				<view class="slot-wrap">{{title}}</view>
			</u-navbar>
		</view>
		<!-- 轮播 -->
		<view class="wrap">
			<u-swiper height="500rpx" :list="swiperList" interval="5000" :title="true"></u-swiper>
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
		<view style="width: 100%;">
			<tab-bar v-model="currentTab"></tab-bar>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { reactive } from 'vue'
	import { ref, onMounted } from 'vue'
	import type { TabbarItem } from 'uview-pro/types/global'
	import { getBuyAndSaleStatistics, getPurchaseStatics } from '../../api/api';
	import * as echarts from 'echarts'
	const title = ref<string>("首页")
	const currentTab = ref<number>(0)
	//定义顶部导航背景数
	const background = reactive({
		backgroundImage: "linear-gradient(45deg, #0081ff, #1cbbb4)"
	})
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
	const option2 ={
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
	const option3 ={
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
			
			const chart1 = await chart1Ref.value.init(echarts)
			chart1.setOption(option1)
			
			
			let salePriceData = res.data.salePriceList;
			const salePriceDataX = salePriceData.map(o => o?.x || '') // 空值兜底
			const salePriceDataY = salePriceData.map(o => o?.y || 0) // 数值空值默认0
			option2.xAxis[0].data = salePriceDataX
			option2.series[0].data = salePriceDataY
			const chart2 = await chart2Ref.value.init(echarts)
			chart2.setOption(option2)
			
			let retailPriceData = res.data.retailPriceList;
			const retailPriceDataX = retailPriceData.map(o => o?.x || '') // 空值兜底
			const retailPriceDataY = retailPriceData.map(o => o?.y || 0) // 数值空值默认0
			option3.xAxis[0].data = retailPriceDataX
			option3.series[0].data = retailPriceDataY
			const chart3 = await chart3Ref.value.init(echarts)
			chart3.setOption(option3)
		}
	}
	
	
	let pageEnterTime = 0;
	const time = ref<string>("")
	onMounted(() => {
		  // 记录起始时间戳（高精度）
		   pageEnterTime = new Date().getTime();
		  console.log('[index] 页面进入起始时间戳（毫秒）：', pageEnterTime);
		  
		loadGetBuyAndSaleStatistics();
		loadGetPurchaseStatics();
		// setTimeout(async () => {
		// 	if (!chart1Ref.value) return
		// 	const chart1 = await chart1Ref.value.init(echarts)
		// 	chart1.setOption(option1)
		// }, 300)
		
		  const pageDomReadyTime = new Date().getTime();
		  const domCost = pageDomReadyTime - pageEnterTime;
		  time.value=`完成耗时：${domCost} 毫秒（${(domCost / 1000).toFixed(2)} 秒）`;
		  console.log(`[index] 页面 DOM 渲染完成耗时：${domCost} 毫秒（${(domCost / 1000).toFixed(2)} 秒）`);
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
	.wrap {
		padding: 20rpx;
		background-color: #aaffff;
	}

	.action {
		min-width: 100rpx;
		margin-right: 0;
		min-height: 100rpx;
	}
</style>