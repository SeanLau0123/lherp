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
			<view class="flex flex-sub flex-direction solid-right animation-slide-top" :style="[{animationDelay: '0.4s'}]">
				<view class="text-xl text-orange">{{personalList.username?personalList.post:'登录用户'}}</view>
				<view class="margin-top-sm"><text class="cuIcon-people"></text> 用户</view>
			</view>
			<view class="flex flex-sub flex-direction animation-slide-top" :style="[{animationDelay: '0.4s'}]">
				<view class="text-xl text-green">{{personalList.post?personalList.post:'员工'}}</view>
				<view class="margin-top-sm"><text class="cuIcon-news"></text>职务</view>
			</view>
		</view>
	</view>
</template>
<script>
	import api from '@/api/api'
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
					post: ''
				},
				positionUrl: '/sys/position/list',
				departUrl: '/sys/user/userDepartList',
				userUrl: '/user/getUserSession',
				postUrl: '/sys/position/queryByCode',
				userId: '',
				id: ''
			};
		},
		methods: {
			load() {
				if (!this.userId) {
					return;
				}
				this.$http.get(this.userUrl, {
					params: {
						id: this.userId
					}
				}).then(res => {
					if (res.data.code == "200") {
						let perArr = res.data.data.user
						// let avatar=(perArr.avatar && perArr.avatar.length > 0)? api.getFileAccessHttpUrl(perArr.avatar):'/static/avatar_boy.png'
						// this.personalList.avatar =avatar
						this.personalList.realname = perArr.realname
						this.personalList.username = perArr.username
						this.personalList.depart = perArr.departIds
						this.getpost(perArr.post)
					}
				}).catch(err => {
					console.log(err);
				});

			},
			getpost(code) {
				if (!code || code.length == 0) {
					this.personalList.post = '员工'
					return false;
				}
				this.$http.get(this.postUrl, {
					params: {
						code: code
					}
				}).then(res => {
					console.log("postUrl", res)
					if (res.data.success) {
						this.personalList.post = res.data.result.name
					}
				}).catch(err => {
					console.log(err);
				});
			}
		}
	}
</script>

<style lang="scss">
	@import url("@/plugin/colorui/main.css");
	@import url(@/plugin/colorui/icon.css);
	@import url(@/plugin/colorui/animation.css);
</style>