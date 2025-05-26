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
  const currentRole = ref(0)
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
      if (!acc[sig.form]) {
        acc[sig.form] = [];
      }
      acc[sig.form].push(sig);
      return acc;
    }, {});
    console.log(`groupedSignatures => `, groupedSignatures)

    // 將 form 結合對應的 signature
    const transformedData = form.map((item: any, index: number) => {
      return {
        ...item,
        // type:[].push(groupedSignatures) || []
        pageIndex: index,
        signature: groupedSignatures[item.form] || [],
        pageHeight: 0,
      }
    });
    insureanceData.value = transformedData;
    transformToSignatureButtons(transformedData);
  }

  //再將資料重整至signatureButton
  function transformToSignatureButtons(docs: any[]) {
    signatureButton.value = []; // 清空之前的資料
    for (const doc of docs) {
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
    currentRole.value = result[0]?.type
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
    const base64 = doc.tiffUrl;
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('無法取得 CanvasRenderingContext2D'));
        ctx.drawImage(img, 0, 0);
        const highlights = [
          { xy: "129.921265,1095.275635,151.968506,39.370079", color: "#eb949459" },
          { xy: "855.118103,1792.125977,118.110237,53.543331", color: "#eb949459" },
          { xy: "73.228348,1929.133911,396.063019,62.204796", color: "#eb949459" },
        ];

        // 畫框
        highlights.forEach(({ xy, color }) => {
          const [x, y, width, height] = xy.split(',').map(Number);
          // ctx.fillStyle = color;
          // ctx.fillRect(x, y, width, height);
        });



        canvas.addEventListener('mousemove', (event) => {
          const rect = canvas.getBoundingClientRect(); // 取得畫布相對位置
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;

          const mouseX = (event.clientX - rect.left) * scaleX;
          const mouseY = (event.clientY - rect.top) * scaleY;

          // console.log(`🖱️ 滑鼠在 canvas 座標: (${mouseX.toFixed(2)}, ${mouseY.toFixed(2)})`);
        });
        resolve(canvas); // ✅ 回傳 canvas

      };
      img.onerror = (err) => reject(err);
    });
  }


  //換頁籤切換功能
  async function switchPage({ index = currentPage.value, type = '' }) {
    isLoading.value = false
    if (type === 'last' && currentPage.value === 0) return;
    if (type === 'next' && currentPage.value === currentDocs.value.length - 1) return;

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