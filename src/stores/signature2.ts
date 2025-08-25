import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getSignatureDoc } from '@/service/documentSignature';
import { typeMapRole } from '@/utility/roleMap';
import throttle from 'lodash/throttle';
import Insureance3 from '@/mocks/Insureance3.json'




export const useInsureanceStore = defineStore('insureance', () => {
  type Stage = 'signTypeSelect' | 'signType_paper' | 'preview' | 'sign1' | 'sign2';
  type SignStatus = 'unselected' | 'unsigned' | 'signed';
  const insureanceData = ref<any[]>([]);
  const stage = ref<Stage>('preview');
  const currentRole = ref({ index: 0, type: 0 })
  const currentPage = ref(0);
  const renderedCanvas = ref(null);
  const loadDocLoading = ref(false)
  const scrollContainerRef = ref(null);
  const currentDocs = computed(() => insureanceData.value);
  const originalStatusMap = ref<Record<number, { status: SignStatus; type: number }>>({});
  const navbarHeight = ref<number>(0)
  const signatureRoleType = ref<any[]>([])
  const openSignaturePadModal = ref<boolean>(false)
  const currectClickSign = ref({ width: 0, height: 0, pageIndex: 0, sigIndex: 0, type: 0 })
  const salseSignatureImg = ref<string>('')
  const currentGetPageInfo = ref<{ allPageNumber: number, loadedPage: number }>({ allPageNumber: 17, loadedPage: 0 })

  // let allPageNumber = 17


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
  async function fetchInsureanceDocs(addData?: any) {
    // const rawData = addData || Insureance3.data?.overPrints[0];
    const rawData = addData || await getSignatureDoc(0);
    // const data = Insureance3.data?.overPrints[0]
    // const data = getSignatureDoc(2)
    // console.log(`data => `, data)

    if (!rawData) return;
    const { form, sign, totalPage } = rawData;
    if (totalPage) {
      currentGetPageInfo.value.allPageNumber = totalPage
    }

    const groupedSignatures = sign.reduce((acc: Record<string, any[]>, sig) => {
      if (!acc[sig.formId]) {
        acc[sig.formId] = [];
      }
      acc[sig.formId].push({
        ...sig,
        type: parseInt(sig.type),
        sigIndex: acc[sig.formId].length
      });
      return acc;
    }, {});

    // 起始頁面 index 要根據現有資料長度繼續編號


    // 將form 結合對應的signatrue
    const transformedData = await Promise.all(
      form.map(async (item, idx) => {
        const pageIndex = idx;
        // const documentHeight = await getImageHeight(item.docSource);
        const documentHeight = 2339;

        return {
          ...item,
          docSource: `${item.docSource}`,
          pageIndex,
          signature: groupedSignatures[item.formId] || [],
          pageHeight: 0,
          documentHeight,
        };
      })
    );

    if (!addData) {
      console.log('[首次載入] transformedData =>', transformedData);
      insureanceData.value.push(...transformedData);
      addPage()
    } else {
      console.log('[新增資料] addData =>', addData);
      console.log('[新增資料] transformedData =>', transformedData);
      insureanceData.value.splice(0, transformedData.length, ...transformedData)
      await renderedCanvas.value.updateCanvas(1, currentGetPageInfo.value.allPageNumber)
    }

    // ⭐️ 重新建構角色對應
    buildSignatureRoleType();

    // 如果是初次載入才設 currentRole
    // 若是新增資料也補上目前角色的狀態映射
    if (!addData) {
      renderedCanvas.value.renderAllCanvas()
      setFirstPageCurrentRole();
      return
    } else {
      switchRoleToButton(currentRole.value.index, currentRole.value.type);
    }
  }



  function setFirstPageCurrentRole() {
    const first = signatureRoleType.value[0];
    currentRole.value = first ? { index: 0, type: first.type } : { index: 0, type: 0 }
    // switchRoleToButton(0, 0)
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
    const ROLE_ORDER = [46, 1, 2, 4, 5, 7, 8, 3, 0, 6]
    const roleMap = new Map<number, Record<number, { signIndex: string, signDate: String, isSign: Boolean, type: String, sname: String, formId: String, sigIndex: number, pageIndex: number, documentHeight: number, pageHeight: number, signId: string; signimg: string; xy: string }>>();
    // console.log(`roleMap => `, roleMap)

    //將每頁的頁面資料轉成從名角色對應按鈕
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
            formId: sig.formId,
            sname: sig.sname,
            signId: sig.signId,
            signimg: sig.signimg,
            sigIndex: sig.sigIndex,
            isSign: sig.isSign,
            type: (sig.type).toString(),
            signIndex: sig.signIndex,
            xy: sig.xy,
            documentHeight: doc.documentHeight,
            pageHeight: doc.pageHeight,
            pageIndex: doc.pageIndex,
            signDate: '',
          };
        }
      }
    }

    // 再將角色對應按鈕做排序，排序成46, 1, 2, 4, 5, 7, 8, 3, 0, 6的順序
    const reSortedMap = Array.from(roleMap.entries()).sort(([a], [b]) => {
      const orderIndex = (type: number) => {
        const i = ROLE_ORDER.indexOf(type)
        return i === -1 ? Number.POSITIVE_INFINITY : i
      }

      const ia = orderIndex(a)
      const ib = orderIndex(b)
      if (ia !== ib) return ia - ib       // 先比自訂順序
      return a - b                         // 其次用數字大小做穩定排序
    })

    // ✅ 產生完整的 signatureRoleType 陣列，並生成 buttonStatus
    const result = reSortedMap.map(([type, pageMap]) => {
      const buttonStatus: SignStatus[] = [];
      const totalPages = insureanceData.value.length;

      for (let i = 0; i < totalPages; i++) {
        if (pageMap[i]) {
          // console.log(`2 => `,)
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

  async function addPage() {
    // if (insureanceData.value.length >= currentGetPageInfo.value.allPageNumber) return

    const addData = await getSignatureDoc(2)
    fetchInsureanceDocs(addData)
  }

  // 使用 throttle事年節流，來防上同一時間點多次觸發增加頁面的API
  const throttledAddPage = throttle(addPage, 1000, { leading: true, trailing: false });

  //角色切換
  function switchRoleToButton(index: number, type?: number) {
    const docs = currentDocs.value;
    const role = signatureRoleType.value[index] as any
    const unSignedIndex = role.buttonStatus.findIndex((status: string) => status === 'unsigned')
    const signIndex = role.buttonStatus.findIndex((status: string) => status === 'signed')

    //變更簽名類型(角色)
    currentRole.value = { index, type }

    // 根據對應角色的 buttonStatus，逐頁更新 currentDocs 中的 buttonStatus
    role.buttonStatus.forEach((status, pageIndex) => {
      if (docs[pageIndex]) {
        docs[pageIndex].buttonStatus = status;

        //在這裡做重新render canvas，目的是為了只有切換到該角色時，未簽未位置才會顯示粉紅背景框
        if (!renderedCanvas.value) {
          return
        } else {
          renderedCanvas.value.updateCanvasByIndex(pageIndex)
        }
      }
    });

    //只有在簽名頁時，sidebar的按鈕才需要去判斷它做簽名類型(角色)切換時，它會在哪一頁的按鈕，同時並將其跳至該頁的所在的角色簽名
    if (stage.value === 'sign1') {
      if (unSignedIndex !== -1) {
        skipToSignPosition(unSignedIndex.toString(), 'button')
        currentPage.value = unSignedIndex
      } else if (signIndex !== -1) {
        skipToSignPosition(signIndex.toString(), 'button')
        currentPage.value = signIndex
      } else {
        skipToSignPosition('0', 'button')
      }
    }
  }


  //引用Canvas組件的參考
  function setScrollContainer(el: any) {
    scrollContainerRef.value = el;
  }

  function setCanvseViewer(canvasViewerRef: any) {
    renderedCanvas.value = canvasViewerRef
  }

  function removeAllSignature(params: type) {

  }


  async function renderInsureanceDoc(doc: any): Promise<HTMLCanvasElement | null> {
    const base64 = doc.docSource;
    // 如果沒有base64的情況下，做一個空的cavas
    if (!base64) {
      return getEmptyCanvas()
    }

    // 正常情況下載入 base64 圖片
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

        const clickableRects: { x: number; y: number; width: number; height: number; xy: string, index: { pageIndex: number, sigIndex: number, type: number } }[] = [];

        if (stage.value !== 'preview') {
          const highlights = (doc.signature || []).map(sig => {
            return {
              xy: sig.xy,
              signimg: sig.signimg,
              color: (sig.signimg) ? 'rgba(0, 0, 0, 0)' : '#eb949459',
              index: {
                pageIndex: doc.pageIndex,
                sigIndex: sig.sigIndex,
                type: sig.type
              }
            }
          });

          // 畫框
          highlights.forEach(({ xy, color, signimg, index }) => {

            const [x, y, width, height] = xy.split(',').map(Number);
            if (index.type === currentRole.value.type) {
              ctx.fillStyle = color;
              ctx.fillRect(x, y, width, height);
            }

            // ✅ 儲存可點擊區域
            clickableRects.push({ x, y, width, height, xy, index });
            const imgRatio = 1117 / 312;
            const targetRatio = width / height;

            const signImg = new Image();
            signImg.src = signimg;
            signImg.onload = () => {

              let drawWidth = width;
              let drawHeight = height;
              let offsetX = 0;
              let offsetY = 0;

              if (imgRatio > targetRatio) {
                // 圖片比較寬，依寬等比縮放
                drawWidth = width;
                drawHeight = width / imgRatio;
                offsetY = (height - drawHeight) / 2;
              } else {
                // 圖片比較高，依高等比縮放
                drawHeight = height;
                drawWidth = height * imgRatio;
                offsetX = (width - drawWidth) / 2;
              }

              ctx.drawImage(signImg, x + offsetX, y + offsetY, drawWidth, drawHeight)
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
          console.log(`clicked => `, clicked)


          if (!clicked) return
          if (clicked.index.type === currentRole.value.type) {
            currectClickSign.value = { ...clicked.index, width: clicked.width, height: clicked.height }
            openSignaturePadModal.value = true
          } else if (clicked.index.type !== currentRole.value.type) {
            alert(`請切換至${typeMapRole[clicked.index.type]}`);
          }
        });

        resolve(canvas); // ✅ 回傳 canvas

      };
      img.onerror = (err) => reject(err);
    });
  }

  //製作空的cavas
  function getEmptyCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 1654;
    canvas.height = 2339;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      let angle = 0; // 用於控制旋轉角度

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 文字
        ctx.fillStyle = '#000000';
        ctx.font = '24px Arial';
        ctx.textBaseline = 'top';
        ctx.fillText('文件載入中', 20, 20);

        // // 畫旋轉的圓圈
        // const x = 160; // 圓圈位置 (文字旁邊)
        // const y = 30;
        // const radius = 10;

        // ctx.save();
        // ctx.translate(x, y);
        // ctx.rotate(angle);
        // ctx.beginPath();
        // ctx.arc(0, 0, radius, 0, Math.PI * 1.5); // 只畫 270 度
        // ctx.strokeStyle = '#ccc';
        // ctx.lineWidth = 3;
        // ctx.stroke();
        // ctx.restore();

        // angle += 0.25; // 每次動畫旋轉的角度
        // requestAnimationFrame(draw);
      };

      draw();
    }
    return canvas;
  }


  //換頁籤切換功能
  async function switchPage({ index = currentPage.value, type = '' }) {
    // loadDocLoading.value = true
    currentPage.value = index;
    scrollToPage(currentPage.value);
    if (!insureanceData.value[index].docSource) {
      // loadDocLoading.value = true
      // addPage()
      // loadDocLoading.value = false

    }
    // loadDocLoading.value = false
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

  // 依 signatureRoleType 即時計算：每個角色是否全部簽完
  const roleAllSignedMap = computed<boolean[]>(() => {
    const results = signatureRoleType.value.map((role, index) => {
      const pages = Object.values(role.pageData) as Array<{ signimg?: string }>
      const isAllSigned = pages.length > 0 && pages.every(p => !!p.signimg && p.signimg.trim() !== '')

      // 同步更新對應角色的 allSignedComplete
      role.allSignedComplete = isAllSigned
      return isAllSigned
    })
    return results
  })

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

        if (currentRole.value.type === 0 && salseSignatureImg.value) {
          setImageToSalseRole(nextKey)
        }

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

        if (currentRole.value.type === 0 && salseSignatureImg.value) {
          setImageToSalseRole(prevKey)
        }

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

  //當角色簽名為業務時，按下下一個按鈕，會將簽名印至業務員的位置
  function setImageToSalseRole(key: number) {
    const role = signatureRoleType.value[currentRole.value.index];
    const roleSignData = role.pageData[key.toString()]
    roleSignData.signimg = salseSignatureImg.value
    currentDocs.value[key].signature[roleSignData.sigIndex].signimg = salseSignatureImg.value
    role.buttonStatus[key] = 'signed'
    currentDocs.value[key].buttonStatus = 'signed'

    if (roleAllSignedMap.value[currentRole.value.index]) {
      role.allSignedComplete = true
    }
    renderedCanvas.value.updateCanvasByIndex(key)

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
    addPage: throttledAddPage,
    originalStatusMap,
    switchPage,
    skipToSignPosition,
    switchSignButton,
    switchRoleToButton,
    renderInsureanceDoc,
    renderedCanvas,
    loadDocLoading,
    scrollContainerRef,
    setScrollContainer,
    setCanvseViewer,
    scrollToPage,
    enableNextButton,
    currentDocs,
    fetchInsureanceDocs,
    signatureRoleType,
    checkRoleSignAll,
    openSignaturePadModal,
    salseSignatureImg
  };
});