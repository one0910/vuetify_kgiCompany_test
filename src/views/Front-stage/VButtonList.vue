<script setup>
import { onMounted, ref, watch } from 'vue';
import { useInsureanceStore } from '@/stores/signature';
import SwitchSideBarRead from '@/components/signature/SwitchSideBar-Read.vue';
import CanvasViewer from '@/components/signature/CanvasViewer.vue';
import { useMediaCheck } from '@/composable/useMediaCheck';

const store = useInsureanceStore();
const scrollContainerRef = ref(null);
const maxHeight = ref(450);
const { isTablet } = useMediaCheck();
const DataLenght = store.salesDocPreview.length;

console.log(`isTablet => `, isTablet.value);

function detectBottom(event) {
  if (!(event.target instanceof HTMLElement)) return;
  const { scrollTop, scrollHeight, clientHeight } = event.target;
  const scrollPosition = scrollTop + clientHeight;

  let cumulativeHeight = 0;

  if (scrollHeight <= clientHeight + 1) return;

  store.salesDocPreview.forEach((doc, index) => {
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
  const el = scrollContainerRef.value?.$el;
  el.removeEventListener('scroll', detectBottom);
  alert('下一步');
}

onMounted(() => {
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
          <p class="text-grey-darken-3 pr-2">總頁數10頁</p>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <!-- 切換頁籤按鈕 -->
      <v-col cols="1" class="pa-0">
        <SwitchSideBarRead />
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
              <!-- <SignaturedNavbar /> -->
            </v-sheet>
            <div>
              <CanvasViewer />
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
            :disabled="!store.nextButton"
            @click="nextStep"
            >下一步
          </v-btn>
        </v-layout>
      </v-col>
    </v-row>
  </v-container>
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
</style>
