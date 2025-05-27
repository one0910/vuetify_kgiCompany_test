<script setup>
import { onMounted, ref, nextTick, defineExpose } from 'vue';
import { useInsureanceStore } from '@/stores/signature';
import Loading from '@/components/Loading.vue';
const { documents } = defineProps(['documents']);

const store = useInsureanceStore();
const canvasRef = ref(null);
const isLoading = ref(false);

// 首次掛載時也更新一次畫布
async function renderAllCanvas() {
  isLoading.value = true;
  if (!canvasRef.value) return;

  canvasRef.value.innerHTML = '';
  for (let i = 0; i < documents.length; i++) {
    const canvas = await store.renderInsureanceDoc(documents[i]);
    if (canvas) {
      canvasRef.value.appendChild(canvas);
      await nextTick();

      await new Promise((resolve) => requestAnimationFrame(resolve));
      const domHeight = canvas.offsetHeight;
      documents[i].pageHeight = domHeight;
      // console.log(`📏 第 ${i + 1} 頁 DOM 高度為 ${domHeight}px`);
    }
  }
  isLoading.value = false;
}

onMounted(async () => {
  await renderAllCanvas();
});

defineExpose({
  renderAllCanvas
});
</script>

<template>
  <Loading v-show="isLoading" />

  <div
    ref="canvasRef"
    class="canvas-container border-xl"
    :class="isLoading ? 'opacity-0' : 'opacity-1'"
  ></div>
</template>

<style lang="scss" scoped>
.canvas-container :deep(canvas) {
  max-width: 100%;
  border-bottom: 5px solid rgba(0, 0, 0, 0.2);
  display: block;
  margin: auto;
}
</style>
