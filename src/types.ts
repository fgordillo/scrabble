export interface User {
    id: number
    name: string
}

export interface GamePlayer {
    id: number
    userId: User["id"]
    score: number
    order: number
}

export interface Game {
    id: number
    players: GamePlayer[]
    turns: Turn[]
    status: "waiting" | "playing" | "finished"
    winnerId: GamePlayer["id"] | null
    currentTurnPlayerId: GamePlayer["id"] | null
}

export interface Turn {
    id: number
    playerId: GamePlayer["id"]
    word?: string
    score: number
    comment?: string // Bingo, etc.
}
