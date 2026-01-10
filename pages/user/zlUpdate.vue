<template>
	<view class="mask">
		<view class="content">
			<view class="updata-code">V{{updata_Info.version}}</view>
			<view class="updata-cont">
				<view class="cont">
					{{updata_Info.versionInfo}}
				</view>
			</view>
			<view class="update-btn" v-if="isUpdate == false">
				<view class="btn" @click="updata_DowUrl">立即升级</view>
				<view class="lanel">建议在WIFI环境下更新</view>
			</view>
			<view class="progress-btn" v-else>
				<view class="press">
					<u-line-progress :percentage="downloadNum" activeColor="#3C9CFF"
						:showText="false"></u-line-progress>
					<text>{{downloadNum}}%</text>
				</view>
				<view class="downSize">下载中:{{downSize}}M/{{fileSize}}M</view>
			</view>
			<view class="closeImg" @click="closeShow">
				<image src="/common/util/zlUpdate/icon/app_update_close2.png" mode="aspectFit"></image>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				updata_Info: {},
				isUpdate: false,
				downloadNum: 0, //下载进度
				downSize: 0, //已下载文件大小
				fileSize: 0, //文件大小
				dow_Url: '', //文件下载地址
				isUpdow: false, //判断是否在更新中
			}
		},
		onLoad(options) {
			this.updata_Info = JSON.parse(options.dowInfo)
			this.dow_Url = this.updata_Info.downloadUrl
		},
		methods: {
			updata_DowUrl() {
				//开始下载任务
				this.isUpdate = true
				this.isUpdow = true
				const downloadTask = uni.downloadFile({
					url: this.dow_Url,
					success: (downloadResult) => {
						if (downloadResult.statusCode == 200) {
							this.installBtn(downloadResult.tempFilePath);
							return;
						}
					}
				})
				//监听下载进度
				downloadTask.onProgressUpdate(res => {
					this.downloadNum = res.progress;
					this.downSize = (res.totalBytesWritten / Math.pow(1024.00, 2)).toFixed(2);
					this.fileSize = (res.totalBytesExpectedToWrite / Math.pow(1024.00, 2)).toFixed(2);
				});
			},
			//点击安装
			installBtn: function(path) {
				plus.runtime.install(path, {
					force: false
				}, res => {
					//更新完重启app
					plus.runtime.restart();
				}, err => {
					//重置更新的参数
					this.prpgress_num = 0
					this.downSize = 0
					this.fileSize = 0
					this.isUpdate = false
					this.isUpdow = false
					uni.showModal({
						title: '更新失败',
						content: err.message,
						showCancel: false,
						success: res => {}
					});

				});
			},
			closeShow() {
				console.log(this.isUpdow)
				if (this.isUpdow == true1111) {
					uni.showToast({
						title: '应用更新中...',
						icon: 'none',
						duration: 2000,
						position: 'bottom'
					})
					return;
				} else {
					uni.navigateBack({
						delta: 1,
						success: function() {
							const pages = getCurrentPages();
							const prevPage = pages[pages.length - 2];
							if (prevPage.route === 'pages/index/index') {
								prevPage.$vm.PageCur = 'report';
							}
						}
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: transparent;
	}

	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.6);

		.content {
			border: none;
			width: 270px;
			height: 370px;
			border-radius: 20rpx;
			background: rgba(255, 255, 255, 0);
			background-image: url('/common/util/zlUpdate/icon/dowUpBg.png');
			background-repeat: no-repeat;
			background-size: 100% 100%;
			margin-bottom: 100rpx;
			position: relative;

			.updata-code {
				color: #FFFFFF;
				position: absolute;
				top: 145rpx;
				left: 55rpx;
				font-weight: bold;
			}

			.updata-cont {
				width: 270px;
				position: absolute;
				top: 330rpx;

				.title {
					text-align: center;
					font-weight: bold;
				}

				.cont {
					padding: 30rpx;
					font-size: 30rpx;
					box-sizing: border-box;
				}
			}
		}

		.update-btn {
			color: #FFFFFF;
			text-align: center;
			height: 100rpx;
			font-size: 35rpx;
			width: 400rpx;
			position: absolute;
			bottom: 30rpx;
			left: 65rpx;

			.btn {
				height: 70rpx;
				line-height: 70rpx;
				border-radius: 35px;
				background: linear-gradient(to right, #077ff6, #47a1fa);
			}

			.lanel {
				color: #bababa;
				font-size: 22rpx;
				margin-top: 5px;
			}
		}

		.progress-btn {
			color: #bababa;
			text-align: center;
			width: 400rpx;
			height: 80rpx;
			position: absolute;
			bottom: 30rpx;
			left: 65rpx;

			.press {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 26rpx;

				text {
					margin-left: 5px;
				}
			}

			.downSize {
				font-size: 26rpx;
				margin-top: 5px;
			}
		}

		.closeImg {
			position: absolute;
			bottom: -100rpx;
			left: 120px;

			image {
				width: 50rpx;
				height: 100rpx;
			}
		}
	}
</style>