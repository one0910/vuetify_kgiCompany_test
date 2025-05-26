<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(true);

// const loadingGif = new URL('@/assets/images/bunny-cute.gif', import.meta.url).href;

// const hideLoading = () => {
//   loading.value = false;
// };

// 模擬網頁載入完成
// setTimeout(hideLoading, 3000); // 3秒後隱藏
</script>

<template>
  <div v-if="loading" id="loading">
    <!-- <img :src="loadingGif" alt="Loading..." /> -->
    <img src="@/assets/images/bunny-cute.gif" alt="Loading..." />
  </div>
</template>

<style>
#loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
