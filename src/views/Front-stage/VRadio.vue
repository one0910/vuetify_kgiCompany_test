<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const questionGroups = [
  {
    title: '1. 多元資產配置',
    questions: [
      { text: '目前有外幣資產或投資，如外匯存款、海外基金、國外的股票……等？' },
      { text: '過去曾購買以外幣計價之保險商品或各類投資工具？' },
      { text: '未來有規劃持有外幣資產或投資？' }
    ]
  },
  {
    title: '2. 教育資金準備',
    questions: [
      { text: '未來子女要出國留學？' },
      { text: '該國家可流通貨幣與所購買之保單幣別相同？', dependsOn: false }
    ]
  },
  {
    title: '3. 購屋資金準備',
    questions: [
      { text: '未來要在國外置產？' },
      { text: '該國家可流通貨幣與所購買之保單幣別相同？', dependsOn: false }
    ]
  },
  {
    title: '4. 養老生活資金準備',
    questions: [
      { text: '退休後規劃到國外長住、養老、生活或旅遊？' },
      { text: '該國家可流通貨幣與所購買之保單幣別相同？', dependsOn: false }
    ]
  },
  {
    title: '5. 遺族生活資金準備',
    questions: [
      { text: '保險金受益人居住於海外？' },
      { text: '該國家可流通貨幣與所購買之保單幣別相同？', dependsOn: false }
    ]
  }
];

const totalQuestions = questionGroups.reduce((sum, group) => sum + group.questions.length, 0);
const answers = ref<string[]>(Array(totalQuestions).fill(''));
// const answers = ref(false);
const others = ref('');
const isConfirmed = ref(false); // 添加確認checkbox的狀態

const getGlobalIndex = (groupIndex: number, questionIndex: number) => {
  let offset = 0;
  for (let i = 0; i < groupIndex; i++) {
    offset += questionGroups[i].questions.length;
  }
  return offset + questionIndex;
};

const getVisibleQuestions = (group, groupIndex) => {
  return group.questions.filter((question, qIndex) => {
    if (question.dependsOn !== undefined) {
      const dependsIndex = getGlobalIndex(groupIndex, question.dependsOn);
      return answers.value[dependsIndex] === '是';
    }
    return true;
  });
};

const generateRule = (index: number) => {
  const rule = (value: string) => {
    console.log(`value => `, value);
    // 檢查值是否為 '否'
    if (value === '否') {
      return 'this is error';
    }
    return true; // 如果不是 '否'，返回 true 表示通過驗證
  };
  return [rule]; // 將規則放入陣列返回
};

const submit = () => {
  let index = 0;
  questionGroups.forEach((group, groupIdx) => {
    console.log(`${group.title}`);
    group.questions.forEach((q, qIdx) => {
      const ans = answers.value[index++];
      console.log(`　${qIdx + 1}. ${q.text} -> ${ans ?? '尚未作答'}`);
    });
  });
  console.log('其他說明:', others.value);
};

// 監聽isConfirmed，當打勾時自動將第一題設為"是"
watch(isConfirmed, (newValue) => {
  console.log(`newValue => `, newValue);
  if (newValue) {
    console.log(`answers.value; => `, answers.value);
    for (let i = 0; i < questionGroups[0].questions.length; i++) {
      answers.value[i] = 'yes';
    }
  } else {
  }
});
</script>

<template>
  <v-container>
    <v-form>
      <v-row v-for="(group, groupIndex) in questionGroups" :key="groupIndex" class="mb-6">
        <v-col cols="12" class="font-weight-bold text-body-1 mb-2">
          {{ group.title }}
        </v-col>
        <!-- 為第一題添加確認checkbox -->
        <v-col v-if="groupIndex === 0" cols="12" class="py-1">
          <v-checkbox
            v-model="isConfirmed"
            label="本人已確認下列告知事項"
            color="primary"
            hide-details
          ></v-checkbox>
        </v-col>
        <v-col
          v-for="(question, qIndex) in getVisibleQuestions(group, groupIndex)"
          :key="qIndex"
          cols="12"
          class="py-1 border-b align-center"
        >
          <v-row>
            <v-col cols="10" class="text-body-1"> {{ question.text }} </v-col>
            <v-col cols="2">
              <v-radio-group
                v-model="answers[getGlobalIndex(groupIndex, qIndex)]"
                row
                :rules="generateRule(getGlobalIndex(groupIndex, qIndex))"
                inline
                class="d-flex align-center"
              >
                <v-radio label="是" value="是" class="" />
                <v-radio label="否" value="否" />
              </v-radio-group>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row class="mt-5">
        <v-col cols="12">
          <v-textarea label="6. 其他 (請說明)" v-model="others" rows="3" auto-grow outlined />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="text-end">
          <v-btn color="primary" class="mt-4" @click="submit">送出</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<style scoped>
.border-b {
  border-bottom: 1px solid #e0e0e0;
}
</style>
