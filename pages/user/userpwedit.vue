<template>
	<view>
		<cu-custom bgColor="bg-gradual-pink" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">修改密码</block>
		</cu-custom>
		<form>
			<view class="cu-form-group">
				<view class="title">旧密码：</view>
				<input class="uni-input" placeholder="旧密码" :password="!showOldPassword"
					v-model="myFormData.oldpassword"></input>
				<text :class="[showOldPassword ? 'cuIcon-attention' : 'cuIcon-attentionforbid']"
					@click="changeOldPassword"></text>
			</view>
			<view class="cu-form-group">
				<view class="title">输入新密码：</view>
				<input class="uni-input" placeholder="请输入新密码" name="input" :password="!showNewPassword"
					v-model="myFormData.newpassword"></input>
				<text :class="[showNewPassword ? 'cuIcon-attention' : 'cuIcon-attentionforbid']"
					@click="changeNewPassword"></text>
			</view>
			<view class="cu-form-group">
				<view class="title">确认新密码：</view>
				<input class="uni-input" placeholder="请确认新密码" name="input" :password="!showConfirmPassword"
					v-model="myFormData.qpassword" />
				<view class="action text-lg">
					<text :class="[showConfirmPassword ? 'cuIcon-attention' : 'cuIcon-attentionforbid']"
						@click="changeConfirmPassword"></text>
				</view>
			</view>

			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue lg" @click="onSubmit">提交</button>
			</view>
		</form>
	</view>
</template>

<script>
	import md5 from 'md5'
	export default {
		data() {
			return {
				showOldPassword: false,
				showNewPassword: false,
				showConfirmPassword: false,
				myFormData: {
					oldpassword: '',
					newpassword: '',
					userId: '',
					qpassword: ''
				},
			};
		},
		onLoad() {},
		methods: {
			onSubmit() {
				let myForm = {}
				if (!this.myFormData.oldpassword || this.myFormData.oldpassword.length == 0) {
					this.$tip.alert('请输入旧密码');
					return false
				}
				if (!this.myFormData.newpassword || this.myFormData.newpassword.length == 0) {
					this.$tip.alert('请输入新密码');
					return false
				}
				if (!this.myFormData.qpassword || this.myFormData.qpassword.length == 0) {
					this.$tip.alert('请确认新密码');
					return false
				}
				if (this.myFormData.newpassword != this.myFormData.qpassword) {
					this.$tip.alert('两次新密码不一致');
					return false
				}
				myForm.userId = this.$store.getters.userid
				myForm.oldpassword = md5(this.myFormData.oldpassword)
				myForm.password = md5(this.myFormData.newpassword)
				//myForm.password = md5(this.myFormData.qpassword)

				//console.log('myform', JSON.stringify(myForm))
				this.$tip.loading();
				this.$http.put('/user/updatePwd', myForm).then(res => {
					console.log(JSON.stringify(res))
					this.$tip.loaded();
					if (res.data.code == 200) {
						if (res.data.data.message == '修改成功') {
							this.$Router.replace({name: 'people'})
						} 
						else(
						this.$tip.error(res.data.data.message)
						)
					}
				}).catch(() => {
					this.$tip.loaded();
					this.$tip.error('提交失败')
				});
			},
			changeOldPassword() {
				this.showOldPassword = !this.showOldPassword;
			},
			changeNewPassword() {
				this.showNewPassword = !this.showNewPassword;
			},
			changeConfirmPassword() {
				this.showConfirmPassword = !this.showConfirmPassword;
			}
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>