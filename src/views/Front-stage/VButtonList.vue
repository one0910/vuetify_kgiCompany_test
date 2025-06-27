<script setup></script>
<template>
  <!-- 背景容器 -->
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" lg="8">
        <!-- 上方標題不在卡片內 -->
        <h2 class="text-center font-weight-medium mb-6">紙本簽署行動投保確認書</h2>

        <!-- 中間白底卡片 -->
        <v-card
          class="pa-6 mx-auto d-flex flex-column justify-space-evenly"
          elevation="0"
          rounded="lg"
          width="618"
          height="296"
        >
          <!-- 說明文字 -->
          <h4 class="font-weight-medium">請參考行動投保確認書上方之序號條碼</h4>
          <h4 class="font-weight-medium">掃描編號或手動輸入編號</h4>

          <!-- 新增掃描按鈕 -->
          <v-btn variant="text" color="primary">
            <v-icon start size="x-large">mdi-plus-circle</v-icon>
            新增掃描
          </v-btn>

          <!-- 輸入欄位 -->
          <div>
            <v-text-field label="請輸入" variant="underlined" hide-details="auto" clearable />
          </div>
        </v-card>
        <v-sheet class="mx-auto d-flex justify-center mt-8" width="618" color="transparent">
          <v-btn
            density="comfortable"
            color="blue-darken-4"
            size="x-large"
            class="bg-white mr-5 text-subtitle-1"
            variant="text"
            width="250"
            >返回編輯
          </v-btn>
          <v-btn
            density="comfortable"
            color="white"
            size="x-large"
            width="250"
            class="bg-blue-darken-4 text-subtitle-1"
            >下一步
          </v-btn>
        </v-sheet>
        <!-- 下方按鈕 -->
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.custom-disabled-btn {
  background-color: #c4c4c400 !important;
  color: #333 !important;
  pointer-events: none;
  border: 1px solid #c4c4c400 !important;
}
</style>
