<script setup>
import { onMounted, ref, watch, nextTick } from 'vue';
import { useInsureanceStore } from '@/stores/signature';

const store = useInsureanceStore();
const canvasRef = ref(null);

// 首次掛載時也更新一次畫布
onMounted(async () => {
  canvasRef.value.innerHTML = '';
  for (let i = 0; i < store.insureanceSaleReadDoc.length; i++) {
    const canvas = await store.renderInsureanceDoc(i);
    if (canvas) {
      canvasRef.value.appendChild(canvas);
      const domHeight = canvas.offsetHeight;
      store.insureanceSaleReadDoc[i].pageHeight = domHeight;
      console.log(`📏 第 ${i + 1} 頁 DOM 高度為 ${domHeight}px`);
    }
  }
});
</script>

<template>
  <v-sheet class="d-flex justify-center align-center">
    <v-progress-circular
      color="grey-darken-1"
      indeterminate
      size="40"
      v-show="store.isLoading"
    ></v-progress-circular>
  </v-sheet>

  <div ref="canvasRef" v-show="!store.isLoading" class="canvas-container border-xl"></div>
</template>

<style lang="scss" scoped>
.canvas-container :deep(canvas) {
  max-width: 100%;
  border-bottom: 5px solid rgba(0, 0, 0, 0.2);
  display: block;
  margin: auto;
}
</style>
