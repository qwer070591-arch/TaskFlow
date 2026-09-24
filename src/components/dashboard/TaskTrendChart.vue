<script setup lang="ts">
import { computed } from 'vue'

import type { CompletionTrendPoint } from '../../types/dashboard'

const props = defineProps<{
  points: CompletionTrendPoint[]
}>()

const chartWidth = 640
const chartHeight = 220
const horizontalPadding = 40
const verticalPadding = 28

const chartPoints = computed(() => {
  const maximumCount = Math.max(...props.points.map((point) => point.count), 1)
  const usableWidth = chartWidth - horizontalPadding * 2
  const usableHeight = chartHeight - verticalPadding * 2 - 24

  return props.points.map((point, index) => ({
    ...point,
    x: horizontalPadding + (usableWidth / Math.max(props.points.length - 1, 1)) * index,
    y: verticalPadding + (maximumCount - point.count) * (usableHeight / maximumCount),
  }))
})

const polylinePoints = computed(() => chartPoints.value.map((point) => `${point.x},${point.y}`).join(' '))
const totalCompleted = computed(() => props.points.reduce((total, point) => total + point.count, 0))
const accessibleDescription = computed(
  () => `過去七日共完成 ${totalCompleted.value} 項任務；每日完成數可於圖表下方文字摘要取得。`,
)
</script>

<template>
  <section class="dashboard-panel task-trend" aria-labelledby="task-trend-title">
    <div class="dashboard-panel__heading">
      <div>
        <h2 id="task-trend-title">任務趨勢</h2>
        <p>最近七日完成的任務數量</p>
      </div>
      <span class="task-trend__total">{{ totalCompleted }} 項完成</span>
    </div>

    <figure class="task-trend__figure">
      <svg
        class="task-trend__chart"
        viewBox="0 0 640 220"
        role="img"
        aria-labelledby="task-trend-svg-title task-trend-svg-description"
      >
        <title id="task-trend-svg-title">最近七日完成任務趨勢圖</title>
        <desc id="task-trend-svg-description">{{ accessibleDescription }}</desc>
        <line
          v-for="line in [28, 78, 128, 178]"
          :key="line"
          x1="40"
          x2="600"
          :y1="line"
          :y2="line"
        />
        <polyline class="task-trend__line" :points="polylinePoints" />
        <g v-for="point in chartPoints" :key="point.date">
          <circle :cx="point.x" :cy="point.y" r="5" />
          <text :x="point.x" :y="point.y - 12" text-anchor="middle">{{ point.count }}</text>
          <text :x="point.x" y="210" text-anchor="middle">{{ point.label }}</text>
        </g>
      </svg>
      <figcaption>{{ accessibleDescription }}</figcaption>
    </figure>

    <ul class="visually-hidden">
      <li v-for="point in points" :key="point.date">{{ point.label }}完成 {{ point.count }} 項任務</li>
    </ul>
  </section>
</template>

<style scoped>
.dashboard-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  min-width: 0;
  padding: var(--space-6);
}

.dashboard-panel__heading {
  align-items: flex-start;
  display: flex;
  gap: var(--space-4);
  justify-content: space-between;
}

h2,
p {
  margin: 0;
}

h2 {
  color: var(--color-text);
  font-size: 1rem;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.dashboard-panel__heading p {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  line-height: 1.5;
  margin-top: var(--space-1);
}

.task-trend__total {
  background: var(--color-accent-soft);
  border-radius: 999px;
  color: var(--color-accent-strong);
  flex: 0 0 auto;
  font-size: 0.75rem;
  font-weight: 700;
  padding: var(--space-2) var(--space-3);
}

.task-trend__figure {
  margin: var(--space-6) 0 0;
}

.task-trend__chart {
  display: block;
  height: auto;
  overflow: visible;
  width: 100%;
}

.task-trend__chart line {
  stroke: var(--color-chart-grid);
  stroke-width: 1;
}

.task-trend__line {
  fill: none;
  stroke: var(--color-accent);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
}

.task-trend__chart circle {
  fill: var(--color-surface);
  stroke: var(--color-accent);
  stroke-width: 3;
}

.task-trend__chart text {
  fill: var(--color-text-muted);
  font-size: 13px;
  font-weight: 600;
}

.task-trend__chart text:nth-of-type(2n) {
  font-size: 12px;
  font-weight: 500;
}

figcaption {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  line-height: 1.5;
  margin-top: var(--space-3);
}

@media (max-width: 35rem) {
  .dashboard-panel {
    padding: var(--space-5);
  }

  .dashboard-panel__heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
