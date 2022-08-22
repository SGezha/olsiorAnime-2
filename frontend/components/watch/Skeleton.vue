<template>
    <div class="">
        <div class="max-w-[1350px] mx-auto px-[10px] pb-[50px] md:py-[20px] min-h-screen">
            <div class="flex flex-col pt-[30px] gap-[30px] md:gap-[50px] md:flex-row">
                <div class="w-full md:w-[300px] md:min-w-[300px]">
                    <div class="block mb-[20px] loadText md:hidden">
                        <div class="font-bold text-2xl">
                            Hi there
                        </div>
                        <div class="font-regular opacity-70 md:text-xl">
                            If you're reading this, know I love you.
                        </div>
                    </div>
                    <div
                        class="rounded-md w-full shadow-lg bg-base-100 max-h-[300px] md:max-h-max min-h-[400px] flex justify-center items-center">
                        <div class="loadingio-spinner-ellipsis-osxz8ybcqkd">
                            <div class="ldio-dx2dx45048j">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="px-[12px] py-[16px] mt-[20px] w-full text-sm bg-neutral shadow-lg rounded-md flex flex-col gap-[5px]">
                        <div class="text-neutral-content">
                            <span class="opacity-60">{{ $t('status') }}: </span>
                            <span class="font-bold loadText">Viewed</span>
                        </div>
                        <div class="text-neutral-content">
                            <span class="opacity-60">{{ $t('epwached') }}: </span>
                            <span class="font-bold loadText">Suck</span>
                        </div>
                        <div class="text-neutral-content">
                            <span class="opacity-60">{{ $t('watcheddate') }}: </span>
                            <span class="font-bold loadText">11.11.2001</span>
                        </div>
                        <div class="text-neutral-content">
                            <span class="opacity-60">{{ $t('genres') }}: </span>
                            <span class="font-bold loadText">Dick</span>
                        </div>
                    </div>
                </div>

                <div class="relative w-full">
                    <div class="hidden loadText md:block">
                        <div class="font-bold text-2xl">
                            Hi there
                        </div>
                        <div class="font-regular opacity-70 text-xl">
                            If you're reading this, know I love you.
                        </div>
                    </div>

                    <div class="mt-[10px] transition">
                        <div class="outline-none relative">
                            <div
                                class="relative bg-black rounded-md shadow overflow-hidden h-[50vh] w-full flex items-center">
                            </div>
                        </div>
                    </div>

                    <div class="mt-[30px]">
                        <div class="font-bold text-2xl">{{ $t('online') }}</div>
                        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mt-[10px] w-full gap-[10px]">
                            <button v-for="(ep, ind) in 6" class="btn shadow-lg"
                                :class="{ 'text-white bg-primary': ind == 0 }">
                                <div
                                    class="overflow-hidden text-left text-ellipsis whitespace-nowrap text-sm text-shadow loadText">
                                    {{ ind + 1 }}-{{ ind + 2 }} episode
                                </div>
                            </button>
                        </div>
                    </div>

                    <div class="mt-[30px]">
                        <div class="font-bold text-2xl">{{ $t('desc') }}</div>
                        <div class="mt-[15px] loadText">
                            Definitely, the stream is not for those who are under 30. Here you need to think out the
                            idea of the streamer and just think, and not go with the flow of the broadcast. You can
                            immediately say that the stream is heavy, rather a drama. I sit and think what impression
                            the streamer left .... but for sure, it hooked me. And that already means something. This
                            broadcast leaves an aftertaste. Absolutely not sorry for the time. Thinking stream for
                            well-read people. I recommend!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.loadText {
    font-family: 'Minecraft';
}
</style>