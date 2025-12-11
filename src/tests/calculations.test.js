import { describe, it, expect } from 'vitest'
import {
    calculatePositions,
    getControlPoints,
    getSliderPositions,
    applySponsoredBottles,
    calculateTotalCost,
    calculateAmount,
    redistributeValues
} from '../utils/calculations'

describe('calculations', () => {
    describe('getControlPoints', () => {
        it('should return correct control points for 29 persons', () => {
            const points = getControlPoints(29)
            expect(points).toEqual([1, 2, 3, 5, 10, 20, 29])
        })

        it('should filter out points >= persons count', () => {
            const points = getControlPoints(7)
            expect(points).toEqual([1, 2, 3, 5, 7])
        })
    })

    describe('getSliderPositions', () => {
        it('should exclude last position', () => {
            const positions = getSliderPositions(29)
            expect(positions).toEqual([1, 2, 3, 5, 10, 20])
        })
    })

    describe('calculatePositions', () => {
        it('should calculate positions with interpolation', () => {
            const values = {
                1: 500,
                2: 400,
                3: 350,
                5: 250,
                10: 150,
                20: 100,
                last: 70
            }
            const positions = calculatePositions(10, values)

            expect(positions).toHaveLength(10)
            expect(positions[0]).toEqual({ position: 1, cost: 500, name: '' })
            expect(positions[9]).toEqual({ position: 10, cost: 150, name: '' })
        })

        it('should interpolate between control points', () => {
            const values = {
                1: 100,
                2: 200,
                last: 200
            }
            const positions = calculatePositions(3, values)

            expect(positions[0].cost).toBe(100)
            expect(positions[1].cost).toBe(200)
            expect(positions[2].cost).toBe(200)
        })
    })

    describe('applySponsoredBottles', () => {
        it('should replace closest cost with sponsored bottle', () => {
            const positions = [
                { position: 1, cost: 500, name: '' },
                { position: 2, cost: 400, name: '' },
                { position: 3, cost: 300, name: '' }
            ]
            const sponsored = [{ name: 'Premium Wine', price: 410 }]

            const result = applySponsoredBottles(positions, sponsored)

            expect(result[1]).toEqual({
                position: 2,
                cost: 410,
                name: 'Premium Wine',
                sponsored: true
            })
        })

        it('should skip bottles without name or price', () => {
            const positions = [
                { position: 1, cost: 500, name: '' }
            ]
            const sponsored = [
                { name: '', price: 500 },
                { name: 'Wine', price: 0 }
            ]

            const result = applySponsoredBottles(positions, sponsored)

            expect(result[0].sponsored).toBeUndefined()
        })
    })

    describe('calculateTotalCost', () => {
        it('should sum all position costs', () => {
            const positions = [
                { cost: 100 },
                { cost: 200 },
                { cost: 300 }
            ]

            expect(calculateTotalCost(positions)).toBe(600)
        })
    })

    describe('calculateAmount', () => {
        it('should calculate total amount correctly', () => {
            expect(calculateAmount(100, 29, 3000)).toBe(5900)
        })
    })

    describe('redistributeValues', () => {
        it('should redistribute intermediate values evenly', () => {
            const values = {
                1: 500,
                2: 400,
                3: 300,
                5: 200,
                last: 100
            }

            const result = redistributeValues(values, 29)

            expect(result[1]).toBe(500)
            expect(result.last).toBe(100)
            expect(result[2]).toBeGreaterThan(100)
            expect(result[2]).toBeLessThan(500)
        })
    })
})
