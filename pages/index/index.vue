<template>
	<view class="content">
		<view class="home">
			<u-navbar title="首页"></u-navbar>
		</view>
		<view>
			<tab-bar :tabIndex="0"></tab-bar>
		</view>
		<scroll-view style="width: 100%; height: 100%;margin-inline-start: 0,0,50px,0;">
			<!-- 轮播 -->
			<u-swiper :list="swiperList" indicator indicatorMode="line" radius=0 circular interval="5000"
				duration="500"></u-swiper>
			<!-- 常用服务 -->
			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<u--text prefixIcon="heart-fill" iconStyle="font-size: 16px" text="常用服务"></u--text>
				</view>			
				</view>
			<u-grid :border="true" col="3">
				<u-grid-item :customStyle="{height:160+'rpx'}" v-for="(listItem,listIndex) in list" :key="listIndex">
					<text class="grid-text">{{listItem.title}}</text>
					<text class="grid-text">¥{{listItem.value.toFixed(2)}}</text>
				</u-grid-item>
			</u-grid>
			<u-line></u-line>

			<!-- 今日统计 -->
			<!--将三个图表合并为一个更紧凑的展示 -->
			<view style="height: 200px;">
				<l-echart ref="chart"></l-echart>
			</view>
			<view style="height: 200px;">
				<l-echart ref="chart2"></l-echart>
			</view>
			<view style="height: 200px;">
				<l-echart ref="chart3"></l-echart>
			</view>
		</scroll-view>
		<view style="width: 100%; height: 50px;"></view>
	</view>

</template>
<script>
	import {
		Static
	} from "vue";
	import {
		getPurchaseStatics,
		getBuyAndSaleStatistics
	} from "@/api/api";
	import {
		ACCESS_TOKEN,
		USER_NAME,
		USER_INFO
	} from "@/common/util/constants";

	// 或者按需引入 
	import * as echarts from 'echarts/core';
	import {
		LineChart,
		BarChart
	} from 'echarts/charts';
	import {
		TitleComponent,
		TooltipComponent,
		GridComponent,
		DatasetComponent,
		TransformComponent,
		LegendComponent
	} from 'echarts/components';
	// 标签自动布局，全局过渡动画等特性
	import {
		LabelLayout,
		UniversalTransition
	} from 'echarts/features';
	// 引入 Canvas 渲染器，注意引入 CanvasRenderer 是必须的一步
	import {
		CanvasRenderer
	} from 'echarts/renderers';

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
	export default {
		name: 'tabbar',
		props: {
			tabIndex: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				list: [],
				buyPriceDataX: [],
				buyPriceDataY: [],
				salePriceDataX: [],
				salePriceDataY: [],
				retailPriceDataX: [],
				retailPriceDataY: [],
				swiperList: [{
						type: 'image',
						url: '/static/banner/banner1.png'
					},
					{
						type: 'image',
						url: '/static/banner/banner2.jpg'
					},
					{
						type: 'image',
						url: '/static/banner/banner3.jpg'
					},
				],
				option1: {
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
				},
				option2: {
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
				},
				option3: {
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
			}
		},
		methods: {
			loadGetPurchaseStatics() {
				const that = this;
				getPurchaseStatics().then((res) => {
					if (res.code === 200) {
						let buyPriceData = res.data.buyPriceList;
						that.buyPriceDataX = buyPriceData.map(o => o?.x || '') // 空值兜底
						that.buyPriceDataY = buyPriceData.map(o => o?.y || 0) // 数值空值默认0

						that.option1.xAxis[0].data = that.buyPriceDataX
						that.option1.series[0].data = that.buyPriceDataY
						that.$refs.chart.init(echarts, chart => {
							chart.resize();
							chart.setOption(that.option1);
						});

						let salePriceData = res.data.salePriceList;
						that.salePriceDataX = salePriceData.map(o => o?.x || '') // 空值兜底
						that.salePriceDataY = salePriceData.map(o => o?.y || 0) // 数值空值默认0
						that.option2.xAxis[0].data = that.salePriceDataX
						that.option2.series[0].data = that.salePriceDataY
						that.$refs.chart2.init(echarts, chart => {
							chart.resize();
							chart.setOption(that.option2);
						});

						let retailPriceData = res.data.retailPriceList;
						that.retailPriceDataX = retailPriceData.map(o => o?.x || '') // 空值兜底
						that.retailPriceDataY = retailPriceData.map(o => o?.y || 0) // 数值空值默认0
						that.option3.xAxis[0].data = that.retailPriceDataX
						that.option3.series[0].data = that.retailPriceDataY
						that.$refs.chart3.init(echarts, chart => {
							chart.resize();
							chart.setOption(that.option3);
						});
					}
				})
			},
			loadGetBuyAndSaleStatistics() {
				getBuyAndSaleStatistics().then((res) => {
					if (res.code === 200) {
						this.todayBuy = res.data.todayBuy
						this.todaySale = res.data.todaySale
						this.todayRetailSale = res.data.todayRetailSale

						this.yesterdayBuy = res.data.yesterdayBuy
						this.yesterdaySale = res.data.yesterdaySale
						this.yesterdayRetailSale = res.data.yesterdayRetailSale

						this.monthBuy = res.data.monthBuy
						this.monthSale = res.data.monthSale
						this.monthRetailSale = res.data.monthRetailSale

						this.yearBuy = res.data.yearBuy
						this.yearSale = res.data.yearSale
						this.yearRetailSale = res.data.yearRetailSale

						// 定义数据配置（便于后续维护） 
						const dataConfig = [{
								title: '今日采购',
								value: this.todayBuy
							},
							{
								title: '今日销售',
								value: this.todaySale
							},
							{
								title: '今日零售',
								value: this.todayRetailSale
							},
							{
								title: '昨日采购',
								value: this.yesterdayBuy
							},
							{
								title: '昨日销售',
								value: this.yesterdaySale
							},
							{
								title: '昨日零售',
								value: this.yesterdayRetailSale
							},
							{
								title: '本月累计采购',
								value: this.monthBuy
							},
							{
								title: '本月累计销售',
								value: this.monthSale
							},
							{
								title: '本月累计零售',
								value: this.monthRetailSale
							},
							{
								title: '今年累计采购',
								value: this.yearBuy
							},
							{
								title: '今年累计销售',
								value: this.yearSale
							},
							{
								title: '今年累计零售',
								value: this.yearRetailSale
							}
						]
						this.list = dataConfig
					}
				})
			}
		},
		mounted() {
			this.loadGetBuyAndSaleStatistics()
			this.loadGetPurchaseStatics()

		}
	}
</script>

<style>
	@import url("../../common/colorui/main.css");

	.home {
		margin-top: -7px;
	}

	.grid-text {
		font-size: 24upx;
		padding: 10rpx 0 10rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}
</style>