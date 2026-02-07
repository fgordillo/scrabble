export default class WordService {
    // Dictionary in memory to avoid downloading the file on each validation
    private static dictionaries: Map<string, Set<string>> = new Map()

    public static async validateWord(
        word: string,
        language: string,
    ): Promise<boolean> {
        const cleanWord = word.trim().toLowerCase()
        const lang = language.toLowerCase()

        try {
            if (!this.dictionaries.has(lang)) {
                await this.loadDictionary(lang)
            }

            const dict = this.dictionaries.get(lang)

            return dict ? dict.has(cleanWord) : false
        } catch (error) {
            console.error(`Error loading ${lang} dictionary:`, error)
            return false
        }
    }

    private static async loadDictionary(lang: string): Promise<void> {
        // Look for the file in the public folder (e.g., public/words/en.txt)
        const url = `${import.meta.env.BASE_URL}words/${lang}.txt`
        const response = await fetch(url)

        if (!response.ok) throw new Error("File not found")

        const text = await response.text()

        // Convert the text into a Set for instant O(1) lookups
        // Assuming each word is on a new line
        const wordSet = new Set(
            text.split(/\r?\n/).map((w) => w.trim().toLowerCase()),
        )

        this.dictionaries.set(lang, wordSet)
    }
}
