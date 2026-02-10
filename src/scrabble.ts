import { useStorage } from "@vueuse/core"
import type { User, Game, GamePlayer, Turn } from "./types"

function getNextId(items: { id: number }[]) {
    return items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1
}

export const useScrabble = () => {
    const users = useStorage<User[]>("users", [])
    const games = useStorage<Game[]>("games", [])

    function addUser(name: string) {
        const newUser: User = {
            id: getNextId(users.value),
            name,
        }
        users.value.push(newUser)
        return newUser
    }

    function editUser(user: User) {
        const index = users.value.findIndex((u: User) => u.id === user.id)
        if (index !== -1) {
            users.value[index]!.name = user.name
        }
    }

    function deleteUser(userId: User["id"]) {
        users.value = users.value.filter((u: User) => u.id !== userId)
        // Also remove from gamePlayers
        games.value.forEach((game: Game) => {
            game.players = game.players.filter(
                (gp: GamePlayer) => gp.userId !== userId,
            )
            game.turns = game.turns.filter((t: Turn) => {
                const player = game.players.find(
                    (gp: GamePlayer) => gp.id === t.playerId,
                )
                return player ? player.userId !== userId : true
            })
        })
    }

    function createGame() {
        const newGame: Game = {
            id: getNextId(games.value),
            players: [],
            turns: [],
            status: "waiting",
            winnerId: null,
            currentTurnPlayerId: null,
        }
        games.value.push(newGame)
        return newGame
    }

    function getGame(gameId: Game["id"]) {
        const game = games.value.find((g: Game) => g.id === gameId)
        if (!game) {
            console.error(`Game with id ${gameId} not found`)
            return
        }
        return game
    }

    function deleteGame(gameId: Game["id"]) {
        games.value = games.value.filter((g: Game) => g.id !== gameId)
    }

    function addPlayer(gameId: Game["id"], userId: User["id"]) {
        const game = getGame(gameId)
        if (!game) return
        if (game.status !== "waiting") {
            console.error(
                "Cannot add players to a game that has already started",
            )
            return
        }
        if (game.players.some((gp: GamePlayer) => gp.userId === userId)) {
            console.error("Player is already in the game")
            return
        }
        const newPlayer: GamePlayer = {
            id: getNextId(game.players),
            userId,
            score: 0,
            order: 0,
        }
        game.players.push(newPlayer)
        return newPlayer
    }

    function deletePlayer(gameId: Game["id"], playerId: GamePlayer["id"]) {
        const game = getGame(gameId)
        if (!game) return
        if (game.status !== "waiting") {
            console.error(
                "Cannot remove players from a game that has already started",
            )
            return
        }
        game.players = game.players.filter(
            (gp: GamePlayer) => gp.id !== playerId,
        )
    }

    function randomizePlayerOrder(gameId: Game["id"]) {
        const game = getGame(gameId)
        if (!game) return
        game.players = [...game.players].sort(() => Math.random() - 0.5)
        game.players.forEach((gp: GamePlayer, index: number) => {
            gp.order = index + 1
        })
    }

    function startGame(gameId: Game["id"]) {
        const game = getGame(gameId)
        if (!game) return
        if (game.status !== "waiting") {
            console.error("Game has already started")
            return
        }
        if (game.players.length < 2) {
            console.error("At least 2 players are required to start the game")
            return
        }
        randomizePlayerOrder(gameId)
        game.status = "playing"
        game.currentTurnPlayerId = game.players[0]!.id
        game.startTime = new Date().toISOString()
        return game
    }

    interface PlayerScore {
        playerId: GamePlayer["id"]
        totalScore: number
    }

    function endGame(gameId: Game["id"]) {
        const game = getGame(gameId)
        if (!game) return
        game.status = "finished"
        game.endTime = new Date().toISOString()
        // Determine winner based on scores
        const playerScores: PlayerScore[] = game.players.map(
            (gp: GamePlayer) => {
                const playerTurns = game.turns.filter(
                    (t: Turn) => t.playerId === gp.id,
                )
                const totalScore = playerTurns.reduce(
                    (sum: number, t: Turn) => sum + t.score,
                    0,
                )
                return { playerId: gp.id, totalScore }
            },
        )
        const winner = playerScores.reduce(
            (max, ps) => (ps.totalScore > max.totalScore ? ps : max),
            { playerId: 0, totalScore: 0 },
        )
        game.winnerId = winner.playerId
        return game
    }

    function recordTurn(
        gameId: Game["id"],
        { playerId, word, score, comment }: Omit<Turn, "id">,
    ) {
        const game = getGame(gameId)
        if (!game) return
        const newTurn: Turn = {
            id: getNextId(game.turns),
            playerId,
            word,
            score,
            comment,
            timestamp: new Date().toISOString(),
        }
        game.turns.push(newTurn)
        const player = game.players.find((gp: GamePlayer) => gp.id === playerId)
        if (player) {
            player.score += score
        }
        // Update current turn player
        const currentPlayerIndex = game.players.findIndex(
            (gp: GamePlayer) => gp.id === playerId,
        )
        const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length
        game.currentTurnPlayerId = game.players[nextPlayerIndex]!.id
    }

    return {
        users,
        games,
        // Actions
        addPlayer,
        addUser,
        createGame,
        deleteGame,
        deletePlayer,
        deleteUser,
        editUser,
        endGame,
        recordTurn,
        startGame,
    }
}
