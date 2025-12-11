const STORAGE_KEY = 'lotterycurve'
const STORAGE_VERSION = 2

/**
 * Save data to localStorage
 * @param {Object} data - Data to save
 */
export function saveToLocalStorage(data) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                version: STORAGE_VERSION,
                ...data
            })
        )
    } catch (error) {
        console.error('Failed to save to localStorage:', error)
    }
}

/**
 * Load data from localStorage
 * @returns {Object|null} Loaded data or null if not found/invalid
 */
export function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (!saved) return null

        const data = JSON.parse(saved)

        // Clear old data if version doesn't match
        if (data.version !== STORAGE_VERSION) {
            clearStorage()
            return null
        }

        return data
    } catch (error) {
        console.error('Failed to load from localStorage:', error)
        return null
    }
}

/**
 * Clear localStorage
 */
export function clearStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
        console.error('Failed to clear localStorage:', error)
    }
}
