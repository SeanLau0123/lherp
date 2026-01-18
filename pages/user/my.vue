<template>
	<view style="height: 100vh;">
		<view>
			<u-navbar :is-back="false" :background="background">
				<view class="slot-wrap">{{title}}</view>
			</u-navbar>
		</view>
		<scroll-view>
			<u-swiper height="500rpx" :list="list" :title="true" mode="none" border-radius="0" </u-swiper>
				<u-grid :col="2">
					<u-grid-item>
						<view class="text-xl text-orange">{{ personalList.username ? personalList.username : '-' }}
						</view>
						<view class="margin-top-sm">用户</view>
					</u-grid-item>
					<u-grid-item>
						<view class="text-xl text-green">{{ personalList.position ? personalList.position : '-' }}
						</view>
						<view class="margin-top-sm">职务</view>
					</u-grid-item>
				</u-grid>

				<u-cell-group title="基础">
					<u-cell-item :title-style="cellTitleStyle" title="个人详情" @click="ToUserDetail()"></u-cell-item>
					<u-cell-item :title-style="cellTitleStyle" title="切换主题" @click="ToChangeTheme()"></u-cell-item>
					<u-cell-item :title-style="cellTitleStyle" title="修改密码" @click="ToChangePwd()"></u-cell-item>
					<u-cell-item :title-style="cellTitleStyle" title="关于我们" @click="ToAbout()"></u-cell-item>
				</u-cell-group>

				<u-button class="custom-style" type="error" :ripple="true"	@click="open">退出系统</u-button>
				<view>
					<u-modal v-model="show" :content="content" :show-cancel-button="true" cancel-color="#606266"
						confirm-color="#2979ff" @confirm="confirm" :show-title="false"></u-modal>
				</view>
		</scroll-view>
		<tab-bar v-model="currentTab"></tab-bar>
	</view>
</template>

<script setup lang="ts">
	import type { DarkMode } from 'uview-pro/types/global';
	import { ref, reactive, onMounted, watch } from 'vue'
	import { getUserSession, mLogout } from '@/api/api.js'
	import { Request, color, $u, useTheme } from 'uview-pro'
	import store, { userStore } from '@/store/index.js'
	const title = ref<string>('我的')
	const {currentTheme,themes,darkMode} = useTheme();
	
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
		id: '',
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
	const ToUserDetail = () => {
		uni.$u.route('/pages/user/userdetail');
	}
	const ToChangePwd = () => {
		uni.$u.route('/pages/user/changePwd');
	}
	const ToChangeTheme = () => {
		uni.$u.route('/pages/user/changeTheme');
	}
	const ToAbout = () => {
		uni.$u.route('/pages/user/about');
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
		LoginOut()
	}
	const cellTitleStyle = {
		color: $u.color.primary,
		fontWeight: 500,
		fontSize: '32rpx'
	};
	//定义顶部导航背景数
	const background = reactive({
		backgroundColor: ""
	})
	const updateNavbarBackground = () => {
		background.backgroundColor = $u.color.primary;
	};
	
	const currentTab = ref<number>(4)
	
	const refreshData = () => {
		onBingImage();
		OngetUserSession();
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
				refreshData();
			}
		},
		{
			immediate: true,
			deep: false
		}
	);
	onMounted(async () => {
		refreshData();
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
	
	.label {
		color: $u-type-primary;
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