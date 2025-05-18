// src/composables/useMediaCheck.ts
import { ref, onMounted, onUnmounted } from 'vue';

const isTablet = ref(window.matchMedia('(max-width: 1024px)').matches); // ✅ 一開始就同步設定正確值

export function useMediaCheck() {
  const mediaQuery = window.matchMedia('(max-width: 1024px)');

  const handleMediaQueryChange = (event) => {
    isTablet.value = event.matches;
  };

  onMounted(() => {
    mediaQuery.addEventListener('change', handleMediaQueryChange);
  });

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handleMediaQueryChange);
  });

  return {
    isTablet,
  };
}
