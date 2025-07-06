<script setup>
import { storeToRefs } from 'pinia';
import { useInsureanceStore } from '@/stores/signature';
import { nextTick, ref, watch } from 'vue';
const store = useInsureanceStore();
const { signatureRoleType, currentRole } = storeToRefs(store);
const navbarRef = ref(null);

const signRole = [
  '被保人姓名',
  '被保人姓名',
  '被保人姓名',
  '被保人姓名',
  '被保人姓名',
  '被保人姓名',
  '被保人姓名',
  '被保人姓名',
  '被保人姓名',
  '被保人姓名'
];

function switchRoleHandler({ type }, buttonIndex) {
  store.currentRole = { index: buttonIndex, type };
  console.log(`store.currentRole => `, store.currentRole);
  store.switchRoleToButton(buttonIndex);
  store.skipToSignPsisosition('0', 'button');
  // store.skipToSignPosition(buttonIndex[0], 'role');
}

watch(
  () => store.stage,
  () => {
    nextTick(() => {
      const el = navbarRef.value?.$el || navbarRef.value;
      if (el) {
        store.navbarHeight = el.offsetHeight;
      }
    });
  }
);

watch(
  () => store.stage,
  async () => {
    await nextTick();
  }
);
</script>
<template>
  <v-sheet
    class="py-1"
    :class="[store.stage === 'preview' ? 'd-flex' : 'd-flex']"
    style="background-color: rgba(0, 0, 0, 0.8)"
    ref="navbarRef"
  >
    <v-list
      v-for="(item, index) in signatureRoleType"
      :key="index"
      style="background-color: #00000000"
      class="px-2"
    >
      <v-list-item
        class="rounded-xl py-0"
        :class="[item.type === currentRole.type ? 'bg-blue-darken-4' : 'bg-grey-darken-1']"
        @click="switchRoleHandler(item, index)"
      >
        <v-avatar
          size="25"
          class="mr-1 border-active"
          :color="item.allSignedComplete ? 'green-darken-2' : ''"
          :class="[item.allSignedComplete ? 'border-complete' : '']"
        >
          <v-icon
            :icon="item.allSignedComplete ? 'mdi-check' : ''"
            color="grey-lighten-3"
            size="13"
          ></v-icon>
        </v-avatar>
        {{ item.name }}
      </v-list-item>
    </v-list>
  </v-sheet>
</template>

<style lang="scss" scoped>
.border-active {
  border: 2px solid #ccc;
  /* background-color: #f00; */
}

.border-complete {
  border: 2px solid #388e3c; // Vuetify 的 blue-darken-2
}

.border-clickTab {
  border: 2px solid #1d81e5;
}
</style>
