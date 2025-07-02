<script lang="ts" setup>
import { computed, onMounted, ref, toRefs, watch } from 'vue';
import { useInsureanceStore } from '@/stores/signature2';
import { formatIndex } from '@/utility/transform';

const store = useInsureanceStore();
const currentPage = computed(() => store.currentPage);
const props = defineProps(['showFakeSign']);
const scrollSheetRef = ref(null);
const itemRefs = ref<HTMLElement[]>([]);
const { showFakeSign } = toRefs(props);

function setItemRef(index: number) {
  return (el: HTMLElement | null) => {
    if (el) itemRefs.value[index] = el;
  };
}

function sidebarScrollTo(currentPage: number) {
  const container = scrollSheetRef.value?.$el;
  const targetHeight = itemRefs.value[currentPage].offsetHeight * currentPage;
  const targetTop = itemRefs.value[currentPage].offsetTop * currentPage;
  // 滾動到對應 item 元素
  if (container) {
    container.scrollTo({
      top: targetHeight - targetTop,
      behavior: 'auto'
    });
  }
}

function skipHandler({ buttonStatus }, index) {
  store.currentPage = index;

  if (buttonStatus !== 'unselected') {
    store.skipToSignPosition(index.toString(), 'button');
  } else {
    store.scrollToPage(index);
  }
}

// 或你可以寫個函數測量 scrollTop
function logScrollTop() {
  const el = scrollSheetRef.value?.$el;
  console.log('目前 scrollTop:', el.scrollTop);
}

watch(
  () => store.currentPage,
  (currentPage) => {
    sidebarScrollTo(currentPage);
  }
);
</script>

<template>
  <v-sheet
    ref="scrollSheetRef"
    height="450"
    class="bgPrimaryColor overflow-y-auto scrollbar"
    @scroll="logScrollTop"
  >
    <v-list class="bgPrimaryColor">
      <v-list-item v-for="(item, index) in store.currentDocs" :key="index" tag="div" class="px-0">
        <template v-slot>
          <div
            class="d-flex justify-center align-center cursor-pointer"
            @click="skipHandler(item, index)"
            :ref="setItemRef(index)"
          >
            <v-avatar
              size="32"
              class="pa-3"
              :class="[
                index === currentPage ? 'border-active' : 'border-inactive',
                item.buttonStatus === 'signed'
                  ? 'bg-green'
                  : item.buttonStatus === 'unsigned'
                    ? 'bg-red'
                    : 'bg-transparent'
              ]"
            >
              <v-icon
                color="white"
                size="15"
                :icon="
                  item.buttonStatus === 'signed'
                    ? 'mdi-check'
                    : item.buttonStatus === 'unsigned'
                      ? 'mdi-pencil-outline'
                      : ''
                "
              />
            </v-avatar>

            <v-list-item-subtitle
              class="pl-3 text-subtitle-1"
              :class="index === currentPage ? 'text-blue-darken-4 font-weight-bold' : 'text-grey'"
            >
              {{ formatIndex(index) }}
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
    <!-- 往上一個箭頭 -->
    <v-avatar
      color="white"
      size="54"
      class="mb-auto border-md"
      @click="store.switchSignButton({ type: 'last' })"
    >
      <v-icon icon="mdi-arrow-up"></v-icon>
    </v-avatar>

    <!-- 往下一個箭頭 -->
    <v-avatar
      color="white"
      size="54"
      class="border-md"
      @click="store.switchSignButton({ type: 'next' })"
    >
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

.scrollbar {
  /* &::-webkit-scrollbar {
    width: 6px; // Scroll bar 寬度
  }
  &::-webkit-scrollbar-track {
    background: #e0e0e0; // 滾動軌道背景
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #4a90e2; // 滑塊顏色
    border-radius: 6px;
    border: 2px solid #e0e0e0; // 內邊界讓滑塊更明顯
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #357ab7; // 滑鼠 hover 時顏色
  } */
}
</style>
