<script setup lang="ts">
import {useStore} from "vuex"

const store = useStore();
//
store.dispatch('initWebsiteData')
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
