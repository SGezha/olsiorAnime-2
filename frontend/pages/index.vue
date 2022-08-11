<script setup>
const router = useRouter()
const config = useRuntimeConfig()
const { find } = useStrapi4()
const { pending, data: animes } = useAsyncData('animes', () => find('animes', { populate: '*' }))
</script>

<template>
    <div class="mx-auto max-w-[1350px] w-100 p-[10px] relative flex flex-col gap-[20px] lg:py-[20px] lg:flex-row lg:justify-between items-center">
        <div class="form-control flex w-full lg:w-auto">
            <div class="input-group relative w-full lg:w-auto">
                <input type="text" placeholder="Поиск" class="input input-bordered w-full lg:w-[400px] lg:max-w-[400px]" />
                <button class="btn btn-square">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
            </div>
        </div>

        <div class="btn-group">
            <button class="btn btn-active lg:px-[40px]">Дате</button>
            <button class="btn lg:px-[40px]">Оценке</button>
            <button class="btn lg:px-[40px]">Сериям</button>
        </div>
    </div>
    <div v-if="!pending"
        class="grid w-100 p-[10px] gap-[15px] md:gap-[30px] xl:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 mx-auto max-w-[1350px]">
        <MyCard v-for="anime in animes.data" :key="anime.id" :card="anime.attributes" :id="anime.id" />
    </div>
</template>