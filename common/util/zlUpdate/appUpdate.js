//APP更新

export default function appUpdate() {
	uni.request({
			url: 'http://47.122.124.220:3000/doc/update.json', //检查更新的服务器地址
			data: {
				appid: plus.runtime.appid,
				version: plus.runtime.version
			},
			success: (res) => {
				plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
					let client_version = wgtinfo.version
					var flag_update = client_version.split(".").splice(0, 3).join(".") != res.data
						.version.split(".").splice(0, 3)
						.join(".")
					console.log("本地" + client_version + "，线上" + res.data.version)
					if (flag_update) {
						//整包更新
						uni.navigateTo({
							url: '../../common/util/zlUpdate/zlUpdate?dowInfo=' + JSON.stringify(
								res.data)
						})
					} else {
						plus.nativeUI.toast("暂无更新,当前版本:" + client_version);
					}
				});
		}
	})
}