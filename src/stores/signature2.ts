import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getSignatureDoc } from '@/service/documentSignature';
import { typeMapRole } from '@/utility/roleMap';



export const useInsureanceStore = defineStore('insureance', () => {
  type Stage = 'preview' | 'sign1' | 'sign2';
  type SignStatus = 'unselected' | 'unsigned' | 'signed';
  const insureanceData = ref<any[]>([]);
  const stage = ref<Stage>('preview');
  const currentRole = ref({ index: 0, type: 0 })
  const currentPage = ref(0);
  const renderedCanvas = ref(null);
  const isLoading = ref(true)
  const scrollContainerRef = ref(null);
  const currentDocs = computed(() => insureanceData.value);
  const originalStatusMap = ref<Record<number, { status: SignStatus; type: number }>>({});
  const navbarHeight = ref<number>(0)
  const signatureRoleType = ref<any[]>([])
  const openSignaturePadModal = ref<boolean>(false)
  const currectClickSign = ref({ pageIndex: 0, sigIndex: 0 })


  //是否啟用下一步的按鈕
  const enableNextButton = computed(() => {
    if (stage.value === 'preview') {
      return insureanceData.value.every(doc => doc.readComplete);
    }
    if (stage.value === 'sign1') {
      return insureanceData.value.every(doc =>
        (doc.signature || []).every(sig => sig.signimg?.trim())
      );
    }
    return false;
  });


  // 後端傳來的資料做好整理後放至insureanceData
  async function fetchInsureanceDocs() {
    const data = await getSignatureDoc();
    originalStatusMap.value = {};
    if (!data) return;

    const { form, sign } = data;

    // 將 sign 根據 form 分組
    const groupedSignatures = sign.reduce((acc: Record<string, any[]>, sig) => {
      if (!acc[sig.form]) {
        acc[sig.form] = [];
      }
      acc[sig.form].push({
        ...sig,
        type: parseInt(sig.type),
        sigIndex: acc[sig.form].length
      });
      return acc;
    }, {});

    // 將 form 結合對應的 signature
    const transformedData = await Promise.all(
      form.map(async (item, index) => {
        const documentHeight = await getImageHeight(item.docSource);
        originalStatusMap.value[index] = {
          status: 'unselected',
          type: 9
        }
        return {
          ...item,
          pageIndex: index,
          signature: groupedSignatures[item.form] || [],
          pageHeight: 0,
          documentHeight,
        };
      })
    );

    insureanceData.value = transformedData;
    buildSignatureRoleType()
    setFirstPageCurrentRole()
  }


  function setFirstPageCurrentRole() {
    const first = signatureRoleType.value[0];
    currentRole.value = first ? { index: 0, type: first.type } : { index: 0, type: 0 };
    switchRoleToButton(0)
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
  function buildSignatureRoleType() {
    const roleMap = new Map<number, Record<number, { sigIndex: number, pageIndex: number, documentHeight: number, pageHeight: number, signId: string; signimg: string; xy: string }>>();

    for (const doc of insureanceData.value) {
      const pageIndex = doc.pageIndex;
      for (const sig of doc.signature || []) {
        const type = parseInt(sig.type);
        if (!roleMap.has(type)) {
          roleMap.set(type, {});
        }

        // 如果這頁中已有該角色，跳過避免覆蓋（根據你資料結構，每頁一個type對應一筆簽名）
        if (!roleMap.get(type)![pageIndex]) {
          roleMap.get(type)![pageIndex] = {
            signId: sig.signId,
            signimg: sig.signimg,
            sigIndex: sig.sigIndex,
            xy: sig.xy,
            documentHeight: doc.documentHeight,
            pageHeight: doc.pageHeight,
            pageIndex: doc.pageIndex,
          };
        }
      }
    }

    // ✅ 產生完整的 signatureRoleType 陣列，並生成 buttonStatus
    const result = Array.from(roleMap.entries()).map(([type, pageMap]) => {
      const buttonStatus: SignStatus[] = [];
      const totalPages = insureanceData.value.length;

      for (let i = 0; i < totalPages; i++) {
        if (pageMap[i]) {
          buttonStatus.push(pageMap[i].signimg?.trim() ? 'signed' : 'unsigned');
        } else {
          buttonStatus.push('unselected');
        }
      }

      //從後端傳回來的資料要寫入至signatureRoleType，allSignedComplete是用來確認該簽名類型(角色)是否都已簽名
      const allSignedComplete = Object.values(pageMap).every((entry: any) => {
        return !!entry.signimg && entry.signimg.trim() !== '';
      });

      return {
        type,
        name: typeMapRole[type] || `未知角色 ${type}`,
        pageData: pageMap,
        allSignedComplete,
        buttonStatus
      };
    });
    signatureRoleType.value = result;
  }

  function switchRoleToButton(index: number) {
    const docs = currentDocs.value;
    const role = signatureRoleType.value[index];

    // 根據對應角色的 buttonStatus，逐頁更新 currentDocs 中的 buttonStatus
    role.buttonStatus.forEach((status, pageIndex) => {
      if (docs[pageIndex]) {
        docs[pageIndex].buttonStatus = status;
      }
    });
  }


  //引用Canvas組件的參考
  function setScrollContainer(el: any) {
    scrollContainerRef.value = el;
  }

  function setCanvseViewer(canvasViewerRef: any) {
    renderedCanvas.value = canvasViewerRef
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

        const clickableRects: { x: number; y: number; width: number; height: number; xy: string, index: { pageIndex: number, sigIndex: number } }[] = [];

        if (stage.value !== 'preview') {
          const highlights = (doc.signature || []).map(sig => {
            return {
              xy: sig.xy,
              signimg: sig.signimg,
              color: (sig.signimg) ? 'rgba(242, 246, 255, 0.5)' : '#eb949459',
              index: {
                pageIndex: doc.pageIndex,
                sigIndex: sig.sigIndex
              }
            }
          });

          // 畫框
          highlights.forEach(({ xy, color, signimg, index }) => {
            const [x, y, width, height] = xy.split(',').map(Number);
            ctx.fillStyle = color;
            ctx.fillRect(x, y, width, height);

            // ✅ 儲存可點擊區域
            clickableRects.push({ x, y, width, height, xy, index });

            const signImg = new Image();
            signImg.src = signimg;
            signImg.onload = () => {
              ctx.drawImage(signImg, x, y, width, height);
              //簽完名後，在背景上色
              // ctx.fillStyle = color;
              // ctx.fillRect(x, y, width, height);
            };
          });
        }
        // ✅ 座標定位click
        canvas.addEventListener('click', (event) => {
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;

          const mouseX = (event.clientX - rect.left) * scaleX;
          const mouseY = (event.clientY - rect.top) * scaleY;

          const clicked = clickableRects.find(({ x, y, width, height, index }) =>
            mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height
          );

          if (clicked) {
            openSignaturePadModal.value = true
            currectClickSign.value = clicked.index
          }
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

  function checkRoleSignAll(roleIndex: number): boolean {
    const role = signatureRoleType.value[roleIndex];
    if (!role || !role.pageData) return false;

    return Object.values(role.pageData).every((item: any) => item.signimg?.trim());
  }

  //滑行滾輪移動到該頁
  function scrollToPage(pageIndex: number) {

    const el = scrollContainerRef.value?.$el || scrollContainerRef.value;
    if (!(el instanceof HTMLElement)) return;

    let targetTop = 0;

    for (let i = 0; i < pageIndex; i++) {
      const doc = currentDocs.value[i];
      const height = doc.pageHeight || 0
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
    const role = signatureRoleType.value[currentRole.value.index];
    const pageKeys = Object.keys(role.pageData).map(k => Number(k)).sort((a, b) => a - b);
    const currentIdx = pageKeys.findIndex(k => k === currentPage.value);
    const isRoleAllSignCheck = checkRoleSignAll(currentRole.value.index);

    if (type === 'next') {
      //先判定該簽名類型(角色)的簽名是否都已完成，若是完成，直接跳到下一個簽名類型(角色)
      if (isRoleAllSignCheck) {
        const nextRoleIdx = currentRole.value.index + 1;
        if (nextRoleIdx < signatureRoleType.value.length) {
          currentRole.value = {
            index: nextRoleIdx,
            type: signatureRoleType.value[nextRoleIdx].type
          };
          const firstKey = Number(Object.keys(signatureRoleType.value[nextRoleIdx].pageData)[0]);
          currentPage.value = firstKey;
          console.log(`firstKey => `, firstKey)
          role.allSignedComplete
          switchRoleToButton(nextRoleIdx)
          skipToSignPosition(firstKey.toString(), 'button')
          console.log(`➡️ 切換角色至 index: ${firstKey}`);
        }
        return
      }

      //跳到該簽名類型(角色)的下一個按鈕
      const nextIdx = currentIdx + 1;
      //是否在該簽名類型(角色)的最後一頁(最後一顆按鈕)
      if (nextIdx < pageKeys.length) {
        const nextKey = pageKeys[nextIdx];
        currentPage.value = nextKey;
        skipToSignPosition(nextKey.toString(), 'button')
        //若是在最後一顆按鈕，則判斷是否該簽名類型(角色)的簽名都簽完，
      } else {
        // 若有發現該簽名類型(角色)尚未簽署完畢
        if (!isRoleAllSignCheck) {
          alert('您尚未簽署完畢');

          // 先找出該簽名類型(角色)是否還有未簽名的，若有，則先將該type的資料先全部列出來
          const incompleteRole = signatureRoleType.value.find((role) =>
            (Object.values(role.pageData) as { signimg: string }[]).some(item => !item.signimg?.trim())
          );

          if (incompleteRole) {
            //然後透過find方法，找出其該type未簽名裡的pageIndex (firstUnsignPage)
            const unsignedPages = Object.values(incompleteRole.pageData) as { signimg: string; pageIndex: number }[];
            const firstUnsignPage = unsignedPages.find(item => !item.signimg?.trim())?.pageIndex;
            console.log(`incompleteRole.type => `, incompleteRole.type)

            if (typeof firstUnsignPage === 'number') {
              currentRole.value = {
                index: signatureRoleType.value.findIndex(r => r.type === incompleteRole.type),
                type: incompleteRole.type
              };
              currentPage.value = firstUnsignPage;
              switchRoleToButton(currentRole.value.index);
              skipToSignPosition(String(firstUnsignPage), 'button');
            }
          }
          return;
        }
      }
    } else if (type === 'last') {
      const prevIdx = currentIdx - 1;
      if (prevIdx >= 0) {
        const prevKey = pageKeys[prevIdx];
        currentPage.value = prevKey;
        console.log(`⬅️ 上一頁 index: ${prevKey}`);
        skipToSignPosition(prevKey.toString(), 'button')
      } else {
        const prevRoleIdx = currentRole.value.index - 1;
        if (prevRoleIdx >= 0) {
          currentRole.value = {
            index: prevRoleIdx,
            type: signatureRoleType.value[prevRoleIdx].type
          };
          const lastKeys = Object.keys(signatureRoleType.value[prevRoleIdx].pageData).map(k => Number(k)).sort((a, b) => a - b);
          const lastKey = lastKeys[lastKeys.length - 1];
          currentPage.value = lastKey;
          switchRoleToButton(prevRoleIdx)
          skipToSignPosition(lastKey.toString(), 'button')
          console.log(`⬅️ 切換角色至 index: ${lastKey}`);
        }
      }
    } else {
      currentPage.value = index;
    }
  }


  //跳到簽名的位置
  function skipToSignPosition(positionIndex: string = '', type: string) {
    const el = scrollContainerRef.value?.$el || scrollContainerRef.value;
    if (!(el instanceof HTMLElement)) return;
    const roleIndex = currentRole.value.index
    const target = signatureRoleType.value[roleIndex].pageData[positionIndex];
    const [x, y, width, height] = target.xy.split(',').map(Number);
    const { pageIndex, pageHeight, documentHeight } = target;

    let targetTop = 0;

    if (type === 'button') {
      // ✅ 正確地從 currentDocs 計算前面頁面的總高度
      const accumulatedHeight = (pageHeight || 0) * (pageIndex || 0);
      const yOffset = (pageHeight / documentHeight) * y;

      targetTop = accumulatedHeight + yOffset - navbarHeight.value;


      // console.log('📌 scrollTo 詳細資訊：');
      // console.log('pageIndex:', pageIndex);
      // console.log(`pageHeight => `, pageHeight)
      // console.log(`documentHeight => `, documentHeight)
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
    currectClickSign,
    originalStatusMap,
    switchPage,
    skipToSignPosition,
    switchSignButton,
    switchRoleToButton,
    renderInsureanceDoc,
    renderedCanvas,
    isLoading,
    scrollContainerRef,
    setScrollContainer,
    setCanvseViewer,
    scrollToPage,
    enableNextButton,
    currentDocs,
    fetchInsureanceDocs,
    signatureRoleType,
    checkRoleSignAll,
    openSignaturePadModal
  };
});