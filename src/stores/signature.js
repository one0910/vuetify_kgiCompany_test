import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { fromArrayBuffer } from 'geotiff'

export const useInsureanceStore = defineStore('insureance', () => {
  const policyholderSignature = ref([
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
      tiffUrl: '/ag_ieasy_confirm1.tiff?url',
      isSignaturing: true,
      allSignatureComplete: false
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
      tiffUrl: '/ag_ieasy_confirm2.tiff?url',
      isSignaturing: true,
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
      tiffUrl: '/ag_ieasy_confirm3.tiff?url',
      isSignaturing: true,
      allSignatureComplete: false
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
      allSignatureComplete: false
    },
    {
      type: 'sign',
      insueranceId: Math.floor(Math.random() * 10000),
      title: '要保書5',
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
      allSignatureComplete: false
    },
    {
      type: 'sign',
      insueranceId: Math.floor(Math.random() * 10000),
      title: '要保書5',
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
      allSignatureComplete: false
    },
    {
      type: 'sign',
      insueranceId: Math.floor(Math.random() * 10000),
      title: '要保書5',
      signature: [
        {
          sinatureId: Math.floor(Math.random() * 10000),
          signatureTitle: '要保人同意同投保',
          cordinate: { x: 100, y: 200 },
          isSinged: true
        }
      ],
      tiffUrl: '/ag_ieasy_confirm7.tiff?url',
      isSignaturing: true,
      allSignatureComplete: false
    }
  ]);

  const salesDocPreview = ref([
    {
      type: 'read',
      salseDocId: Math.floor(Math.random() * 10000),
      title: '業務書1',
      tiffUrl: '/ag_ieasy_confirm.tiff',
      readComplete: false,
      pageHeight: 0
    },
    {
      type: 'read',
      salseDocId: Math.floor(Math.random() * 10000),
      title: '業務書2',
      tiffUrl: '/ag_ieasy_confirm2.tiff',
      readComplete: false,
      pageHeight: 0
    },
    {
      type: 'read',
      salseDocId: Math.floor(Math.random() * 10000),
      title: '業務書3',
      tiffUrl: '/ag_ieasy_confirm3.tiff',
      readComplete: false,
      pageHeight: 0
    },
  ])

  const salesDocSignature = ref([
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
      tiffUrl: '/ag_ieasy_confirm1.tiff?url',
      isSignaturing: true,
      allSignatureComplete: false
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
      tiffUrl: '/ag_ieasy_confirm2.tiff?url',
      isSignaturing: true,
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
      tiffUrl: '/ag_ieasy_confirm3.tiff?url',
      isSignaturing: true,
      allSignatureComplete: false
    },
  ])



  const currentPage = ref(0);
  const renderedCanvas = ref(null);
  const isLoading = ref(true)
  const scrollContainerRef = ref(null);
  const nextButton = computed(() =>
    salesDocPreview.value.every(doc => doc.readComplete === true)
  );

  function setScrollContainer(el) {
    scrollContainerRef.value = el;
  }

  async function renderInsureanceDoc(page) {
    const currentDoc = salesDocPreview.value[page];
    if (!currentDoc || !currentDoc.tiffUrl) {
      renderedCanvas.value = null;
      return null;
    }

    try {
      isLoading.value = true
      const response = await fetch(currentDoc.tiffUrl)
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
        const r16 = raster[i * 4];
        const g16 = raster[i * 4 + 1];
        const b16 = raster[i * 4 + 2];
        const a16 = raster[i * 4 + 3];

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
      const height = salesDocPreview.value[i]?.pageHeight || 0;
      targetTop += height;
    }

    el.scrollTo({
      top: targetTop,
      behavior: 'auto'
    });


    console.log(`🔍 滾動至第 ${pageIndex + 1} 頁，位置 ${targetTop}px`);
  }

  return {
    policyholderSignature,
    salesDocPreview,
    salesDocSignature,
    currentPage,
    switchPage,
    renderInsureanceDoc,
    renderedCanvas,
    isLoading,
    scrollContainerRef,
    setScrollContainer,
    scrollToPage,
    nextButton
  };
});