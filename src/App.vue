<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import { useTheme } from 'vuetify/lib/composables/theme';

const items = ref([
  { title: 'Click Me', color: 'blue', icon: 'mdi-apple' },
  {
    title: 'Click Me',
    color: 'red',
    icon: 'mdi-cloud-check-outline'
  },
  {
    title: 'Click Me',
    color: 'green',
    icon: 'mdi-bullhorn-variant-outline'
  },
  { title: 'Click Me 2', color: 'orange', icon: 'mdi-bell' }
]);

const darkTheme = ref(true);
const theme = useTheme();

function changeTheme(params) {
  darkTheme.value = !darkTheme.value;
  theme.global.name.value = darkTheme.value ? 'dark' : 'light';
}
</script>
<template>
  <v-app>
    <v-toolbar density="comfortable">
      <v-btn icon="mdi-menu"></v-btn>
      <v-toolbar-title>
        <router-link to="/">Vuetify</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon @click="changeTheme">
        <v-icon :icon="darkTheme ? 'mdi-weather-night' : 'mdi-weather-sunny'"></v-icon>
      </v-btn>

      <v-menu transition="scale-transition">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-badge content="10" color="red-darken-4">
              <v-icon icon="mdi-bell" color="blue-darken-4"></v-icon>
            </v-badge>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index" :value="index">
            <v-list-item-title>
              <v-icon :color="item.color" :icon="item.icon"></v-icon>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn to="/vradio" class="ml-2" size="small" text="V-radio"> </v-btn>
      <v-btn to="/vradio2" class="ml-2" size="small" text="V-radio2"> </v-btn>
      <v-btn to="/vlist" class="ml-2" size="small" text="Vlist"> </v-btn>

      <v-btn to="/vbuttonlist" class="ml-2" size="small" text="Signature"> </v-btn>
      <v-btn to="/vbuttonlist2" class="ml-2" size="small" text="Signature2"> </v-btn>

      <v-btn to="/login" variant="outlined" size="small" text="LOGIN"> </v-btn>
    </v-toolbar>
    <v-main class="bg-customBgColor">
      <RouterView />
      <!-- <v-slide-x-transition>
        <RouterView />
      </v-slide-x-transition> -->
    </v-main>
  </v-app>
</template>
