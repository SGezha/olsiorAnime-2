<script setup lang="ts">
const router = useRouter()
const { find } = useStrapi4()
const { pending, data: animes } = useAsyncData('animes', () => find('animes', { populate: '*' }))
</script>

<template>
    <div v-if="!pending" class="grid w-100 p-[10px] py-[20px] gap-[15px] md:gap-[30px] xl:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 mx-auto max-w-[1350px]">
        <MyCard v-for="anime in animes.data" :key="anime.id" :card="anime.attributes" :id="anime.id" />
    </div>
</template>