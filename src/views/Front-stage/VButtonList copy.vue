<script setup>
import { ref } from 'vue';
import tiffUrl from '/file_example_TIFF_1MB.tiff?url';

const insureanceData = ref([
  {
    insueranceId: Math.floor(Math.random() * 10000),
    title: '文件名稱',
    signature: [
      {
        sinatureId: Math.floor(Math.random() * 10000),
        signatureTitle: '要保人同意同投保',
        cordinate: { x: 100, y: 200 },
        isSinged: true
      }
    ],
    isSignaturing: true,
    allSignatureComplete: true
  },
  {
    insueranceId: Math.floor(Math.random() * 10000),
    title: '文件名稱',
    signature: [
      {
        sinatureId: Math.floor(Math.random() * 10000),
        signatureTitle: '要保人同意同投保',
        cordinate: { x: 100, y: 200 },
        isSinged: true
      }
    ],
    isSignaturing: true,
    allSignatureComplete: false
  },
  {
    insueranceId: Math.floor(Math.random() * 10000),
    title: '文件名稱',
    signature: [
      {
        sinatureId: Math.floor(Math.random() * 10000),
        signatureTitle: '要保人同意同投保',
        cordinate: { x: 100, y: 200 },
        isSinged: true
      }
    ],
    isSignaturing: true,
    allSignatureComplete: false
  },
  {
    insueranceId: Math.floor(Math.random() * 10000),
    title: '文件名稱',
    signature: [
      {
        sinatureId: Math.floor(Math.random() * 10000),
        signatureTitle: '要保人同意同投保',
        cordinate: { x: 100, y: 200 },
        isSinged: true
      }
    ],
    isSignaturing: true,
    allSignatureComplete: false
  },
  {
    insueranceId: Math.floor(Math.random() * 10000),
    title: '文件名稱',
    signature: [
      {
        sinatureId: Math.floor(Math.random() * 10000),
        signatureTitle: '要保人同意同投保',
        cordinate: { x: 100, y: 200 },
        isSinged: true
      }
    ],
    isSignaturing: true,
    allSignatureComplete: false
  }
]);
</script>

<template>
  <v-container fluid="">
    <v-row>
      <v-col cols="1">
        <v-list
          v-for="(item, index) in insureanceData"
          :key="index"
          class="bg-customBgColor"
        >
          <v-list-item-content
            class="d-flex justify-center align-center"
          >
            <v-avatar
              color="transparent"
              size="24"
              :class="{
                'step--completed': item.allSignatureComplete,
                'step--editing': !item.allSignatureComplete
              }"
            >
              <v-icon
                icon="mdi-pencil-outline"
                color="white"
                class="bg-red rounded-xl pa-2"
                :class="{ 'd-none': !item.allSignatureComplete }"
                size="12"
              ></v-icon>
            </v-avatar>
            <v-list-item-subtitle
              class="pl-3 text-subtitle-1 text-primary"
            >
              {{ index + 1 }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list>

        <v-sheet
          class="d-flex flex-column mt-3 align-center bg-customBgColor"
          height="110"
        >
          <v-avatar color="white" size="45" class="mb-auto border-md">
            <v-icon icon="mdi-arrow-up"></v-icon>
          </v-avatar>
          <v-avatar color="white" size="45" class="border-md">
            <v-icon icon="mdi-arrow-down"></v-icon>
          </v-avatar>
        </v-sheet>
      </v-col>
      <v-col cols="11">
        <img src="/file_example_TIFF_1MB.tiff?url" alt="TIFF Image" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.step--completed {
  border: 2px solid rgba(var(--v-theme-primary), 1);
}

.step--editing {
  border: 2px solid rgba(var(--v-theme-secondary), 1);
}
</style>
