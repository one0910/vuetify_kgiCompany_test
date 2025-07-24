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
  const roleTypeList = store.signatureRoleType;
  isLoading.value = true;

  if (!canvasRef.value) return;

  canvasRef.value.innerHTML = '';
  for (let i = 0; i < documents.length; i++) {
    const canvas = await store.renderInsureanceDoc(documents[i], i);
    if (canvas) {
      canvasRef.value.appendChild(canvas);
      await nextTick();

      await new Promise((resolve) => requestAnimationFrame(resolve));
      const domHeight = canvas.offsetHeight;
      //把渲染過後的canvas高度寫入到currentDoc
      documents[i].pageHeight = domHeight;

      //把渲染過後的canvas高度寫入到signatureRoleType裡的pageData
      for (const role of roleTypeList) {
        if (role.pageData[i]) {
          role.pageData[i].pageHeight = domHeight;
        }
      }
    }
  }
  //所有的canvas渲染完畢後，整個頁面的高度才會是對的，這個時候再來執行scrollTo，才會有作用，也才能到正確的位置
  if (store.stage === 'sign1') {
    store.skipToSignPosition('0', 'button');
  }
  isLoading.value = false;
}

//寫入簽名後，更新canvas
async function updateCanvasByIndex(index) {
  const canvasContainer = canvasRef.value;
  if (!canvasContainer) return;

  const oldCanvas = canvasContainer.children[index];
  const updatedCanvas = await store.renderInsureanceDoc(documents[index]);

  if (oldCanvas && updatedCanvas) {
    canvasContainer.replaceChild(updatedCanvas, oldCanvas);
  }
}

// 批量更新某範圍的 canvas
async function updateCanvas(startIndex, endIndex) {
  if (!canvasRef.value) return;
  console.log(`startIndex => `, startIndex);
  console.log(`endIndex => `, endIndex);
  const canvasContainer = canvasRef.value;
  const roleTypeList = store.signatureRoleType;

  try {
    for (let i = startIndex; i <= endIndex; i++) {
      const oldCanvas = canvasContainer.children[i];
      const updatedCanvas = await store.renderInsureanceDoc(documents[i]);

      if (updatedCanvas && oldCanvas) {
        // 用新的 Canvas 替換舊的
        canvasContainer.replaceChild(updatedCanvas, oldCanvas);

        await nextTick();
        await new Promise((resolve) => requestAnimationFrame(resolve));

        // 更新 DOM 高度到 documents[i]
        const domHeight = updatedCanvas.offsetHeight;
        documents[i].pageHeight = domHeight;

        // 更新 signatureRoleType 裡的 pageData
        for (const role of roleTypeList) {
          if (role.pageData[i]) {
            role.pageData[i].pageHeight = domHeight;
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error updating canvases:`, error);
  }
}

// 加入新的canvas
async function addCanvas(newDocuments, priInsureanceDataLength) {
  isLoading.value = true;
  try {
    if (!canvasRef.value || !newDocuments.length) return;

    const roleTypeList = store.signatureRoleType;

    for (let i = 0; i < newDocuments.length; i++) {
      const canvas = await store.renderInsureanceDoc(newDocuments[i]);
      console.log(`canvas => `, canvas);
      if (canvas) {
        canvasRef.value.appendChild(canvas);
        await nextTick();
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const domHeight = canvas.offsetHeight;
        store.insureanceData[priInsureanceDataLength + i].pageHeight = domHeight;

        //更新signatureRoleType裡的pageData;
        for (const role of roleTypeList) {
          if (role.pageData[priInsureanceDataLength + i]) {
            role.pageData[priInsureanceDataLength + i].pageHeight = domHeight;
          }
        }
      }
    }

    // //將新文檔追加到現有documents中
    // // eslint-disable-next-line vue/no-mutating-props
    // documents.push(...newDocuments);
  } catch (error) {
    console.error('Error adding new canvases:', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await renderAllCanvas();
});

defineExpose({
  renderAllCanvas,
  updateCanvasByIndex,
  updateCanvas,
  addCanvas
});
</script>

<template>
  <Loading v-show="isLoading" :type="'showGif'" />
  <Loading v-show="store.loadDocLoading" :type="'noGift'" />

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
