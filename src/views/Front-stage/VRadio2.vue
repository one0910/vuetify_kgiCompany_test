<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// 定義選擇的顏色
const selectedColor = ref('');
// 表單引用
const formRef = ref();

// 定義驗證規則
const colorRules = [
  // 規則 1: 限制只能選擇紅色或藍色
  (value: string) => {
    if (value !== 'red' && value !== 'blue') {
      return '請選擇紅色或藍色！';
    }
    return true;
  },
  // 規則 2: 當選擇藍色時顯示提示
  (value: string) => {
    if (value === 'blue') {
      return '你目前是藍色的訊息'; // 當選擇藍色時返回此訊息
    }
    return true;
  }
];

// 計算是否有效
const isValid = computed(() => {
  return colorRules.every((rule) => rule(selectedColor.value) === true);
});
console.log(`isValid => `, isValid);

// 自訂錯誤訊息
const errorMessage = computed(() => {
  return (
    colorRules
      .map((rule) => rule(selectedColor.value))
      .find((result) => typeof result === 'string') || ''
  );
});

// 監聽選項變化，確保即時更新
watch(selectedColor, (newValue) => {
  console.log(`selectedColor changed to: ${newValue}, errorMessage: ${errorMessage.value}`);
});

// 檢查表單
const checkForm = () => {
  const form = formRef.value;
  if (form) {
    if (!form.validate()) {
      form.reportValidity(); // 顯示內建錯誤
    } else {
      alert(`你選擇了: ${selectedColor.value}`);
    }
  }
};
</script>

<template>
  <v-container>
    <v-form ref="form">
      <v-radio-group v-model="selectedColor" :rules="colorRules" label="選擇你喜歡的顏色" inline>
        <v-radio label="紅色" value="red"></v-radio>
        <v-radio label="藍色" value="blue"></v-radio>
        <v-radio label="綠色" value="green"></v-radio>
      </v-radio-group>
      <v-btn @click="checkForm">提交</v-btn>
    </v-form>
  </v-container>
</template>

<style scoped>
.border-b {
  border-bottom: 1px solid #e0e0e0;
}

/* 強制覆蓋 v-messages 顏色 */
.v-messages__message {
  color: #2e7d32 !important; /* 綠色 */
}
</style>
