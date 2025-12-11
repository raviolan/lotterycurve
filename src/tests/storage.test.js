import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveToLocalStorage, loadFromLocalStorage, clearStorage } from '../utils/storage'

describe('storage', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.clearAllMocks()
    })

    describe('saveToLocalStorage', () => {
        it('should save data with version', () => {
            const data = {
                persons: 29,
                sponsorship: 3000,
                values: { 1: 500 }
            }

            saveToLocalStorage(data)

            const saved = JSON.parse(localStorage.getItem('lotterycurve'))
            expect(saved.version).toBe(2)
            expect(saved.persons).toBe(29)
        })
    })

    describe('loadFromLocalStorage', () => {
        it('should load saved data', () => {
            const data = {
                version: 2,
                persons: 29,
                sponsorship: 3000
            }

            localStorage.setItem('lotterycurve', JSON.stringify(data))

            const loaded = loadFromLocalStorage()
            expect(loaded.persons).toBe(29)
            expect(loaded.sponsorship).toBe(3000)
        })

        it('should return null if no data', () => {
            expect(loadFromLocalStorage()).toBeNull()
        })

        it('should clear and return null for old version', () => {
            const oldData = {
                version: 1,
                persons: 29
            }

            localStorage.setItem('lotterycurve', JSON.stringify(oldData))

            const loaded = loadFromLocalStorage()
            expect(loaded).toBeNull()
            expect(localStorage.getItem('lotterycurve')).toBeNull()
        })
    })

    describe('clearStorage', () => {
        it('should remove data from localStorage', () => {
            localStorage.setItem('lotterycurve', 'test')

            clearStorage()

            expect(localStorage.getItem('lotterycurve')).toBeNull()
        })
    })
})
