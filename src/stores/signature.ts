import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { fromArrayBuffer } from 'geotiff'
import { getSignatureDoc } from '@/service/documentSignature';
import { typeMapRole } from '@/utility/roleMap';



export const useInsureanceStore = defineStore('insureance', () => {
  type Stage = 'preview' | 'sign1' | 'sign2';
  type SignStatus = 'unselected' | 'unsigned' | 'signed';
  const insureanceData = ref<any[]>([]);
  const stage = ref<Stage>('preview');
  const currentRole = ref(0)
  const currentPage = ref(0);
  const renderedCanvas = ref(null);
  const isLoading = ref(true)
  const scrollContainerRef = ref(null);
  const signatureButton = ref<any[]>([]);
  const currentDocs = computed(() => insureanceData.value);
  const originalStatusMap = ref<Record<number, { status: SignStatus; type: number }>>({});
  const navbarHeight = ref<number>(0)
  const allCurrentRoleSigned = computed(() => {
    return signatureButton.value
      .filter(item => item.type === currentRole.value)
      .every(item => item.signimg?.trim());
  });
  const clickTabMapToType = computed(() => {
    return signatureButton.value[currentPage.value]?.type ?? null;
  });


  //是否啟用下一步的按鈕
  const enableNextButton = computed(() => {
    if (stage.value === 'preview') {
      return insureanceData.value.every(doc => doc.readComplete);
    }
    if (stage.value === 'sign1') {
      return signatureButton.value.every(doc => doc.signimg)
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
  async function transformToSignatureButtons(docs: any[]) {
    signatureButton.value = []; // 清空之前的資料
    originalStatusMap.value = {};
    for (const doc of docs) {
      const documentHeight = await getImageHeight(doc.docSource);
      for (const sig of doc.signature || []) {
        const status: SignStatus = sig.signimg?.trim() ? 'signed' : 'unselected';
        const type = parseInt(sig.type);
        const index = signatureButton.value.length;

        signatureButton.value.push({
          ...sig,
          type,
          pageIndex: doc.pageIndex,
          form: doc.form,
          docSource: doc.docSource,
          signedStatus: status,
          documentHeight,

        });
        originalStatusMap.value[index] = {
          status,
          type
        };
      }
    }
    setFirstPageCurrentRole()
  }

  function setFirstPageCurrentRole() {
    const first = signatureButton.value[0];
    currentRole.value = first ? first.type : 0;
  }

  //取得每個圖片的高度
  function getImageHeight(src: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img.height);
      img.onerror = reject;
    });
  }

  //角色列按鈕
  const signatureRoleType = computed(() => {
    const roleMap = new Map<number, {
      type: number;
      name: string;
      allSignedComplete: boolean;
      pageIndex: number[];
      buttonIndex: number[];
    }>();

    signatureButton.value.forEach((item, index) => {
      const type = item.type;
      const pageIndex = item.pageIndex;

      if (!roleMap.has(type)) {
        roleMap.set(type, {
          type,
          name: typeMapRole[type] || `未知角色 ${type}`,
          allSignedComplete: true,
          pageIndex: [pageIndex],
          buttonIndex: [index],
        });
      } else {
        const role = roleMap.get(type)!;

        if (!role.pageIndex.includes(pageIndex)) {
          role.pageIndex.push(pageIndex);
        }

        role.buttonIndex.push(index);
      }

      if (!item.signimg?.trim()) {
        roleMap.get(type)!.allSignedComplete = false;
      }
    });

    return Array.from(roleMap.values());
  });


  //引用Canvas組件的參考
  function setScrollContainer(el: any) {
    scrollContainerRef.value = el;
  }


  async function renderInsureanceDoc(doc: any): Promise<HTMLCanvasElement | null> {
    const base64 = doc.docSource;

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


        if (stage.value !== 'preview') {
          const highlights = (doc.signature || []).map(sig => ({
            xy: sig.xy,
            color: '#eb949459'
          }));

          // 畫框
          highlights.forEach(({ xy, color }) => {
            const [x, y, width, height] = xy.split(',').map(Number);
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);
          });
        }

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

  //上、下按鈕切換
  function switchSignButton({ index = currentPage.value, type = '' }) {
    const buttons = signatureButton.value;
    const total = buttons.length;

    if (type === 'next') {
      let nextIndex = currentPage.value + 1;
      while (nextIndex < total && buttons[nextIndex].signimg?.trim()) {
        nextIndex++;
      }
      if (nextIndex < total) {
        // ✅ 恢復當前的原始狀態
        buttons[currentPage.value].signedStatus = originalStatusMap.value[currentPage.value]?.status;
        currentPage.value = nextIndex;
        if (buttons[nextIndex].signedStatus === 'unselected') {
          buttons[nextIndex].signedStatus = 'unsigned';
        }
        skipToSignPosition(nextIndex, 'button')
        // currentRole.value = originalStatusMap.value[currentPage.value]?.type
      }
    } else if (type === 'last') {
      let prevIndex = currentPage.value - 1;
      while (prevIndex >= 0 && buttons[prevIndex].signimg?.trim()) {
        prevIndex--;
      }
      if (prevIndex >= 0) {
        // ✅ 恢復當前的原始狀態p
        buttons[currentPage.value].signedStatus = originalStatusMap.value[currentPage.value]?.status;
        currentPage.value = prevIndex;
        if (buttons[prevIndex].signedStatus === 'unselected') {
          buttons[prevIndex].signedStatus = 'unsigned';
        }
        skipToSignPosition(prevIndex, 'button')

        // currentRole.value = originalStatusMap.value[currentPage.value]?.type
      }
    } else {
      currentPage.value = index;
      skipToSignPosition(index, 'button')
    }
  }

  //跳到簽名的位置
  function skipToSignPosition(buttonIndex: number = 0, type: string) {
    const el = scrollContainerRef.value?.$el || scrollContainerRef.value;
    if (!(el instanceof HTMLElement)) return;

    const target = signatureButton.value[buttonIndex];
    const [x, y, width, height] = target.xy.split(',').map(Number);
    const { pageIndex, pageHeight, documentHeight } = target;

    let targetTop = 0;

    if (type === 'button') {
      // ✅ 正確地從 currentDocs 計算前面頁面的總高度
      const accumulatedHeight = currentDocs.value
        .slice(0, pageIndex)
        .reduce((sum, doc) => sum + (doc.pageHeight || 0), 0);

      const yOffset = (pageHeight / documentHeight) * y;

      targetTop = accumulatedHeight + yOffset - navbarHeight.value;

      // console.log('📌 scrollTo 詳細資訊：');
      // console.log('pageIndex:', pageIndex);
      // console.log('accumulatedHeight:', accumulatedHeight);
      // console.log('yOffset:', yOffset);
      // console.log('navbarHeight:', navbarHeight.value);
      // console.log('targetTop:', targetTop);
    }

    el.scrollTo({
      top: targetTop,
      behavior: 'instant',
    });
  }

  return {
    stage,
    navbarHeight,
    insureanceData,
    currentPage,
    currentRole,
    originalStatusMap,
    switchPage,
    skipToSignPosition,
    switchSignButton,
    renderInsureanceDoc,
    renderedCanvas,
    isLoading,
    scrollContainerRef,
    setScrollContainer,
    scrollToPage,
    enableNextButton,
    currentDocs,
    fetchInsureanceDocs,
    signatureButton,
    signatureRoleType,
    allCurrentRoleSigned,
    clickTabMapToType
  };
});