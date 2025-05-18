<template>
  <v-stepper v-model="step" vertical>
    <v-stepper-item :value="1">
      <template v-slot:step="{ props }">
        <v-btn
          :color="props.isActive ? 'primary' : ''"
          :class="{ 'white--text': props.isActive }"
          rounded
          x-small
        >
          {{ props.index }}
        </v-btn>
      </template>
      <div>要保人同意投保</div>
    </v-stepper-item>
    <v-stepper-item :value="2">
      <template v-slot:step="{ props }">
        <v-btn
          :color="props.isActive ? 'primary' : ''"
          :class="{ 'white--text': props.isActive }"
          rounded
          x-small
        >
          {{ props.index }}
        </v-btn>
      </template>

      <div>被保險人</div>
    </v-stepper-item>
    <v-stepper-item :value="3">
      <template v-slot:step="{ props }">
        <v-btn
          :color="props.isActive ? 'primary' : ''"
          :class="{ 'white--text': props.isActive }"
          rounded
          x-small
        >
          {{ props.index }}
        </v-btn>
      </template>
      <div>業務員一</div>
    </v-stepper-item>
    <v-stepper-item :value="4">
      <template v-slot:step="{ props }">
        <v-btn
          :color="props.isActive ? 'primary' : ''"
          :class="{ 'white--text': props.isActive }"
          rounded
          x-small
        >
          {{ props.index }}
        </v-btn>
      </template>
      <div>步驟四</div>
    </v-stepper-item>
    <v-stepper-item :value="5">
      <template v-slot:step="{ props }">
        <v-btn
          :color="props.isActive ? 'primary' : ''"
          :class="{ 'white--text': props.isActive }"
          rounded
          x-small
        >
          {{ props.index }}
        </v-btn>
      </template>
      <div>步驟五</div>
    </v-stepper-item>
  </v-stepper>
  <div class="d-flex flex-column mt-2">
    <v-btn
      v-for="n in totalSteps"
      :key="n"
      rounded
      :class="[
        'mb-2',
        'step-button',
        { 'step-button--active': step === n }
      ]"
      @click="step = n"
      x-small
    >
      {{ n < 10 ? '0' + n : n }}
    </v-btn>
    <v-btn
      icon="mdi-arrow-up"
      @click="step = Math.max(1, step - 1)"
    ></v-btn>
    <v-btn
      icon="mdi-arrow-down"
      @click="step = Math.min(5, step + 1)"
    ></v-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const step = ref(1);

const totalSteps = ref(5);
</script>

<style scoped>
.step-button {
  border: 1px solid #ccc;
  color: #333;
  min-width: 35px; /* 設定最小寬度 */
  height: 30px; /* 設定固定高度，與最小寬度相等 */
  width: 35px; /* 設定固定寬度，與高度相等，確保是圓形 */
  display: flex; /* 使用 Flexbox 使內容居中 */
  align-items: center;
  justify-content: center;
  padding: 0; /* 移除內邊距，避免影響形狀 */
}

.step-button--active {
  background-color: #1976d2; /* 選中時的背景色 */
  color: white;
  border-color: #1976d2;
}
</style>
