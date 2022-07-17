<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
<!--  <img alt="Vue logo" src="./assets/logo.png" />-->
<!--  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />-->
  <router-view />
</template>

<style>
  *{
    margin:0;
    padding:0;
  }

  input:-webkit-autofill {
    transition:background-color 5000s ease-in-out 0s;
    /* -webkit-text-fill-color:red; */
  }
  input:-internal-autofill-selected{
    transition:background-color 5000s ease-in-out 0s;
  }
</style>
