<script setup>
import { onMounted, ref, nextTick, defineExpose } from 'vue';
import { useInsureanceStore } from '@/stores/signature';
const { documents } = defineProps(['documents']);
console.log(`documents => `, documents);

const store = useInsureanceStore();
const canvasRef = ref(null);
const isLoading = ref(false);

// 首次掛載時也更新一次畫布
async function renderAllCanvas() {
  if (!canvasRef.value) return;

  isLoading.value = true;
  canvasRef.value.innerHTML = '';
  for (let i = 0; i < documents.length; i++) {
    const canvas = await store.renderInsureanceDoc(documents[i]);
    if (canvas) {
      canvasRef.value.appendChild(canvas);
      await nextTick();
      await new Promise((resolve) => requestAnimationFrame(resolve));
      console.log(`canvasRef.value.innerHTML => `, canvasRef.value.innerHTML);
      const domHeight = canvas.offsetHeight;
      documents[i].pageHeight = domHeight;
      console.log(`📏 第 ${i + 1} 頁 DOM 高度為 ${domHeight}px`);
    }
  }
  isLoading.value = false;
}

onMounted(async () => {
  await renderAllCanvas();
});

// watch(
//   () => store.stage,
//   async () => {
//     await nextTick(); // 確保 DOM 已更新
//     await renderAllCanvas();
//   }
// );
defineExpose({
  renderAllCanvas
});
</script>

<template>
  <v-sheet class="d-flex justify-center align-center">
    <v-progress-circular
      color="grey-darken-1"
      indeterminate
      size="40"
      v-show="isLoading"
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
