<template>
	<view>
		<u-tabbar @change="changeTab" :value="tabIndex" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true"
			activeColor="#19be6b" inactiveColor="#909399">
			<u-tabbar-item :text="item.text" :name="item.name" :badge="item.badge" :badgeStyle="item.badgeStyle" 
			:icon="item.icon" v-for="item in tabList" v-bind:key="item.name" @click="tabClick(item.pagePath)">
			</u-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script>
	export default {
		name: 'tabbar',
		props: {
			tabIndex: {
				type: Number,
				default: 5
			}
		},
		data() {
			return {
				title: '首页',
				tabList: [{
						text: '首页',
						name: 0,
						icon: 'home',
						badge: 9559,
						badgeStyle:"right:20px;",
						pagePath: "/pages/index/index"
					},
					{
						text: '报表',
						name: 4,
						icon: 'file-text',
						pagePath: "/pages/report/report"
					},
					{
						text: '我的',
						name: 5,
						icon: 'account',
						pagePath: "/pages/user/my"
					}
				]
			};
		},
		methods: {
			changeTab(e) {},
			tabClick(pagePath) {
				console.log(pagePath);
				uni.switchTab({
					url: pagePath
				});
			}
		}
	}
</script>