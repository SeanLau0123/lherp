<template>
	<view>
		<view style="width: 100%;">
			<u-navbar :placeholder="true" :title="title" bgColor="#0b3d91" leftIconColor="white" titleStyle ="color:white;"></u-navbar>
		</view>
		<scroll-view scroll-y="true" style="width: 100%;">
		<u-transition :show="true" mode="slide-down" duration="300">
			<u--image :src="src" :fade="false" width="100%" height="200px"></u--image>
		</u-transition>
		<view class="padding flex text-center text-grey bg-white shadow-warp">
			<view class="flex flex-sub flex-direction solid-right animation-slide-top"
				:style="[{ animationDelay: '0.4s' }]">
				<view class="text-xl text-orange">{{ personalList.username ? personalList.username : '登录用户' }}
				</view>
				<view class="margin-top-sm"><text class="cuIcon-people"></text> 用户</view>
			</view>
			<view class="flex flex-sub flex-direction animation-slide-top" :style="[{ animationDelay: '0.4s' }]">
				<view class="text-xl text-green">{{ personalList.position ? personalList.position : '员工' }}</view>
				<view class="margin-top-sm"><text class="cuIcon-news"></text>职务</view>
			</view>
		</view>
		<u-transition :show="true" mode="slide-down" duration="500">
			<u-cell-group :border="false" title="基本资料" customStyle="font-size':'12px'">
				<u-cell :border="false" isLink size="large" icon="list-dot" title="用户详情"></u-cell>
				<u-cell :border="false" isLink size="large" icon="lock-opened-fill" title="修改密码"></u-cell>
				<u-cell :border="false" :isLink="true" size="large" icon="info-circle-fill" title="关于我们"
					url="/pages/user/about" value="新版本">
				</u-cell>
			</u-cell-group>
			<u-button text="退出登录" type="error" @click="LoginOut"	style="width:500rpx; margin-top:20rpx;"></u-button>
			</u-transition>
	</scroll-view>
	<view style="width: 100%;">
		<tab-bar :tabIndex="5" activeColor="#1989fa" inactiveColor="#7d7e80	"></tab-bar>
	</view>	
	</view>
</template>
<script>
import api from '@/api/api'
import {getUserSession} from '@/api/api.js';
export default {
	data() {
		return {
			title: '我的',
			src: "https://static.jeecg.com/upload/test/blue_1595818030310.png",
			personalList: {
				avatar: '',
				realname: '',
				username: '',
				position: ''
			},
			positionUrl: '/sys/position/list',
			departUrl: '/sys/user/userDepartList',
			userUrl: '/user/getUserSession',
			postUrl: '/sys/position/queryByCode',
			userId: '',
			id: ''
		};
	},
	onLoad() {
		uni.hideTabBar();
		this.OngetUserSession();
	},
	methods: {
		OngetUserSession() {
			getUserSession().then((res) => {
				this.personalList.username = res.data.user.username;
				this.personalList.position = res.data.user.position;
			}).catch(() => { })
		},
		LoginOut() {
			console.log('退出系统:')
		}
	}
}
</script>

<style lang="scss">
@import url("@/common/colorui/main.css");
@import url(@/common/colorui/icon.css);
@import url(@/common/colorui/animation.css);
</style>