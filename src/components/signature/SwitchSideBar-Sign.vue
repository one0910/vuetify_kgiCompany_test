<script setup>
import { computed, onMounted, watch } from 'vue';
import { useInsureanceStore } from '@/stores/signature';

const store = useInsureanceStore();
const currentPage = computed(() => store.currentPage);
async function setSignatureButton() {
  console.log(`store.signatureButton => `, store.signatureButton);
  store.signatureButton.forEach((button) => {
    console.log(`1 => `, 1);
    console.log(`button => `, button);
    if (store.currentRole === button.type && !button.signimg) {
      button.signedStatus = 'unsigned';
    }
  });
}

onMounted(() => {
  watch(
    () => store.signatureButton,
    (val) => {
      if (val.length > 0) {
        setSignatureButton();
      }
    }
  );
});
watch(
  () => store.currentRole,
  (role) => {
    store.signatureButton.forEach((button) => {
      if (button.type === role) {
        button.signedStatus = button.signimg?.trim() ? 'signed' : 'unsigned';
      } else {
        button.signedStatus = button.signimg?.trim() ? 'signed' : 'unselected';
      }
    });
  },
  { immediate: true }
);
</script>

<template>
  <v-sheet height="350" class="bgPrimaryColor">
    <v-list class="bgPrimaryColor">
      <v-list-item v-for="(item, index) in store.signatureButton" :key="index" tag="div">
        <template v-slot>
          <div
            class="d-flex justify-center align-center cursor-pointer"
            @click="store.switchPage({ index })"
          >
            <v-avatar
              size="32"
              class="pa-3"
              :class="[
                index === currentPage ? 'border-active' : 'border-inactive',
                item.signedStatus === 'signed'
                  ? 'bg-green'
                  : item.signedStatus === 'unsigned'
                    ? 'bg-red'
                    : 'bg-transparent'
              ]"
            >
              <v-icon color="white" size="15" :icon="item.signimg ? 'mdi-check' : ''"></v-icon>
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

  <v-sheet
    class="d-flex flex-column mt-3 align-center bgPrimaryColor position-relative"
    height="120"
  >
    <div class="boxshadow"></div>
    <v-avatar
      color="white"
      size="54"
      class="mb-auto border-md"
      @click="store.switchPage({ type: 'divide' })"
    >
      <v-icon icon="mdi-arrow-up"></v-icon>
    </v-avatar>
    <v-avatar color="white" size="54" class="border-md" @click="store.switchPage({ type: 'plus' })">
      <v-icon icon="mdi-arrow-down"></v-icon>
    </v-avatar>
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

.boxshadow {
  position: absolute;
  bottom: 100%;
  /* background: #f00; */
  height: 35px;
  width: 100%;
  &::after {
    content: '';
    display: inline-block;
    color: #000;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 10%;
    z-index: 3;
    box-shadow: inset 3px 26px 25px 2px #f2f6ff;
  }
  /* display: none; */
}
</style>
