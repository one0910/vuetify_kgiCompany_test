<script setup>
import { useInsureanceStore } from '@/stores/signature';
const store = useInsureanceStore();
function switchRoleHandler({ type }) {
  store.currentRole = type;
}
</script>
<template>
  <v-sheet class="d-flex py-1" style="background-color: rgba(0, 0, 0, 0.71)">
    <v-list
      v-for="(item, index) in store.signatureRoleType"
      :key="index"
      style="background-color: #00000000"
      class="px-2"
    >
      <v-list-item class="bg-grey-darken-1 rounded-xl py-0" @click="switchRoleHandler(item)">
        <v-avatar size="25" class="mr-1" style="border: 2px solid #ccc">
          <v-icon icon="mdi-check" color="grey-lighten-3" size="13"></v-icon>
        </v-avatar>
        {{ item.name }}
      </v-list-item>
    </v-list>
  </v-sheet>
</template>

<style lang="scss" scoped></style>
