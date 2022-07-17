<script lang="ts" setup>
import { onMounted,watch ,computed,unref} from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"

//
const store = useStore();
const router = useRouter();
//
const website = computed(() => store.getters.website);
//
watch(website,(v) => {
    if(v.home){
        router.push(v.home);
    }
},{deep:true})
</script>

<template>
<div></div>
</template>
