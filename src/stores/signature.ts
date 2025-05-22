import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { fromArrayBuffer } from 'geotiff'
import { getSignatureDoc } from '@/service/documentSignature';
import { typeMapRole } from '@/utility/roleMap';


export const useInsureanceStore = defineStore('insureance', () => {

  const insureanceData = ref<any[]>([]);

  type Stage = 'preview' | 'sign1' | 'sign2';
  type SignStatus = 'unselected' | 'unsigned' | 'signed';
  const stage = ref<Stage>('preview');
  const currentRole = ref(9)
  const currentPage = ref(0);
  const renderedCanvas = ref(null);
  const isLoading = ref(true)
  const scrollContainerRef = ref(null);
  const signatureButton = ref<any[]>([]);

  const currentDocs = computed(() => insureanceData.value);

  //是否啟用下一步的按鈕
  const enableNextButton = computed(() => {
    if (stage.value === 'preview') {
      return insureanceData.value.every(doc => doc.readComplete);
    }
    if (stage.value === 'sign1' || stage.value === 'sign2') {
      return insureanceData.value.every(doc =>
        doc.signature.every((sig: { signImg: string; }) => sig.signImg && sig.signImg.trim() !== '')
      );
    }
    return false;
  });


  // 後端傳來的資料做好整理後放至insureanceData
  async function fetchInsureanceDocs() {
    const data = await getSignatureDoc();
    if (!data) return;

    const { form, sign } = data;

    // 將 sign 根據 form 分組
    const groupedSignatures = sign.reduce((acc: Record<string, any[]>, sig) => {
      if (!acc[sig.form]) acc[sig.form] = [];
      acc[sig.form].push(sig);
      return acc;
    }, {});

    // 將 form 結合對應的 signature
    const transformedData = form.map((item: any, index: number) => ({
      ...item,
      pageIndex: index,
      signature: groupedSignatures[item.form] || [],
      pageHeight: 0,
    }));

    console.log(`transformedData => `, transformedData)
    insureanceData.value = transformedData;

    signatureButton.value = [];

    for (const doc of transformedData) {
      for (const sig of doc.signature || []) {
        const status: SignStatus = sig.signimg?.trim() ? 'signed' : 'unselected';
        signatureButton.value.push({
          ...sig,
          type: parseInt(sig.type),
          pageIndex: doc.pageIndex,
          form: doc.form,
          tiffUrl: doc.tiffUrl,
          signedStatus: status
        });
      }
    }
  }

  //簽名頁sideBar的按鈕
  // const signatureButton = computed(() => {
  //   const result = []
  //   for (const doc of insureanceData.value) {
  //     for (const sig of doc.signature || []) {
  //       const status: SignStatus = (sig.signimg?.trim()) ? 'signed' : 'unselected';
  //       result.push({
  //         ...sig,
  //         type: parseInt(sig.type),
  //         pageIndex: doc.pageIndex,
  //         form: doc.form,
  //         tiffUrl: doc.tiffUrl,
  //         signedStatus: status,
  //       })
  //     }
  //   }
  //   return result
  // })

  //角色列按鈕
  const signatureRoleType = computed(() => {
    const seen = new Set<number>()
    const result: { type: number; name: string, allSignedComplete: boolean }[] = []

    for (const item of signatureButton.value) {
      if (!seen.has(item.type)) {
        seen.add(item.type)
        const buttonsOfThisType = signatureButton.value.filter(btn => btn.type === item.type)
        const allSigned = buttonsOfThisType.every(btn => !!btn.signimg?.trim())
        result.push({
          type: item.type,
          name: typeMapRole[item.type] || `未知角色 ${item.type}`,
          allSignedComplete: allSigned
        })
      }
    }
    return result
  })



  //引用Canvas組件的參考
  function setScrollContainer(el: any) {
    scrollContainerRef.value = el;
  }

  //前進到下一步
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


  //換頁籤切換功能
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

  //滑行滾輪移動到該頁
  function scrollToPage(pageIndex: number) {

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
    currentRole,
    switchPage,
    renderInsureanceDoc,
    renderedCanvas,
    isLoading,
    scrollContainerRef,
    setScrollContainer,
    scrollToPage,
    enableNextButton,
    goToNextStage,
    currentDocs,
    fetchInsureanceDocs,
    signatureButton,
    signatureRoleType
  };
});