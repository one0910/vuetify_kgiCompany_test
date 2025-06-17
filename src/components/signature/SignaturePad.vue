<script lang="ts" setup>
import { VueSignaturePad, type Signature } from '@selemondev/vue3-signature-pad';
import { onBeforeUnmount, onMounted, ref, computed } from 'vue';

/*
使用範例：
<SignaturePad @confirm="(img) => (signature = img)" water-mark="同意投保">
  <button>TEST</button>

  <template #prepend>
    <h1>標題</h1>
    <p>說明</p>
  </template>
</SignaturePad>

按下確認後觸發@confirm，形參是簽名的base64
water-mark傳了才會有浮水印
在綁定v-model:show的情況下，簽完名按確認不會關閉彈窗，可從父組件管控關閉彈窗的時機
*/

interface Props {
  waterMark?: string;
}
defineProps<Props>();

interface Emits {
  (event: 'confirm', signature: string): void;
}
const emit = defineEmits<Emits>();

const isShowModel = defineModel<boolean>('show', {
  required: false,
  default: undefined
});
console.log(isShowModel.value);

const isShowDefault = ref(false);

const isShow = computed({
  get: () => (typeof isShowModel.value === 'boolean' ? isShowModel.value : isShowDefault.value),
  set: (value) => {
    if (typeof isShowModel.value === 'boolean') {
      isShowModel.value = value;
    } else {
      isShowDefault.value = value;
    }
  }
});

const signatureRef = ref<Signature>(null!);

// 清除畫布
const clear = () => {
  signatureRef.value?.clearCanvas();
};

// 確認按鈕
const confirm = () => {
  const signature = signatureRef.value?.saveSignature();
  emit('confirm', signature);
  isShowDefault.value = false;
};

// ctrl+z undo
let isControlPressed = false;
// 監聽ctrl和z有沒有被壓下
const onKeydown = (e: KeyboardEvent) => {
  if (!isShow.value) {
    return;
  }
  switch (e.key) {
    case 'Control':
      isControlPressed = true;
      break;
    // 壓著ctrl的狀態下按z上一步
    case 'z':
      if (isControlPressed) {
        signatureRef.value?.undo();
      }
  }
};
// 監聽ctrl鍵有沒有被鬆開
const onKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Control') {
    isControlPressed = false;
  }
};

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
  document.addEventListener('keyup', onKeyup);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
  document.removeEventListener('keyup', onKeyup);
});
</script>

<template>
  <div @click="isShow = true">
    <slot />

    <v-dialog v-model="isShow" :width="942" :height="680" persistent>
      <v-card class="card justify-space-between py-8 px-6">
        <v-btn
          @click="isShow = false"
          icon="mdi-close"
          variant="text"
          class="position-absolute top-0 right-0 close-btn"
        ></v-btn>

        <div>
          <slot name="prepend" />

          <div class="position-relative">
            <vue-signature-pad
              ref="signatureRef"
              width="894px"
              height="250px"
              :min-width="6"
              :max-width="10"
              :options="{
                penColor: 'black',
                backgroundColor: 'rgba(242, 246, 255, 1)'
              }"
            ></vue-signature-pad>
            <div
              v-if="waterMark"
              class="position-absolute top-0 left-0 d-flex justify-space-evenly align-center w-100 h-100 water-mark-wrapper"
            >
              <span v-for="word in waterMark" class="water-mark-text">
                {{ word }}
              </span>
            </div>
          </div>
          <div class="d-flex justify-end mt-6">
            <a @click="clear" class="highlight cursor-pointer">清除資料重新填寫</a>
          </div>
        </div>

        <div class="d-flex justify-center">
          <v-btn
            @click="confirm"
            size="large"
            color="#0044AD"
            :width="240"
            :height="48"
            :rounded="false"
            >確認</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.card {
  .highlight {
    color: #0044ad;
  }

  .close-btn {
    z-index: 1;
  }
}

.water-mark-wrapper {
  pointer-events: none;
  opacity: 0.25;

  .water-mark-text {
    line-height: 100%;
    font-size: 7.625rem;
    color: #ccd9ef;
  }
}
</style>
