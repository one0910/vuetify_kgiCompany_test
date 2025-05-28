<script setup>
import { onMounted, ref, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useInsureanceStore } from '@/stores/signature';
import SwitchSideBarRead from '@/components/signature/SwitchSideBar-Read.vue';
import SwitchSideBarSign from '@/components/signature/SwitchSideBar-Sign.vue';
import SignaturedNavbar from '@/components/signature/SignaturedNavbar.vue';
import CanvasViewer from '@/components/signature/CanvasViewer.vue';

const store = useInsureanceStore();
const router = useRouter();
const scrollContainerRef = ref(null);
const canvasViewerRef = ref();
const maxHeight = ref(450);
const tipBar = ref(true);
const showFakeSign = ref(false);

function detectBottom(event) {
  if (!(event.target instanceof HTMLElement)) return;
  if (store.stage !== 'preview') return;
  const { scrollTop, scrollHeight, clientHeight } = event.target;
  const scrollPosition = scrollTop + clientHeight;

  let cumulativeHeight = 0;

  if (scrollHeight <= clientHeight + 1) return;

  store.currentDocs.forEach((doc, index) => {
    const pageHeight = doc.pageHeight || 0;
    const pageTop = cumulativeHeight;
    let pageBottom = cumulativeHeight + pageHeight;

    // ✅ 判斷目前是否在這一頁的可視範圍內
    const isInView = scrollTop >= pageTop && scrollTop < pageBottom;

    // ✅ 判斷是否算「已看完」
    const isRead = scrollPosition >= pageBottom && !doc.readComplete;
    //目前滾輪在該頁, 且滑到該頁頁底才算巴已閱讀

    if (isRead && store.currentPage === index) {
      doc.readComplete = true;
      console.log(`✅ 第 ${index + 1} 頁已閱讀完畢`);
    }

    if (isInView) {
      if (store.currentPage !== index) {
        store.currentPage = index;
        console.log(`👉 現在位於第 ${index + 1} 頁`);
      }
    }

    cumulativeHeight += pageHeight;
  });
}

function nextStep() {
  goToNextStage();
  tipBar.value = true;
  nextTick(() => {
    canvasViewerRef.value?.renderAllCanvas();
  });
}

function goToNextStage() {
  switch (store.stage) {
    case 'preview':
      store.stage = 'sign1';
      break;
    case 'sign1':
      store.currentPage = 0;
      router.push('/vlist');
      break;
    default:
      console.log('❗ 未知的階段:', store.stage);
  }
}

onMounted(async () => {
  await store.fetchInsureanceDocs();
  const el = scrollContainerRef.value?.$el;
  if (el instanceof HTMLElement) {
    el.addEventListener('scroll', detectBottom);
    maxHeight.value = screen.availHeight * 0.62;
    store.setScrollContainer(el);
  } else return;
});

watch(
  () => store.currentPage,
  () => {
    const el = scrollContainerRef.value?.$el;
    if (el instanceof HTMLElement) {
      el.removeEventListener('scroll', detectBottom);
    }
    requestAnimationFrame(() => {
      el.addEventListener('scroll', detectBottom);
    });
  }
);

watch(
  () => store.insureanceData.length,
  (length) => {
    if (length > 0) {
      nextTick(() => {
        canvasViewerRef.value?.renderAllCanvas();
      });
    }
  }
);
</script>

<template>
  <v-container fluid="">
    <!-- 名稱列 & 頁數 -->
    <v-row>
      <v-col cols="1" class="pa-0 text-center align-self-center">
        <v-icon icon="mdi-chevron-left" color="grey-darken-1" size="30"></v-icon>
      </v-col>
      <v-col cols="11">
        <div class="d-flex bgPrimaryColor justify-space-between align-center">
          <p class="text-grey-darken-3">要保人同意書</p>
          <div class="d-flex">
            <p class="text-grey-darken-3 pr-2">總頁數10頁</p>
            <button @click="showFakeSign = !showFakeSign">顯示簽名</button>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <!-- 切換頁籤按鈕 -->
      <v-col cols="1" class="pa-0">
        <SwitchSideBarRead v-if="store.stage === 'preview'" />
        <SwitchSideBarSign :showFakeSign="showFakeSign" v-else />
        <!-- <SwitchSideBarSign :showFakeSign="showFakeSign" /> -->
      </v-col>

      <!-- 保書、合約書內容 -->
      <v-col cols="11">
        <v-sheet class="bgPrimaryColor position-relative">
          <v-sheet
            ref="scrollContainerRef"
            class="d-flex justify-center bg-transparent overflow-auto"
            :max-height="maxHeight"
          >
            <v-sheet class="position-absolute top-0 left-0 w-100" color="transparent">
              <SignaturedNavbar v-if="store.stage !== 'preview'" />
              <!-- <SignaturedNavbar /> -->
            </v-sheet>
            <div>
              <CanvasViewer ref="canvasViewerRef" :documents="store.currentDocs" />
            </div>
          </v-sheet>
        </v-sheet>

        <!-- 下一步按鈕 -->
        <v-layout row wrap class="justify-center mt-5">
          <v-btn
            density="comfortable"
            color="blue-darken-4"
            size="x-large"
            class="bg-white mr-5"
            variant="text"
            width="250"
            >儲存
          </v-btn>
          <v-btn
            density="comfortable"
            color="white"
            size="x-large"
            width="250"
            class="bg-blue-darken-4"
            :disabled="!store.enableNextButton"
            @click="nextStep"
            >下一步
          </v-btn>
        </v-layout>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar v-model="tipBar" timeout="2000" height="50">
    <p class="tipBarStyle" v-if="store.stage === 'preview'">文件閱讀</p>
    <p class="tipBarStyle" v-else-if="store.stage === 'sign1'">文件簽名</p>
  </v-snackbar>
</template>

<style lang="scss" scoped>
.bgPrimaryColor {
  background-color: #f2f6ff;
}

.step--completed {
  border: 2px solid rgba(var(--v-theme-primary), 1);
}

.step--editing {
  border: 2px solid rgba(var(--v-theme-secondary), 1);
}

.tipBarStyle {
  text-align: center;
  font-size: 1rem;
  letter-spacing: 1px;
}
</style>
