<template>
  <view class="cache-container">
    <view class="page-title">本地缓存管理</view>
    
    <!-- 操作按钮 -->
    <view class="btn-group">
      <button type="primary" @click="getAllCache">刷新缓存列表</button>
      <button type="warn" @click="clearAllCache" :loading="clearAllLoading">清空全部缓存</button>
    </view>

    <!-- 缓存列表为空提示 -->
    <view class="empty-tip" v-if="cacheList.length === 0 && !loading">
      暂无本地缓存数据
    </view>

    <!-- 加载中提示 -->
    <view class="loading-tip" v-if="loading">
      正在读取缓存...
    </view>

    <!-- 缓存列表 -->
    <scroll-view class="cache-list" scroll-y>
      <view class="cache-item" v-for="(item, index) in cacheList" :key="index">
        <!-- 缓存键名 -->
        <view class="cache-key">
          键名：{{ item.key }}
        </view>
        <!-- 缓存值（格式化展示） -->
        <view class="cache-value">
          值：<text>{{ formatCacheValue(item.value) }}</text>
        </view>
        <!-- 操作按钮 -->
        <view class="item-btn-group">
          <button size="mini" type="primary" @click="viewCacheDetail(item)">查看详情</button>
          <button size="mini" type="warn" @click="clearSingleCache(item.key)">清空</button>
        </view>
      </view>
    </scroll-view>
  </view>

  <!-- 缓存详情弹窗 -->
  <uni-popup ref="detailPopup" type="center" :mask-click="false">
    <view class="detail-popup">
      <view class="popup-title">缓存详情</view>
      <view class="detail-content">
        <text>{{ cacheDetail }}</text>
      </view>
      <button type="primary" @click="detailPopup.close()">关闭</button>
    </view>
  </uni-popup>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 响应式数据
const cacheList = ref([]) // 缓存列表：[{ key: 'xxx', value: 'xxx' }]
const loading = ref(false) // 读取缓存加载状态
const clearAllLoading = ref(false) // 清空全部缓存加载状态
const cacheDetail = ref('') // 缓存详情文本
const detailPopup = ref(null) // 详情弹窗实例

// 页面挂载时自动读取缓存
onMounted(() => {
  getAllCache()
})

/**
 * 读取所有本地缓存
 */
const getAllCache = () => {
  loading.value = true
  try {
    // uni-app 中通过 uni.getStorageInfoSync() 获取缓存信息
    const storageInfo = uni.getStorageInfoSync()
    const keys = storageInfo.keys || [] // 所有缓存键名数组
    const tempList = []

    // 遍历所有键名，读取对应的值
    keys.forEach(key => {
      const value = uni.getStorageSync(key)
      tempList.push({
        key,
        value
      })
    })

    cacheList.value = tempList
  } catch (error) {
    uni.showToast({
      title: '读取缓存失败：' + error.message,
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

/**
 * 格式化缓存值展示（避免过长/对象无法直接显示）
 * @param {any} value 缓存值
 * @returns {string} 格式化后的字符串
 */
const formatCacheValue = (value) => {
  if (value === null || value === undefined) {
    return 'null'
  }
  // 如果是对象/数组，转为JSON字符串并截取前100个字符
  if (typeof value === 'object') {
    try {
      const jsonStr = JSON.stringify(value)
      return jsonStr.length > 100 ? jsonStr.substring(0, 100) + '...' : jsonStr
    } catch (e) {
      return '无法解析的对象'
    }
  }
  // 普通字符串/数字直接返回，过长则截取
  return String(value).length > 100 ? String(value).substring(0, 100) + '...' : String(value)
}

/**
 * 查看缓存详情
 * @param {object} item 缓存项
 */
const viewCacheDetail = (item) => {
  try {
    // 完整展示缓存值（格式化JSON）
    let detail = ''
    if (typeof item.value === 'object') {
      detail = JSON.stringify(item.value, null, 2) // 格式化JSON，便于阅读
    } else {
      detail = String(item.value)
    }
    cacheDetail.value = detail
    detailPopup.value.open() // 打开弹窗
  } catch (error) {
    uni.showToast({
      title: '解析缓存失败：' + error.message,
      icon: 'none'
    })
  }
}

/**
 * 清空单条缓存
 * @param {string} key 缓存键名
 */
const clearSingleCache = (key) => {
  uni.showModal({
    title: '确认清空',
    content: `是否确定清空缓存【${key}】？`,
    success: (res) => {
      if (res.confirm) {
        try {
          uni.removeStorageSync(key)
          uni.showToast({ title: '清空成功', icon: 'success' })
          // 刷新缓存列表
          getAllCache()
        } catch (error) {
          uni.showToast({
            title: '清空失败：' + error.message,
            icon: 'none'
          })
        }
      }
    }
  })
}

/**
 * 清空全部缓存
 */
const clearAllCache = () => {
  uni.showModal({
    title: '危险操作',
    content: '是否确定清空所有本地缓存？此操作不可恢复！',
    success: (res) => {
      if (res.confirm) {
        clearAllLoading.value = true
        try {
          uni.clearStorageSync()
          uni.showToast({ title: '全部缓存已清空', icon: 'success' })
          // 刷新缓存列表
          getAllCache()
        } catch (error) {
          uni.showToast({
            title: '清空失败：' + error.message,
            icon: 'none'
          })
        } finally {
          clearAllLoading.value = false
        }
      }
    }
  })
}
</script>

<style scoped>
.cache-container {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  text-align: center;
}

.btn-group {
  display: flex;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.btn-group button {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
}

.empty-tip, .loading-tip {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.cache-list {
  height: calc(100vh - 220rpx);
}

.cache-item {
  background-color: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
}

.cache-key {
  font-size: 30rpx;
  font-weight: 500;
  margin-bottom: 10rpx;
  color: #333;
}

.cache-value {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20rpx;
  word-break: break-all;
}

.item-btn-group {
  display: flex;
  gap: 10rpx;
  justify-content: flex-end;
}

/* 弹窗样式 */
.detail-popup {
  width: 650rpx;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 10rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  text-align: center;
}

.detail-content {
  max-height: 500rpx;
  overflow-y: auto;
  font-size: 26rpx;
  color: #333;
  line-height: 1.6;
  margin-bottom: 30rpx;
  padding: 10rpx;
  background-color: #f9f9f9;
  border-radius: 5rpx;
  white-space: pre-wrap; /* 保留JSON格式化后的换行 */
}
</style>