<template>
<router-view v-slot="{ Component }">
    <component :is="Component" v-if="Component" />
    <div v-else>no component find! please check the path!</div>
</router-view>
</template>