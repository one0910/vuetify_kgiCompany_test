<script setup>
import { ref } from 'vue';

const snackbar = ref(true);
</script>
<template>
  <v-snackbar v-model="snackbar" timeout="-1" height="50">
    <p class="text-center">我是snackbar</p>
  </v-snackbar>
</template>
<style scoped>
.step-button {
  border: 1px solid #ccc;
  color: #333;
  min-width: 35px; /* 設定最小寬度 */
  height: 30px; /* 設定固定高度，與最小寬度相等 */
  width: 35px; /* 設定固定寬度，與高度相等，確保是圓形 */
  display: flex; /* 使用 Flexbox 使內容居中 */
  align-items: center;
  justify-content: center;
  padding: 0; /* 移除內邊距，避免影響形狀 */
}

.step-button--active {
  background-color: #1976d2; /* 選中時的背景色 */
  color: white;
  border-color: #1976d2;
}
</style>
