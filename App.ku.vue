<script setup lang="ts">
import { useTheme } from 'uview-pro';
import { computed } from 'vue';

const { darkMode, themes, currentTheme } = useTheme();

const themeName = computed(() => currentTheme.value?.name);
</script>

<template>
  <u-config-provider :dark-mode="darkMode" :current-theme="themeName" :themes="themes">
    <KuRootView />
  </u-config-provider>
</template>