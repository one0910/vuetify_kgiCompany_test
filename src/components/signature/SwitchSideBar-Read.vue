<script setup>
import { computed } from 'vue';
import { useInsureanceStore } from '@/stores/signature';

const store = useInsureanceStore();

const insureanceData = computed(() => store.insureanceSaleReadDoc);
const currentPage = computed(() => store.currentPage);
</script>

<template>
  <v-sheet height="350" class="bgPrimaryColor">
    <v-list class="bgPrimaryColor">
      <v-list-item v-for="(item, index) in insureanceData" :key="index" tag="div" class="px-0">
        <template v-slot>
          <div
            class="d-flex justify-center align-center cursor-pointer"
            @click="store.switchPage({ index })"
          >
            <v-avatar
              size="30"
              class="pa-3"
              :class="[
                index === currentPage
                  ? 'border-active'
                  : item.readComplete
                    ? 'bg-green'
                    : 'border-inactive'
              ]"
            >
              <v-icon
                v-if="item.readComplete || index === currentPage"
                :icon="item.readComplete ? 'mdi-check' : ''"
                :class="['rounded-xl', 'pa-3', item.readComplete ? 'bg-green' : 'bg-transparent']"
                size="15"
              ></v-icon>
            </v-avatar>

            <v-list-item-subtitle
              class="pl-3 text-subtitle-1"
              :class="index === currentPage ? 'text-blue-darken-4 font-weight-bold' : 'text-grey'"
            >
              0{{ index + 1 }}
            </v-list-item-subtitle>
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-sheet>
</template>

<style lang="scss" scoped>
.bgPrimaryColor {
  background-color: #f2f6ff;
}

.step--completed {
  border: 2px solid rgba(var(--v-theme-primary), 1);
}

.step--editing {
  border: 2px solid rgba(var(--v-theme-secondary), 1);
}

.border-active {
  border: 3px solid #1e88e5; // Vuetify 的 blue-darken-2
}
.border-inactive {
  border: 2px solid #ccc;
  /* background-color: #f00; */
}
.border-none {
  border: none;
}

.text-grey {
  color: #aaa; // 或 Vuetify 色階 grey-darken-1
}
</style>
