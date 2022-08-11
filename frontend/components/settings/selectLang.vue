 <template>
    <div class="hidden">{{$i18n.locale}}</div>
    <form>
        <select id="locale-select" @change="updateLanguage" class="select select-sm" ref="lang" v-model="$i18n.locale">
            <option value="ru">🇷🇺</option>
            <option value="uk">🇺🇦</option>
            <option value="en">🇺🇸</option>
        </select>
    </form>
</template>

<script setup>
const updateLanguage = (event) => {
    const selectedLang = document.querySelector('#locale-select').value
    const lang = useCookie('lang')
    lang.value = selectedLang
}
</script>