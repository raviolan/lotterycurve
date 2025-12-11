import Chart from 'chart.js/auto'

/**
 * Initialize Chart.js instance
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Array} labels - Chart labels
 * @param {Array} chartData - Main line data
 * @param {Array} controlPointsData - Control points data
 * @param {Function} onDragStart - Callback for drag start
 * @returns {Chart} Chart instance
 */
export function createChart(canvas, labels, chartData, controlPointsData, callbacks = {}) {
    const ctx = canvas.getContext('2d')

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Kurva',
                    data: chartData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    fill: true
                },
                {
                    label: 'Kontrollpunkter',
                    data: controlPointsData,
                    borderColor: 'transparent',
                    backgroundColor: '#2563eb',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    showLine: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: context => {
                            if (context[0].datasetIndex === 1) {
                                return `Placering: ${context[0].label}`
                            }
                            return context[0].label
                        },
                        label: context => {
                            if (context.datasetIndex === 1) {
                                return `Pris: ${context.parsed.y} kr`
                            }
                            return `${context.parsed.y} kr`
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Placering'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Pris (kr)'
                    },
                    min: 0,
                    max: 700
                }
            },
            onHover: (event, activeElements) => {
                if (event.native && event.native.target) {
                    const hasControlPoint = activeElements.some(el => el.datasetIndex === 1)
                    event.native.target.style.cursor = hasControlPoint ? 'ns-resize' : 'default'
                }
            }
        }
    })
}

/**
 * Update chart data
 * @param {Chart} chart - Chart instance
 * @param {Array} labels - New labels
 * @param {Array} chartData - New chart data
 * @param {Array} controlPointsData - New control points data
 */
export function updateChartData(chart, labels, chartData, controlPointsData) {
    if (!chart || !chart.data || !chart.data.datasets || !chart.data.datasets[0]) {
        throw new Error('Chart is in invalid state')
    }

    chart.data.labels = labels
    chart.data.datasets[0].data = chartData
    if (chart.data.datasets[1]) {
        chart.data.datasets[1].data = controlPointsData
    }
    chart.update('none')
}

/**
 * Setup chart drag handlers
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Chart} chart - Chart instance
 * @param {Function} onDragStart - Called when drag starts
 * @param {Function} onDrag - Called during drag
 * @param {Function} onDragEnd - Called when drag ends
 */
export function setupChartDragHandlers(canvas, chart, onDragStart, onDrag, onDragEnd) {
    const startDrag = event => {
        const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true)
        if (points.length > 0 && points[0].datasetIndex === 1) {
            onDragStart(points[0].index)
            event.preventDefault()
        }
    }

    const handleDrag = event => {
        onDrag(event, canvas, chart)
    }

    const stopDrag = () => {
        onDragEnd()
    }

    canvas.addEventListener('mousedown', startDrag)
    canvas.addEventListener('mousemove', handleDrag)
    canvas.addEventListener('mouseup', stopDrag)
    canvas.addEventListener('mouseleave', stopDrag)

    return () => {
        canvas.removeEventListener('mousedown', startDrag)
        canvas.removeEventListener('mousemove', handleDrag)
        canvas.removeEventListener('mouseup', stopDrag)
        canvas.removeEventListener('mouseleave', stopDrag)
    }
}
