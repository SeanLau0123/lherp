<template>
	<view style="height: 100vh;">
		<u-navbar :is-back="true" :background="background" :title="title" back-icon-color="#ffffff"
			title-color="#ffffff">
		</u-navbar>
		<view class="theme-selector-example">
			<!-- 标题 -->
			<view class="header">
				<text class="title">主题管理</text>
			</view>
			<!-- 当前主题信息展示 -->
			<view class="info-card">
				<view class="info-row">
					<text class="label">当前主题：</text>
					<text class="value">{{ currentTheme?.label || currentTheme?.name || '未初始化' }}</text>
				</view>
				<view class="info-row">
					<text class="label">暗黑模式：</text>
					<text class="value">{{ darkModeLabel }}</text>
				</view>
				<view class="info-row">
					<text class="label">实际模式：</text>
					<text class="value" :style="{ color: isDarkModeActive ? '#666' : '#333' }">
						{{ isDarkModeActive ? '暗黑模式' : '亮色模式' }}
					</text>
				</view>
				<view class="info-row">
					<text class="label">可用主题数：</text>
					<text class="value">{{ themes.length }}</text>
				</view>
			</view>

			<!-- 主题切换面板 -->
			<view class="panel">
				<view class="panel-header" @click="showThemePanel = !showThemePanel">
					<text class="panel-title">主题选择</text>
					<text class="toggle-icon">{{ showThemePanel ? '▼' : '▶' }}</text>
				</view>
				<view v-if="showThemePanel" class="panel-content">
					<view class="theme-grid">
						<view v-for="theme in themes" :key="theme.name" class="theme-item"
							:class="{ active: currentTheme?.name === theme.name }"
							@click="handleThemeChange(theme.name)">
							<view class="theme-color" :style="{
                                    backgroundColor: theme.color.primary
                                }"></view>
							<text class="theme-name">{{ theme.label || theme.name }}</text>
							<text class="theme-desc">{{ theme.description || theme.name }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 暗黑模式面板 -->
			<view class="panel">
				<view class="panel-header" @click="showDarkModePanel = !showDarkModePanel">
					<text class="panel-title">暗黑模式</text>
					<text class="toggle-icon">{{ showDarkModePanel ? '▼' : '▶' }}</text>
				</view>
				<view v-if="showDarkModePanel" class="panel-content">
					<view class="dark-mode-grid">
						<view class="mode-item" :class="{ active: darkMode === 'auto' }"
							@click="handleDarkModeChange('auto')">
							<text class="mode-icon">🔄</text>
							<text class="mode-name">自动</text>
							<text class="mode-desc">跟随系统设置</text>
						</view>
						<view class="mode-item" :class="{ active: darkMode === 'light' }"
							@click="handleDarkModeChange('light')">
							<text class="mode-icon">☀️</text>
							<text class="mode-name">亮色</text>
							<text class="mode-desc">强制亮色模式</text>
						</view>
						<view class="mode-item" :class="{ active: darkMode === 'dark' }"
							@click="handleDarkModeChange('dark')">
							<text class="mode-icon">🌙</text>
							<text class="mode-name">暗黑</text>
							<text class="mode-desc">强制暗黑模式</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import type { DarkMode } from 'uview-pro/types/global';
	import { useTheme, $u } from 'uview-pro';
	import { ref, reactive, computed, onMounted, watch } from 'vue';

	// ========== useTheme Hook 使用示例 ==========
	const {
		currentTheme, // 当前主题（响应式）
		themes, // 所有主题列表（响应式）
		darkMode, // 当前暗黑模式设置（响应式）
		setTheme, // 切换主题
		getDarkMode, // 获取暗黑模式设置
		setDarkMode, // 设置暗黑模式
		isInDarkMode, // 检查是否处于暗黑模式
		toggleDarkMode, // 切换暗黑模式
		getAvailableThemes, // 获取所有主题
		initTheme // 初始化主题系统
	} = useTheme();

	// 本地状态
	const showThemePanel = ref(false);
	const showDarkModePanel = ref(false);

	// 计算属性
	const darkModeLabel = computed(() => {
		const mode = darkMode.value;
		if (mode === 'auto') return '自动（跟随系统）';
		if (mode === 'dark') return '暗黑模式';
		return '亮色模式';
	});

	const isDarkModeActive = computed(() => isInDarkMode());
	const title = ref<string>('主题')
	//定义顶部导航背景数
	const background = reactive({
		backgroundColor: ""
	})
	const updateNavbarBackground = () => {
		background.backgroundColor = $u.color.primary;
	};
	watch(
		// 同时监听 currentTheme（主题切换）和 darkMode（暗黑模式切换）
		[() => currentTheme.value, () => darkMode.value],
		() => {
			updateNavbarBackground();
		},
		{ immediate: true } // 立即执行，确保初始化时赋值
	);


	// 初始化示例主题（如果还未初始化）
	onMounted(() => {
		if (!getAvailableThemes().length) {
			initTheme(
				[
					{
						name: 'green',
						label: '绿色',
						description: '自然绿色主题',
						color: {
							primary: '#19be6b'
						}
					},
					{
						name: 'purple',
						label: '紫色',
						description: '优雅紫色主题',
						color: {
							primary: '#9c27b0'
						}
					}
				],
				'blue'
			);
		}
		updateNavbarBackground()
	});

	// 事件处理
	const handleThemeChange = (themeName : string) => {
		setTheme(themeName);
		// showThemePanel.value = false;
	};

	const handleDarkModeChange = (mode : DarkMode) => {
		setDarkMode(mode);
		// showDarkModePanel.value = false;
	};
</script>


<style lang="scss" scoped>
	.theme-selector-example {
		padding: 10px;
		background: $u-bg-color;
		color: $u-main-color;
		height: calc(100% - 60px);
	}

	.header {
		margin-bottom: 10px;
		text-align: center;
	}

	.title {
		font-size: 28px;
		font-weight: bold;
		color: $u-type-primary;
		display: block;
		margin-bottom: 8px;
	}
	.info-card {
		background: rgba(var(--u-type-primary-rgb), 0.05);
		border: 1px solid rgba(var(--u-type-primary-rgb), 0.2);
		border-radius: 8px;
		padding: 12px;
		margin-bottom: 24px;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 12px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.label {
		font-weight: 600;
		color: $u-type-primary;
	}

	.value {
		color: $u-main-color;
		font-weight: 500;
	}

	.panel {
		background: $u-bg-color;
		border: 1px solid rgba(var(--u-border-color-rgb), 0.6);
		border-radius: 8px;
		margin-bottom: 12px;
		overflow: hidden;
	}

	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px;
		background: rgba(var(--u-border-color-rgb), 0.2);
		cursor: pointer;
		user-select: none;

		&:active {
			background: rgba(var(--u-border-color-rgb), 0.35);
		}
	}

	.panel-title {
		font-weight: 600;
		font-size: 16px;
		color: $u-type-primary;
	}

	.toggle-icon {
		color: $u-tips-color;
		font-size: 12rpx;
	}

	.panel-content {
		padding: 8rpx;
		border-top: 1px solid $u-border-color;
	}

	.theme-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12rpx;
	}

	.theme-item {
		text-align: center;
		padding: 12rpx;
		border: 2px solid rgba(var(--u-border-color-rgb), 0.8);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease;

		&:active {
			transform: scale(0.95);
		}

		&.active {
			border-color: $u-type-primary;
			background: rgba(var(--u-type-primary-rgb), 0.08);
		}
	}

	.theme-color {
		width: 20px;
		height: 20px;
		margin: 0 auto 8px;
		border-radius: 50%;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.theme-name {
		display: block;
		font-weight: 600;
		margin-bottom: 4px;
		color: $u-main-color;
	}

	.theme-desc {
		display: block;
		font-size: 12rpx;
		color: $u-tips-color;
	}

	.dark-mode-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 12px;
		margin-bottom: 12px;
	}

	.mode-item {
		text-align: center;
		padding: 16px 12px;
		border: 2px solid rgba(var(--u-border-color-rgb), 0.8);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease;

		&:active {
			transform: scale(0.95);
		}

		&.active {
			border-color: $u-type-primary;
			background: rgba(var(--u-type-primary-rgb), 0.08);
		}
	}

	.mode-icon {
		display: block;
		font-size: 32px;
		margin-bottom: 8px;
	}

	.mode-name {
		display: block;
		font-weight: 600;
		color: $u-main-color;
		margin-bottom: 4px;
	}

	.mode-desc {
		display: block;
		font-size: 12px;
		color: $u-tips-color;
	}

	.color-item {
		text-align: center;
	}
</style>