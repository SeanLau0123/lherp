<template>
	<view>
		<view>
			<u-navbar :placeholder="true" :title="title" bgColor="#0b3d91" leftIconColor="white"
				titleStyle="color:white;"></u-navbar>
		</view>
		<scroll-view>
			<!-- 常用服务 -->
			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text class='cuIcon-title text-blue'></text>基础资料
				</view>
			</view>
			<view>
				<u-grid :border="true" col="4">
					<u-grid-item :customStyle="{ height: 200 + 'rpx' }" v-for="(listItem, listIndex) in usList"
						:key="listIndex">
						<u-transition :show="true" mode="slide-up" :customStyle="{transitionDelay: (listIndex+1) * 50 +'ms' }">
						<u--image :showLoading="true" :src="listItem.icon" width="30px" height="30px"
							:lazy-load="true" @click="goPage(listItem.page)"></u--image>
							</u-transition>
						<u-transition :show="true" mode="slide-up" :customStyle="{transitionDelay: (listIndex+1) * 50 +'ms' }">
							<text class="grid-text">{{ listItem.title }}</text>
						</u-transition>
					</u-grid-item>
				</u-grid>
				<u-line></u-line>
			</view>			
			<view class="cu-bar bg-white solid-bottom">
				<view class="action">
					<text class='cuIcon-title text-blue'></text>系统设置
				</view>
			</view>
			<u-grid :border="true" col="4">
				<u-grid-item :customStyle="{ height: 200 + 'rpx' }" v-for="(listItem, listIndex) in systemList"
					:key="listIndex">
					<u-transition :show="true" mode="slide-up" :customStyle="{transitionDelay: (listIndex+1) * 50 +'ms' }">
					<u--image :showLoading="true" :src="listItem.icon" width="30px" height="30px"
						:lazy-load="true" @click="goPage(listItem.page)"></u--image>
						</u-transition>
					<u-transition :show="true" mode="slide-up" :customStyle="{transitionDelay: (listIndex+1) * 50 +'ms' }">
						<text class="grid-text">{{ listItem.title }}</text>
					</u-transition>
				</u-grid-item>
			</u-grid>
			<u-line></u-line>
		</scroll-view>
		<view style="width: 100%;">
			<tab-bar :tabIndex="2"></tab-bar>
		</view>
	</view>
</template>

<script>
	import {
		manager
	} from '../../common/util/work';
	export default {
		data() {
			return {
				title: '管理',
				usList: [],
				systemList: []
			};
		},
		onLoad() {
			this.initMaterialList();
		},
		methods: {
			initMaterialList() {
				let permissionList = uni.getStorageSync("permissionList");
				let data = []
				let sysdata = []
				let materialList = []
				let o1 = {}
				o1.url = "/material/material"
				o1.page = "material"
				o1.title = "商品信息"
				o1.icon = "/static/icon/goods.png"
				materialList.push(o1)
				let o2 = {}
				o2.url = "/material/material_category"
				o2.page = "categorys"
				o2.title = "商品类别"
				o2.icon = "/static/icon/categorys.png"
				materialList.push(o2)
				let o3 = {}
				o3.url = "/system/unit"
				o3.page = "unites"
				o3.title = "多单位	"
				o3.icon = "/static/icon/unites.png"
				materialList.push(o3)
				let o4 = {}
				o4.url = "/material/material_attribute"
				o4.page = "multiAttribute"
				o4.title = "多属性"
				o4.icon = "/static/icon/multiAttribute.png"
				materialList.push(o4)
				let o5 = {}
				o5.url = "/system/vendor"
				o5.page = "vendors"
				o5.title = "供应商信息"
				o5.icon = "/static/icon/vendors.png"
				materialList.push(o5)
				let o6 = {}
				o6.url = "/system/customer"
				o6.page = "customers"
				o6.title = "客户信息"
				o6.icon = "/static/icon/customers.png"
				materialList.push(o6)
				let o7 = {}
				o7.url = "/system/member"
				o7.page = "members"
				o7.title = "会员信息"
				o7.icon = "/static/icon/members.png"
				materialList.push(o7)
				let o8 = {}
				o8.url = "/system/depot"
				o8.page = "depot"
				o8.title = "仓库信息"
				o8.icon = "/static/icon/depot.png"
				materialList.push(o8)
				let o9 = {}
				o9.url = "/system/in_out_item"
				o9.page = "inOutItemList"
				o9.title = "收支项目"
				o9.icon = "/static/icon/inOutItemList.png"
				materialList.push(o9)
				let o10 = {}
				o10.url = "/system/account"
				o10.page = "accounts"
				o10.title = "账户管理"
				o10.icon = "/static/icon/accounts.png"
				materialList.push(o10)
				let o11 = {}
				o11.url = "/system/person"
				o11.page = "person"
				o11.title = "经手人管理"
				o11.icon = "/static/icon/person.png"
				materialList.push(o11)
				let o12 = {}
				o12.url = "/system/role"
				o12.page = "role"
				o12.title = "角色管理"
				o12.type = 'system'
				o12.icon = "/static/icon/role.png"
				materialList.push(o12)
				let o13 = {}
				o13.url = "/system/log"
				o13.page = "log"
				o13.title = "日志管理"
				o13.type = 'system'
				o13.icon = "/static/icon/logs.png"
				materialList.push(o13)
				let o14 = {}
				o14.url = "/system/user"
				o14.page = "user"
				o14.title = "用户管理"
				o14.type = 'system'
				o14.icon = "/static/icon/user.png"
				materialList.push(o14)
				if (permissionList && permissionList.length > 0) {
					for (var i = 0; i < permissionList.length; i++) {
						if (permissionList[i].children && permissionList[i].children.length > 0) {
							for (var k = 0; k < permissionList[i].children.length; k++) {
								for (var j = 0; j < materialList.length; j++) {
									if (permissionList[i].children[k].url == materialList[j].url) {
										let m = {}
										m.title = materialList[j].title
										if (materialList[j].icon) {
											m.icon = materialList[j].icon
										} else {
											m.icon = "/static/icon/wendang.png"
										}
										m.description = materialList[j].title
										m.useCount = 1000,
											m.page = materialList[j].page

										if (materialList[j].type == 'system') {
											sysdata.push(m);
										} else {
											data.push(m);
										}
									}
								}
							}
						}
					}
				}
				this.usList = data;
				this.systemList=sysdata;
			},
			initMenu() {
				console.log("-----------home------------")
				// this.onSocketOpen()
				// this.onSocketReceive()
				//this.loadCount(0);
			},
			goPage(page) {
				if (!page) {
					return false;
				}
				//this.dot[page] = false
				uni.$u.route('/pages/manage/material/material');
				// 带参数
				//this.$u.route({url: '/pages/report/report',type: 'switchTab'});
			},
			getTtemDotInfo(item) {
				if (item.page === 'annotationList' && this.msgCount > 0) {
					return this.msgCount
				}
				return '';
			}
		},
		mounted() {
			uni.hideTabBar();
			this.initMaterialList();
		}
	}
</script>

<style lang="scss">
	@import url("@/common/colorui/main.css");
	@import url(@/common/colorui/icon.css);
	@import url(@/common/colorui/animation.css);

	.grid-text {
		font-size: 12px;
		color: #000000;
		padding: 10rpx 0 20rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}
</style>