import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { fromArrayBuffer } from 'geotiff'

export const useInsureanceStore = defineStore('insureance', () => {
  const insureanceData = ref([
    {
      type: 'sign',
      insueranceId: Math.floor(Math.random() * 10000),
      title: '要保書1',
      signature: [
        {
          sinatureId: Math.floor(Math.random() * 10000),
          signatureTitle: '要保人簽名',
          cordinate: { x: 522, y: 266 },
          isSinged: false
        },
        {
          sinatureId: Math.floor(Math.random() * 10000),
          signatureTitle: '被保險人簽名',
          cordinate: { x: 522, y: 346 },
          isSinged: true
        },
        {
          sinatureId: Math.floor(Math.random() * 10000),
          signatureTitle: '法定代理人簽名',
          cordinate: { x: 655, y: 443 },
          isSinged: false
        },
        {
          sinatureId: Math.floor(Math.random() * 10000),
          signatureTitle: '關係',
          cordinate: { x: 1064, y: 449 },
          isSinged: false
        },
        {
          sinatureId: Math.floor(Math.random() * 10000),
          signatureTitle: '被保險人配偶簽名',
          cordinate: { x: 522, y: 224 },
          isSinged: false
        },
        {
          sinatureId: Math.floor(Math.random() * 10000),
          signatureTitle: '被保險人子女簽名',
          cordinate: { x: 522, y: 274 },
          isSinged: false
        }
      ],
      tiffUrl: '/ag_ieasy_confirm7.tiff?url',
      isSignaturing: true,
      readComplete: false,
      pageHeight: 0,
      allSignatureComplete: true
    },
    {
      type: 'sign',
      insueranceId: Math.floor(Math.random() * 10000),
      title: '要保書2',
      signature: [
        {
          sinatureId: Math.floor(Math.random() * 10000),
          signatureTitle: '要保人同意同投保',
          cordinate: { x: 100, y: 200 },
          isSinged: true
        }
      ],
      tiffUrl: '/ag_ieasy_confirm6.tiff?url',
      isSignaturing: true,
      readComplete: false,
      pageHeight: 0,
      allSignatureComplete: true
    },
    {
      type: 'sign',
      insueranceId: Math.floor(Math.random() * 10000),
      title: '要保書3',
      signature: [
        {
          sinatureId: Math.floor(Math.random() * 10000),
          signatureTitle: '要保人同意同投保',
          cordinate: { x: 100, y: 200 },
          isSinged: true
        }
      ],
      tiffUrl: '/ag_ieasy_confirm5.tiff?url',
      isSignaturing: true,
      readComplete: false,
      pageHeight: 0,
      allSignatureComplete: true
    },
    {
      type: 'sign',
      insueranceId: Math.floor(Math.random() * 10000),
      title: '要保書4',
      signature: [
        {
          sinatureId: Math.floor(Math.random() * 10000),
          signatureTitle: '要保人同意同投保',
          cordinate: { x: 100, y: 200 },
          isSinged: true
        }
      ],
      tiffUrl: '/ag_ieasy_confirm4.tiff?url',
      isSignaturing: true,
      readComplete: false,
      pageHeight: 0,
      allSignatureComplete: true
    },

  ]);

  type Stage = 'preview' | 'sign1' | 'sign2';
  const stage = ref<Stage>('preview');

  const currentDocs = computed(() => insureanceData.value);

  const eableNextButton = computed(() => {
    if (stage.value === 'preview') {
      return insureanceData.value.every(doc => doc.readComplete);
    }
    if (stage.value === 'sign1' || stage.value === 'sign2') {
      return insureanceData.value.every(doc => doc.allSignatureComplete);
    }
    return false;
  });

  const currentPage = ref(0);
  const renderedCanvas = ref(null);
  const isLoading = ref(true)
  const scrollContainerRef = ref(null);


  function setScrollContainer(el) {
    scrollContainerRef.value = el;
  }

  function goToNextStage() {
    if (stage.value === 'preview') {
      stage.value = 'sign1';
    } else if (stage.value === 'sign1') {
      stage.value = 'sign2';
    } else {
      console.log('✅ 所有步驟完成');
    }
    currentPage.value = 0;
  }


  async function renderInsureanceDoc(doc: any): Promise<HTMLCanvasElement | null> {
    const tiffUrl = doc.tiffUrl;

    try {
      isLoading.value = true
      const response = await fetch(tiffUrl)
      const arrayBuffer = await response.arrayBuffer()
      const tiff = await fromArrayBuffer(arrayBuffer)
      const image = await tiff.getImage();
      const raster = await image.readRasters({ interleave: true });
      const canvas = document.createElement('canvas');
      const width = image.getWidth();
      const height = image.getHeight();
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(width, height);

      canvas.width = width;
      canvas.height = height;
      // salesDocPreview.value[page].pageHeight = height

      for (let i = 0; i < width * height; i++) {
        const r16 = raster[i * 4] as any;
        const g16 = raster[i * 4 + 1] as any;
        const b16 = raster[i * 4 + 2] as any;
        const a16 = raster[i * 4 + 3] as any;

        const r = (r16 * 255) / 65535;
        const g = (g16 * 255) / 65535;
        const b = (b16 * 255) / 65535;
        const a = (a16 * 255) / 65535;

        imageData.data[i * 4] = r;
        imageData.data[i * 4 + 1] = g;
        imageData.data[i * 4 + 2] = b;
        imageData.data[i * 4 + 3] = a;
      }

      ctx.putImageData(imageData, 0, 0);
      // renderedCanvas.value = canvas;
      isLoading.value = false
      return canvas;
    } catch (error) {
      isLoading.value = false
      console.error('渲染 TIFF 失敗:', error);

      return null;
    }
  }


  async function switchPage({ index = currentPage.value, type = '' }) {
    isLoading.value = false
    if (type === 'last' && currentPage.value === 0) return;
    if (type === 'next' && currentPage.value === salesDocPreview.value.length - 1) return;

    // if (type === 'next') {
    //   currentPage.value++;
    // } else if (type === 'last') {
    //   currentPage.value--;
    // } else if (index !== currentPage.value) {
    // }
    currentPage.value = index;
    scrollToPage(currentPage.value);
    //需已閱讀才能跳頁
    // if (salesDocPreview.value[currentPage.value].readComplete) {
    //   currentPage.value = index;
    //   scrollToPage(currentPage.value);
    // }
  }

  function scrollToPage(pageIndex) {

    const el = scrollContainerRef.value?.$el || scrollContainerRef.value;
    if (!(el instanceof HTMLElement)) return;

    let targetTop = 0;

    for (let i = 0; i < pageIndex; i++) {
      const doc = currentDocs.value[i];
      const height = (stage.value === 'preview' && 'pageHeight' in doc) ? doc.pageHeight : 0;
      targetTop += height;
    }

    el.scrollTo({
      top: targetTop,
      behavior: 'auto'
    });


    console.log(`🔍 滾動至第 ${pageIndex + 1} 頁，位置 ${targetTop}px`);
  }

  return {
    stage,
    insureanceData,
    currentPage,
    switchPage,
    renderInsureanceDoc,
    renderedCanvas,
    isLoading,
    scrollContainerRef,
    setScrollContainer,
    scrollToPage,
    eableNextButton,
    goToNextStage,
    currentDocs
  };
});