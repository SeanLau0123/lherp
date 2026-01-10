<template>
	<view>
		<view>
			<u-navbar :is-back="false" title-color='#ffffff' back-icon-color='#ffffff' :background="background">
				<view class="slot-wrap">{{title}}</view>
			</u-navbar>
		</view>

		<view style="width: 100%; height: 408px;">
			<l-echart ref="chartRef" @finished="init"></l-echart>
		</view>

		<tab-bar v-model="currentTab"></tab-bar>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted } from 'vue'
	const title = ref<string>('开单')
	//定义顶部导航背景数
	const background = reactive({
		backgroundImage: "linear-gradient(45deg, #0081ff, #1cbbb4)"
	})
	const currentTab = ref<number>(2)

	import * as echarts from 'echarts';
	const chartRef = ref(null)
	const option = {
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
			data: ['']
		}]
	}
	onMounted(() => {
		setTimeout(async () => {
			if (!chartRef.value) return
			const myChart = await chartRef.value.init(echarts)
			myChart.setOption(option)
		}, 300)
	})
</script>
<style>
.slot-wrap {
    display: flex;
    align-items: center;
     flex: 1; 
    padding: 0 30rpx;
	font-size: 42rpx;
	color: #ffffff;
  }
</style>