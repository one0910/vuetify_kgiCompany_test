<script setup>
import { ref } from 'vue'

const form = ref({
  email: '',
  password: '',
  remember: false
})

const isLoading = ref(false)

function submit(params) {
  if (form.value.email === '') {
    return
  }
  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
  }, 3000)
  console.log(`form.value => `, form.value)
}

const rules = {
  required: (value) => !!value || 'Required.',
  email: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid e-mail.'
  }
}
</script>
<template>
  <v-container fluid>
    <v-overlay
      :model-value="isLoading"
      class="align-center justify-center"
    >
      <v-progress-circular
        v-if="isLoading"
        color="white"
        indeterminate
      ></v-progress-circular>
    </v-overlay>

    <v-row justify="center">
      <v-col cols="6">
        <v-card class="pa-4 mx-auto">
          <v-card-title class="text-center underline"
            >Login Here</v-card-title
          >
          <v-card-item>
            <v-form @submit.prevent="submit">
              <v-text-field
                prepend-inner-icon="mdi-mail"
                v-model="form.email"
                label="Email"
                :rules="[rules.required, rules.counter]"
              >
              </v-text-field>
              <v-text-field
                type="password"
                prepend-inner-icon="mdi-key"
                variant="solo"
                v-model="form.password"
                label="Password"
                :rules="[rules.required, rules.counter]"
              >
              </v-text-field>
              <v-checkbox
                v-model="form.remember"
                color="red"
                label="Remember me"
                hide-details
              ></v-checkbox>
              <v-btn
                class="mt-2"
                type="submit"
                block
                color="red-darken-1"
                variant="elevated"
              >
                <span>Submit</span>
              </v-btn>
            </v-form>
          </v-card-item>
          <v-card-action>
            <div class="mx-4">
              <v-btn block to="/register">Register</v-btn>
            </div>
          </v-card-action>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped></style>
