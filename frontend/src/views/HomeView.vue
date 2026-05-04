<script setup lang="ts">
import { ref } from 'vue'

const healthStatus = ref<string | null>(null)
const healthError = ref<string | null>(null)
const loading = ref(false)

async function checkHealth() {
  loading.value = true
  healthError.value = null
  healthStatus.value = null
  try {
    const res = await fetch('/api/health')
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    const data = (await res.json()) as { status?: string }
    healthStatus.value = data.status ?? JSON.stringify(data)
  } catch (e) {
    healthError.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="home">
    <h1>高雄垃圾車即時系統</h1>
    <p class="subtitle">pun_so_tshia · Monorepo 初始骨架</p>
    <section class="panel">
      <h2>後端連線</h2>
      <p class="hint">開發時透過 Vite 將 <code>/api</code> 代理至 FastAPI（<code>127.0.0.1:8000</code>）。</p>
      <button type="button" :disabled="loading" @click="checkHealth">
        {{ loading ? '檢查中…' : '檢查 /api/health' }}
      </button>
      <p v-if="healthStatus" class="ok">狀態：{{ healthStatus }}</p>
      <p v-if="healthError" class="err">錯誤：{{ healthError }}</p>
    </section>
  </main>
</template>

<style scoped>
.home {
  max-width: 40rem;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h1 {
  font-size: 1.5rem;
  line-height: 1.3;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: var(--color-text);
  opacity: 0.75;
  margin-bottom: 2rem;
}

.panel {
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
}

.panel h2 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.hint {
  font-size: 0.9rem;
  margin-bottom: 1rem;
  opacity: 0.85;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: var(--color-background-mute);
  cursor: pointer;
  font: inherit;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ok {
  margin-top: 1rem;
  color: seagreen;
}

.err {
  margin-top: 1rem;
  color: crimson;
}
</style>
