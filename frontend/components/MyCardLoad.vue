<template>
    <div class="w-100 relative will-change-transform transition-transform hover:scale-[102%]">
        <div class="card rounded-md">
            <div class="w-100 h-[30vh] lg:h-[360px] bg-base-100 flex justify-center items-center">
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
        </div>
        <div class="mt-[5px] primary-content">
            <h2 class="font-bold whitespace-nowrap text-ellipsis block overflow-hidden"></h2>
            <h3 class="text-[12px] whitespace-nowrap text-ellipsis block overflow-hidden"></h3>
        </div>
    </div>
</template>

<style>
@keyframes showCard {
    from {
        opacity: 0;
        transform: scale(0.96);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes ldio-dx2dx45048j {
    0% {
        transform: translate(12px, 80px) scale(0);
    }

    25% {
        transform: translate(12px, 80px) scale(0);
    }

    50% {
        transform: translate(12px, 80px) scale(1);
    }

    75% {
        transform: translate(80px, 80px) scale(1);
    }

    100% {
        transform: translate(148px, 80px) scale(1);
    }
}

@keyframes ldio-dx2dx45048j-r {
    0% {
        transform: translate(148px, 80px) scale(1);
    }

    100% {
        transform: translate(148px, 80px) scale(0);
    }
}

@keyframes ldio-dx2dx45048j-c {
    0% {
        background: #912623
    }

    25% {
        background: #7394a4
    }

    50% {
        background: #a2b4bc
    }

    75% {
        background: #f0f5f6
    }

    100% {
        background: #912623
    }
}

.ldio-dx2dx45048j div {
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transform: translate(80px, 80px) scale(1);
    background: #912623;
    animation: ldio-dx2dx45048j 1s infinite cubic-bezier(0, 0.5, 0.5, 1);
}

.ldio-dx2dx45048j div:nth-child(1) {
    background: #f0f5f6;
    transform: translate(148px, 80px) scale(1);
    animation: ldio-dx2dx45048j-r 0.25s infinite cubic-bezier(0, 0.5, 0.5, 1), ldio-dx2dx45048j-c 1s infinite step-start;
}

.ldio-dx2dx45048j div:nth-child(2) {
    animation-delay: -0.25s;
    background: hsla(var(--p) / 1);
}

.ldio-dx2dx45048j div:nth-child(3) {
    animation-delay: -0.5s;
    background: hsla(var(--s) / 1);
}

.ldio-dx2dx45048j div:nth-child(4) {
    animation-delay: -0.75s;
    background: hsla(var(--er) / 1);
}

.ldio-dx2dx45048j div:nth-child(5) {
    animation-delay: -1s;
    background: hsla(var(--in) / 1);
}

.loadingio-spinner-ellipsis-osxz8ybcqkd {
    width: 200px;
    height: 200px;
    display: inline-block;
    overflow: hidden;
}

.ldio-dx2dx45048j {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(1);
    backface-visibility: hidden;
    transform-origin: 0 0;
}

.ldio-dx2dx45048j div {
    box-sizing: content-box;
}
</style>