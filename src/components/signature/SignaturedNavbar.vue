<script setup>
import { storeToRefs } from 'pinia';
import { useInsureanceStore } from '@/stores/signature';
import { computed } from 'vue';
const store = useInsureanceStore();
const { signatureRoleType, currentRole, clickTabMapToType } = storeToRefs(store);

function switchRoleHandler({ type }) {
  console.log(`type => `, type);
  store.currentRole = type;
}
</script>
<template>
  <v-sheet class="d-flex py-1" style="background-color: rgba(0, 0, 0, 0.71)">
    <v-list
      v-for="(item, index) in signatureRoleType"
      :key="index"
      style="background-color: #00000000"
      class="px-2"
    >
      <v-list-item
        class="rounded-xl py-0"
        :class="[
          item.type === currentRole ? 'bg-blue-darken-4' : 'bg-grey-darken-1',
          item.type === clickTabMapToType ? 'border-clickTab' : ''
        ]"
        @click="switchRoleHandler(item)"
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
