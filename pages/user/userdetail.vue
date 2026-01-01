<template>
	<view>
		<scroll-view scroll-y class="page">
			<cu-custom bgColor="bg-gradual-pink" :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">用户详情</block>
				<!-- <view slot="right"  @tap="rightClick">编辑</view> -->
			</cu-custom>
			<!-- list列表 -->
			<view class="cu-list menu">
				<view class="cu-item animation-slide-bottom" :style="[{animationDelay: '0.1s'}]">
					<view class="content">
						<text class="text-grey">工号：</text>
					</view>
					<view class="action">
						<text class="text-grey" >{{personalMsg.id}}</text>
					</view>

				</view>
				<view class="cu-item animation-slide-bottom" :style="[{animationDelay: '0.2s'}]">
					<view class="content">
						<text class="text-grey">姓名：</text>
					</view>
					<view class="action">
						<text class="text-grey">{{personalMsg.username}}</text>
					</view>
				</view>
				<view class="cu-item animation-slide-bottom" :style="[{animationDelay: '0.3s'}]">
					<view class="content">
						<text class="text-grey">登录名称：</text>
					</view>
					<view class="action">
						<text class="text-grey">{{personalMsg.loginName}}</text>
					</view>
				</view>
			</view>
			<view class="cu-list menu">
				<view class="cu-item animation-slide-bottom" :style="[{animationDelay: '0.4s'}]">
					<view class="content">
						<text class="text-grey">手机：</text>
					</view>
					<view class="action">
						<text class="text-grey">{{personalMsg.phone}}</text>
					</view>
				</view>
				<view class="cu-item animation-slide-bottom" :style="[{animationDelay: '0.5s'}]">
					<view class="content">
						<text class="text-grey">邮箱：</text>
					</view>
					<view class="action">
						<text class="text-grey">{{personalMsg.email}}</text>
					</view>
				</view>
			</view>



		</scroll-view>
	</view>
</template>

<script>
	import api from '@/api/api.js'
	export default {
		data() {
			return {
				personalMsg: {
					id: '',
					loginName: '',
					username: '',
					sex: 1,
					birthday: new Date(),
					orgCode: '',
					workNo: '',
					status: 1,
					phone: '',
					telephone: '',
					email: '',
					post: '',
					departIds: '',
					identity: '',
				},
				userUrl: '/user/getUserSession',
				positionUrl: '/sys/position/list',
				departUrl: '/sys/user/userDepartList'
			};
		},
		onLoad() {
			this.loadinfo()
		},
		methods: {
			getSubStringText(text, len) {
				if (!text || text.length == 0) {
					return ''
				}
				if (text.length < len) {
					return text;
				}
				return text.substr(0, len) + "..."
			},
			rightClick() {
				this.$Router.push({
					name: 'useredit',
					params: this.personalMsg
				})
				/* uni.navigateTo({
				    url: '/pages/user/useredit?item='+item
				}); */
			},
			loadinfo() {
				this.$http.get(this.userUrl, {
					params: {
						id: this.$store.getters.userid
					}
				}).then(res => {
					console.log("用户" + JSON.stringify(res))
					if (res.data.code == "200") {
						let result = res.data.data.user
						this.personalMsg.loginName = result.loginName
						this.personalMsg.username = result.username
						this.personalMsg.id = result.id
						this.personalMsg.phone = result.phonenum
						this.personalMsg.email = result.email
					}
				}).catch(e => {
					console.log("请求错误", e)
				})

				this.$http.get(this.departUrl, {
					params: {
						userId: this.$store.getters.userid
					}
				}).then(res => {
					if (res.success) {
						for (let item of res.result) {
							this.personalMsg.orgCode = item.title
							this.personalMsg.departIds = item.title
						}
					}
				}).catch(e => {
					console.log("请求错误", e)
				})

				this.$http.get(this.positionUrl).then(res => {
					if (res.success) {
						let postArr = res.result.records
						for (let item of postArr) {
							if (this.personalMsg.post == item.code) {
								this.personalMsg.post = item.name
							}
						}
					}
				}).catch(e => {
					console.log("请求错误", e)
				})
			},
		}
	}
</script>

<style>
	.page {
		height: 100Vh;
		width: 100vw;
	}

	.page.show {
		overflow: hidden;
	}

	.switch-sex::after {
		content: "\e716";
	}

	.switch-sex::before {
		content: "\e7a9";
	}

	.switch-music::after {
		content: "\e66a";
	}

	.switch-music::before {
		content: "\e6db";
	}
</style>