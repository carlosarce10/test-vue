<template>
  <v-app class="app">
    <header class="header">
      <span class="header__brand">Media Planet</span>
    </header>

    <v-main class="app__main">
      <div class="app__container">
        <div class="tabs">
          <button
            class="tabs__item"
            :class="{ 'tabs__item--active': tab === 'consulta' }"
            @click="tab = 'consulta'"
          >
            Consulta
          </button>
          <button
            class="tabs__item"
            :class="{ 'tabs__item--active': tab === 'alta' }"
            @click="tab = 'alta'"
          >
            Alta
          </button>
        </div>

        <div class="panel">
          <Consulta v-if="tab === 'consulta'" />
          <Alta v-else />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import Consulta from './components/Consulta.vue'
import Alta from './components/Alta.vue'

const tab = ref('consulta')
</script>
