<template>
	<view>
		<view>
			<tab-bar :tabIndex="5"></tab-bar>
		</view>
		<view>
			<u-navbar title="我的"></u-navbar>
		</view><u-transition :show="true" mode="slide-down" duration="300">
			<u--image :src="src" :fade="false" width="100%" height="200px"></u--image>
		</u-transition>
		<view class="padding flex text-center text-grey bg-white shadow-warp">
			<view class="flex flex-sub flex-direction solid-right animation-slide-top"
				:style="[{animationDelay: '0.4s'}]">
				<view class="text-xl text-orange">{{personalList.username?personalList.username:'登录用户'}}</view>
				<view class="margin-top-sm"><text class="cuIcon-people"></text> 用户</view>
			</view>
			<view class="flex flex-sub flex-direction animation-slide-top" :style="[{animationDelay: '0.4s'}]">
				<view class="text-xl text-green">{{personalList.position?personalList.position:'员工'}}</view>
				<view class="margin-top-sm"><text class="cuIcon-news"></text>职务</view>
			</view>
		</view>
	</view>
</template>
<script>
	import api from '@/api/api'
	import {
		getUserSession
	} from '@/api/api.js';
	export default {
		name: "people",
		props: {
			tabIndex: {
				type: Number,
				default: 5
			}
		},
		data() {
			return {
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
			this.OngetUserSession();
		},
		methods: {
			OngetUserSession() {
				getUserSession().then((res) => {
					this.personalList.username = res.data.user.username;
					this.personalList.position = res.data.user.position;
				}).catch(() => {})
			}
		}
	}
</script>

<style lang="scss">
	@import url("@/common/colorui/main.css");
	@import url(@/common/colorui/icon.css);
	@import url(@/common/colorui/animation.css);
</style>