<template>
  <div class="bg-base-200 main-bg">
    <NuxtLoadingIndicator />
    <MyNavbar />
    <NuxtPage />
  </div>
</template>

<style>
.main-bg {
  background: linear-gradient(to bottom, hsla(var(--b1) / 0.5) 0%,  hsla(var(--p) / 0.15) 100%);
}

*::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

*::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}

*::-webkit-scrollbar-thumb {
  background: #e1e1e1;
  border: 0px none #ffffff;
  border-radius: 50px;
}

*::-webkit-scrollbar-thumb:hover {
  background: #ffffff;
}

*::-webkit-scrollbar-thumb:active {
  background: hlsa(var(--p) / 0.15);
}

*::-webkit-scrollbar-track {
  background: #666666;
  border: 0px none #ffffff;
  border-radius: 50px;
}

*::-webkit-scrollbar-track:hover {
  background: #666666;
}

*::-webkit-scrollbar-track:active {
  background: #333333;
}

*::-webkit-scrollbar-corner {
  background: transparent;
}

</style>