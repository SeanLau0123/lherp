<template>
	<view class="content">
		<view>
			<tab-bar :tabIndex="4"></tab-bar>
		</view>
		<view>
			<u-navbar title="报表"></u-navbar>
		</view>
		<view style="width:100%;height: 300px;">
			<l-echart ref="chart"></l-echart></view>
	</view>
</template>
<script>
	// 或者按需引入
	import * as echarts from 'echarts';
	export default {
		name: 'tabbar',
		props: {
			tabIndex: {
				type: Number,
				default: 4
			}
		},
		data() {
			return {
				option: {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						},
						confine: true
					},
					legend: {
						data: ['热度']
					},
					grid: {
						left: 10,
						right: 10,
						top:20,
						bottom: 50,
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
						},
						data: [300, 270, 340, 344, 300, 320]
					}],
					yAxis: [{
						type: 'value',
						
					}],
					series: [{
							name: '热度',
							type: 'bar',
							label: {
									show: true,
									position: 'top',
									formatter: (params) => {
										return params.value.toFixed(2);
									}
							},
							data: [500, 270, 5740, 144, 1300, 62],
						}
					]
				},
			};
		},
		mounted() {
			// 把 echarts 传入 
			this.$refs.chart.init(echarts, chart => {
				chart.setOption(this.option);
			});
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>