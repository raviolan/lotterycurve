/**
 * Calculate interpolated positions between control points
 * @param {number} persons - Total number of participants
 * @param {Object} values - Control point values
 * @returns {Array} Array of position objects with cost
 */
export function calculatePositions(persons, values) {
    const positions = []
    const controlPoints = getControlPoints(persons)

    for (let i = 0; i < controlPoints.length; i++) {
        const current = controlPoints[i]
        const next = controlPoints[i + 1]

        const currentVal = current === persons ? values.last : values[current]
        positions.push({ position: current, cost: Math.round(currentVal), name: '' })

        if (next) {
            const nextVal = next === persons ? values.last : values[next]
            // Linear interpolation between current and next
            for (let pos = current + 1; pos < next; pos++) {
                const t = (pos - current) / (next - current)
                const cost = Math.round(currentVal + (nextVal - currentVal) * t)
                positions.push({ position: pos, cost, name: '' })
            }
        }
    }

    return positions
}

/**
 * Get control points for the given number of persons
 * @param {number} persons - Total number of participants
 * @returns {Array} Array of control point positions
 */
export function getControlPoints(persons) {
    const points = [1, 2, 3, 5, 10, 20]
    return points.filter(p => p < persons).concat([persons])
}

/**
 * Get slider positions (control points excluding last)
 * @param {number} persons - Total number of participants
 * @returns {Array} Array of slider positions
 */
export function getSliderPositions(persons) {
    const points = [1, 2, 3, 5, 10, 20]
    return points.filter(p => p < persons)
}

/**
 * Apply sponsored bottles to positions by finding closest cost match
 * @param {Array} positions - Array of position objects
 * @param {Array} sponsoredBottles - Array of sponsored bottle objects
 * @returns {Array} Updated positions with sponsored bottles applied
 */
export function applySponsoredBottles(positions, sponsoredBottles) {
    const updatedPositions = [...positions]
    const costs = updatedPositions.map(p => p.cost)

    for (const bottle of sponsoredBottles) {
        if (!bottle.name || !bottle.price) continue

        // Find closest cost
        const closest = costs.reduce((prev, curr) =>
            Math.abs(curr - bottle.price) < Math.abs(prev - bottle.price) ? curr : prev
        )

        const index = updatedPositions.findIndex(p => p.cost === closest)
        if (index !== -1) {
            updatedPositions[index] = {
                ...updatedPositions[index],
                cost: bottle.price,
                name: bottle.name,
                sponsored: true
            }
            costs[index] = -1 // Mark as used
        }
    }

    return updatedPositions
}

/**
 * Calculate total cost from positions
 * @param {Array} positions - Array of position objects
 * @returns {number} Total cost
 */
export function calculateTotalCost(positions) {
    return positions.reduce((sum, p) => sum + p.cost, 0)
}

/**
 * Calculate total amount (income)
 * @param {number} stake - Stake per person
 * @param {number} persons - Number of persons
 * @param {number} sponsorship - Sponsorship amount
 * @returns {number} Total amount
 */
export function calculateAmount(stake, persons, sponsorship) {
    return stake * persons + sponsorship
}

/**
 * Redistribute values evenly between cheapest and most expensive
 * @param {Object} values - Current values object
 * @param {number} persons - Number of persons
 * @returns {Object} Updated values object
 */
export function redistributeValues(values, persons) {
    const cheapest = values[1]
    const mostExpensive = values.last
    const controlPoints = [1, 2, 3, 5, 10, 20].filter(p => p < persons)

    const newValues = { ...values }

    if (controlPoints.length > 1) {
        for (let i = 1; i < controlPoints.length; i++) {
            const pos = controlPoints[i]
            const ratio = i / controlPoints.length
            newValues[pos] = Math.round(cheapest + (mostExpensive - cheapest) * ratio)
        }
    }

    return newValues
}
