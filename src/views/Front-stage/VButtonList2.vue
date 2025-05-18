<script setup>
import { useInsureanceStore } from '@/stores/signature';
import SwitchSideBarForSign from '@/components/signature/SwitchSideBar-Sign.vue';
import CanvasViewer from '@/components/signature/CanvasViewer.vue';
const store = useInsureanceStore();

function detectBottom(event) {
  if (!(event.target instanceof HTMLElement)) return;
  const { scrollTop, scrollHeight, clientHeight } = event.target;
  if (scrollTop + clientHeight >= scrollHeight - 2) {
    store.buttonEnabled = true;
  }
}
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
      <v-col cols="1">
        <SwitchSideBarForSign />
      </v-col>
      <v-col cols="11">
        <v-sheet class="bgPrimaryColor position-relative">
          <v-sheet
            class="d-flex justify-center border-xl overflow-y-auto overflow-x-hidden"
            max-height="490"
            @scroll="detectBottom"
          >
            <v-sheet class="position-absolute top-0 left-0 w-100" color="transparent">
              <!-- <SignaturedNavbar /> -->
            </v-sheet>
            <!-- <div ref="canvasRef"></div> -->
            <CanvasViewer />
          </v-sheet>
        </v-sheet>

        <v-layout row wrap class="justify-center mt-5">
          <v-btn
            density="comfortable"
            color="blue-darken-4"
            size="x-large"
            class="bg-white mr-5"
            variant="text"
            width="250"
            >儲存</v-btn
          >
          <v-btn
            density="comfortable"
            color="white"
            size="x-large"
            width="250"
            class="bg-blue-darken-4"
            :disabled="!store.buttonEnabled"
            >下一步</v-btn
          >
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
