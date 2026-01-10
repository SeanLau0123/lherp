<template>
	<view>
		<view>
			<u-navbar :is-back="false" title-color='#ffffff' back-icon-color='#ffffff' :background="background">
				<view class="slot-wrap">{{title}}</view>
			</u-navbar>
		</view>
		<scroll-view>
			<u-swiper height="500rpx" :list="list" interval="5000" :title="true" mode="none"></u-swiper>
			<u-grid :col="2">
				<u-grid-item>
					<view class="text-xl text-orange">{{ personalList.username ? personalList.username : '登录用户' }}
					</view>
					<view class="margin-top-sm">用户</view>
				</u-grid-item>
				<u-grid-item>
					<view class="text-xl text-green">{{ personalList.position ? personalList.position : '员工' }}</view>
					<view class="margin-top-sm">职务</view>
				</u-grid-item>
			</u-grid>

			<u-cell-group title="设置喜好">
				<u-cell-item icon="setting-fill" title="个人设置"></u-cell-item>
				<u-cell-item icon="integral-fill" title="会员等级" value="新版本"></u-cell-item>
				<u-cell-item icon="qzone" title="夕阳无限好" arrow-direction="down"></u-cell-item>
				<u-cell-item icon="setting-fill" title="只是近黄昏"></u-cell-item>
			</u-cell-group>

			<u-button class="custom-style" type="error" :ripple="true" ripple-bg-color="#909399"
				@click="open">退出系统</u-button>
			<view>
				<u-modal v-model="show" :content="content" :show-cancel-button="true" cancel-color="#606266"
					confirm-color="#2979ff" @confirm="confirm" :show-title="false"></u-modal>
			</view>
		</scroll-view>
		<tab-bar v-model="currentTab"></tab-bar>

	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, onMounted } from 'vue'
	import { getUserSession, mLogout } from '@/api/api.js'
	import { Request } from 'uview-pro'
	import store from '@/store/index.js'

	const title = ref<string>('我的')
	// 定义轮播图项接口
	interface SwiperItem {
		image : string
		title : string
	}

	// 定义轮播图数据
	const list = ref<SwiperItem[]>([])

	const onBingImage = async () => {
		const apiUrl = '/HPImageArchive.aspx?format=js&idx=0&n=1'
		const baseUrl = 'https://www.bing.com'
		const customhttp = new Request()
		customhttp.setConfig({
			baseUrl: baseUrl,
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
			},
			timeout: 10000 // 10秒超时
		})
		const res = await customhttp.get(apiUrl)
		if (res.data.images) {
			list.value = res.data.images.map(item => ({
				image: `${baseUrl}${item.url}`,
				title: `${item.title}-${item.enddate}` || '必应每日壁纸'
			}));
		}
	}

	const personalList = reactive({
		avatar: '',
		realname: '',
		username: '',
		position: ''
	});
	//获取当前用户角色，职务
	const OngetUserSession = async () => {
		const res = await getUserSession()
		if (res) {
			personalList.username = res.data.user.username;
			personalList.position = res.data.user.position;

		}
	}
	//退出系统
	const LoginOut = async () => {
		const res = await store.dispatch('userModule/mLogout')
		 uni.navigateTo({
		 	url: '/pages/index/login'
		})
	}
	const show = ref<boolean>(false)
	const content = ref<string>('确定要退出登陆吗？')
	const open = () => {
		show.value = true
	}
	// 定义确认按钮的回调函数
	const confirm = () => {
			// 如果不想关闭，而单是清除loading状态，需要通过ref手动调用方法
			// uModalRef.value?.clearLoading()
		LoginOut()
	}
	//定义顶部导航背景数
	const background = reactive({
		backgroundImage: "linear-gradient(45deg, #0081ff, #1cbbb4)"
	})
	const currentTab = ref<number>(4)

	onMounted(async () => {
		OngetUserSession();
		onBingImage();
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

	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}

	.text-xl {
		font-size: 42upx;
	}

	.text-green,
	.line-green,
	.lines-green {
		color: #39b54a;
	}

	.text-orange,
	.line-orange,
	.lines-orange {
		color: #f37b1d;
	}

	.margin-top-sm {
		margin-top: 20upx;
		font-size: 36upx;
	}

	.u-card-wrap {
		background-color: $u-bg-color;
		padding: 1px;
	}

	.u-body-item {
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 10rpx;
	}

	.u-body-item image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-left: 12rpx;
	}

	:deep(.custom-style) {
		color: #ffffff;
		width: 500rpx;
		margin-top: 20rpx;
	}
</style>