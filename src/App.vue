<template>
  <div class="container">
    <h1>Lotterycurve anno 2026</h1>

    <div class="chart-container">
      <div class="budget-display" :class="diffClass">
        <div class="amount">Intäkt: {{ amount }} kr</div>
        <div class="amount">Kostnad: {{ totalCost }} kr</div>
        <div class="diff">{{ formattedDiff }}</div>
      </div>
      <canvas ref="chartCanvas"></canvas>
    </div>

    <div class="controls">
      <div class="control-group">
        <label>Antal personer</label>
        <input v-model.number="persons" type="number" min="5">
      </div>
      <div class="control-group">
        <label>Insats från VX (kr)</label>
        <input v-model.number="sponsorship" type="number">
      </div>
      <div class="control-group">
        <label>Dyraste flaska (kr)</label>
        <input v-model.number="values[1]" type="number">
      </div>
      <div class="control-group">
        <label>Billigaste flaska (kr)</label>
        <input v-model.number="values.last" type="number">
      </div>
      <div class="control-group">
        <button class="add-button" style="margin-top: 24px;" @click="handleRedistribute">
          Fördela kostnad
        </button>
      </div>
      <div class="control-group">
        <button
          style="margin-top: 24px; background: #dc2626; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;"
          @click="handleClearStorage"
        >
          Återställ allt
        </button>
      </div>
    </div>

    <div class="sponsored-section">
      <h3>Sponsrade flaskor</h3>
      <div v-for="(bottle, index) in sponsoredBottles" :key="index" class="sponsored-item">
        <input v-model="bottle.name" type="text" placeholder="Namn">
        <input v-model.number="bottle.price" type="number" placeholder="Pris (kr)">
        <button @click="removeBottle(index)">Ta bort</button>
      </div>
      <button class="add-button" @click="addBottle">+ Lägg till flaska</button>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Placering</th>
            <th>Namn</th>
            <th>Pris (kr)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="position in positions"
            :key="position.position"
            :class="{ 'sponsored-row': position.sponsored }"
          >
            <td>{{ position.position }}</td>
            <td>{{ position.name || '-' }}</td>
            <td>{{ position.cost }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import {
  calculatePositions,
  applySponsoredBottles,
  calculateTotalCost,
  calculateAmount,
  redistributeValues,
  getSliderPositions
} from './utils/calculations'
import { saveToLocalStorage, loadFromLocalStorage, clearStorage } from './utils/storage'
import { createChart, updateChartData, setupChartDragHandlers } from './utils/chart'

export default {
  name: 'App',
  setup() {
    // Reactive state
    const persons = ref(29)
    const stake = ref(100)
    const sponsorship = ref(3000)
    const values = ref({
      1: 500,
      2: 400,
      3: 350,
      5: 250,
      10: 150,
      20: 100,
      last: 70
    })
    const sponsoredBottles = ref([])
    let chart = null // Not a ref - avoid Vue reactivity on Chart.js internals
    const chartCanvas = ref(null)
    const draggingPoint = ref(null)
    const updateTrigger = ref(0)
    const isDragging = ref(false)
    let cleanupDragHandlers = null

    // Computed properties
    const sliderPositions = computed(() => getSliderPositions(persons.value))

    const amount = computed(() => calculateAmount(stake.value, persons.value, sponsorship.value))

    const positions = computed(() => {
      updateTrigger.value // Force reactivity
      const basePositions = calculatePositions(persons.value, values.value)
      return applySponsoredBottles(basePositions, sponsoredBottles.value)
    })

    const totalCost = computed(() => calculateTotalCost(positions.value))

    const diff = computed(() => amount.value - totalCost.value)

    const formattedDiff = computed(() => (diff.value > 0 ? '+' : '') + diff.value + ' kr')

    const diffClass = computed(() => (diff.value >= 0 ? 'positive' : 'negative'))

    // Methods
    const saveData = () => {
      saveToLocalStorage({
        persons: persons.value,
        sponsorship: sponsorship.value,
        values: values.value,
        sponsoredBottles: sponsoredBottles.value
      })
    }

    const loadData = () => {
      const data = loadFromLocalStorage()
      if (data) {
        persons.value = data.persons || persons.value
        sponsorship.value = data.sponsorship || sponsorship.value
        values.value = { ...values.value, ...data.values }
        sponsoredBottles.value = data.sponsoredBottles || []
      }
    }

    const handleClearStorage = () => {
      if (confirm('Rensa all sparad data och återställ till standardvärden?')) {
        clearStorage()
        location.reload()
      }
    }

    const handleRedistribute = () => {
      values.value = redistributeValues(values.value, persons.value)
      updateTrigger.value++
      nextTick(() => {
        updateChart()
        saveData()
      })
    }

    const addBottle = () => {
      sponsoredBottles.value.push({ name: '', price: 0 })
      saveData()
    }

    const removeBottle = index => {
      sponsoredBottles.value.splice(index, 1)
      saveData()
    }

    const getChartData = () => {
      const chartData = []
      const controlPointsData = []
      
      for (let i = 1; i <= persons.value; i++) {
        const pos = positions.value.find(p => p.position === i)
        chartData.push(pos ? pos.cost : null)

        const isControlPoint = sliderPositions.value.includes(i)
        controlPointsData.push(isControlPoint && pos ? pos.cost : null)
      }

      return { chartData, controlPointsData }
    }

    const updateChart = () => {
      if (!chart || !chartCanvas.value) return

      const labels = Array.from({ length: persons.value }, (_, i) => (i + 1).toString())
      const { chartData, controlPointsData } = getChartData()

      try {
        updateChartData(chart, labels, chartData, controlPointsData)
      } catch (e) {
        // Chart corrupted, recreate
        try {
          chart.destroy()
        } catch (err) {
          // Ignore
        }
        initChart()
      }
    }

    const initChart = () => {
      if (!chartCanvas.value) return

      const labels = Array.from({ length: persons.value }, (_, i) => (i + 1).toString())
      const { chartData, controlPointsData } = getChartData()

      chart = createChart(chartCanvas.value, labels, chartData, controlPointsData)

      // Setup drag handlers
      cleanupDragHandlers = setupChartDragHandlers(
        chartCanvas.value,
        chart,
        pointIndex => {
          // pointIndex is the chart data array index (0-based)
          // Convert to actual position number (1-based)
          const position = pointIndex + 1
          // Check if this position is actually a control point
          if (sliderPositions.value.includes(position)) {
            draggingPoint.value = position
            isDragging.value = true
          }
        },
        (event, canvas, chartInstance) => {
          if (!draggingPoint.value) return

          const rect = canvas.getBoundingClientRect()
          const y = event.clientY - rect.top
          const yAxis = chartInstance.scales.y

          // Convert pixel Y to data value
          const value = yAxis.getValueForPixel(y)
          const clampedValue = Math.max(0, Math.min(700, Math.round(value)))

          values.value[draggingPoint.value] = clampedValue
          
          // Direct update without full recalc - just update the dragged point
          const chartDataIndex = draggingPoint.value - 1
          if (chart?.data?.datasets) {
            if (chart.data.datasets[0]?.data) {
              chart.data.datasets[0].data[chartDataIndex] = clampedValue
            }
            if (chart.data.datasets[1]?.data) {
              chart.data.datasets[1].data[chartDataIndex] = clampedValue
            }
            chart.update('active')
          }
        },
        () => {
          if (draggingPoint.value) {
            isDragging.value = false
            draggingPoint.value = null
            // Full recalc after drag to update interpolated curve
            updateTrigger.value++
            nextTick(() => {
              updateChart()
              saveData()
            })
          }
        }
      )
    }

    // Watchers
    watch(sponsorship, saveData)
    watch(
      sponsoredBottles,
      () => {
        updateTrigger.value++
        nextTick(() => {
          updateChart()
          saveData()
        })
      },
      { deep: true }
    )

    watch([persons, values], () => {
      if (isDragging.value) return // Skip during drag
      updateTrigger.value++
      nextTick(() => {
        updateChart()
        saveData()
      })
    }, { deep: true })

    // Lifecycle
    onMounted(() => {
      loadData()
      nextTick(() => {
        initChart()
      })
    })

    onUnmounted(() => {
      if (cleanupDragHandlers) {
        cleanupDragHandlers()
      }
      if (chart) {
        chart.destroy()
      }
    })

    return {
      persons,
      sponsorship,
      values,
      sponsoredBottles,
      chartCanvas,
      amount,
      positions,
      totalCost,
      diff,
      formattedDiff,
      diffClass,
      handleRedistribute,
      handleClearStorage,
      addBottle,
      removeBottle
    }
  }
}
</script>
