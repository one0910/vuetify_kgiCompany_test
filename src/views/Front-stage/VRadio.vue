<script setup lang="ts">
import { ref, computed } from 'vue';

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
const others = ref('');

const getGlobalIndex = (groupIndex: number, questionIndex: number) => {
  let offset = 0;
  for (let i = 0; i < groupIndex; i++) {
    offset += questionGroups[i].questions.length;
  }
  console.log(`offset => `, offset);
  console.log(`questionIndex => `, questionIndex);
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
  return [(v: string) => (v === '否' ? 'this is error' : true)];
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
</script>

<template>
  <v-container>
    <v-form>
      <v-row v-for="(group, groupIndex) in questionGroups" :key="groupIndex" class="mb-6">
        <v-col cols="12" class="font-weight-bold text-body-1 mb-2">
          {{ group.title }}
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
