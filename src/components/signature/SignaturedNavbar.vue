<script setup>
import { useInsureanceStore } from '@/stores/signature';
const store = useInsureanceStore();
</script>
<template>
  <v-sheet class="d-flex py-1" style="background-color: rgba(0, 0, 0, 0.61)">
    <v-list
      v-for="(item, index) in store.policyholderSignature"
      :key="index"
      style="background-color: #00000000"
      class="px-2"
    >
      <v-list-item class="bg-blue-darken-4 rounded-xl py-0">
        <v-avatar size="25" class="mr-1" style="border: 2px solid #ccc">
          <v-icon icon="mdi-check" color="grey-lighten-3" size="13"></v-icon>
        </v-avatar>
        {{ item.title }}
      </v-list-item>
    </v-list>
  </v-sheet>
</template>

<style lang="scss" scoped></style>
