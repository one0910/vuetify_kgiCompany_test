<script setup></script>
<template>
  <nav>
    <v-list flat class="text-white">
      <v-list-item class="text-center">
        <v-icon icon="mdi-view-dashboard"></v-icon>
        <v-list-item-subtitle>Dasboard</v-list-item-subtitle>
        <v-list-item-text> aaaa </v-list-item-text>
      </v-list-item>
    </v-list>
    <v-list>
      <v-list-item-content class="d-flex justify-center align-center">
        <v-avatar
          color="transparent"
          size="30"
          style="border: 2px solid blue"
        >
          <v-icon
            icon="mdi-pencil-outline"
            color="white"
            class="bg-red rounded-xl pa-3"
            size="15"
          ></v-icon>
        </v-avatar>
        <v-list-item-subtitle class="pl-3 text-h6">
          01
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list>
  </nav>
</template>

<style lang="scss" scoped></style>
