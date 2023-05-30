/**
 * @author
 * Nome: Yan Gabriel    
 * Discord: Balaclava#1912 (854886148455399436)    
 * GitHub: https://github.com/controlado
 */

/**
 * Função que realiza uma requisição utilizando o método fetch.
 * 
 * @async
 * @function
 * @param {string} method - O método HTTP a ser utilizado (por exemplo, "GET", "POST", "PUT", "DELETE").
 * @param {string} endpoint - A URL do endpoint da API.
 * @param {JSON} [options] - As opções da requisição.
 * @param {JSON} [options.headers] - Os cabeçalhos da requisição (opcional, padrão é um objeto vazio).
 * @param {JSON} [options.body] - O corpo da requisição (opcional, padrão é um objeto vazio).
 * @returns {Promise<Response>} Uma Promise que resolve com os dados da resposta da requisição.
 */
export async function request(method, endpoint, { headers = {}, body = {} } = {}) {
    const requestOptions = {
        method: method,
        headers: {
            ...headers,
            "accept": "application/json",
            "content-type": "application/json"
        }
    }

    if (method !== "GET" && method !== "HEAD") {
        requestOptions.body = JSON.stringify(body)
    }

    return await fetch(endpoint, requestOptions)
}

/**
 * Obtém as preferências do jogador.
 * 
 * @async
 * @function
 * @returns {Promise<JSON>} Uma Promise que resolve com os dados das preferências do jogador.
 */
export async function getPlayerPreferences() {
    const endpoint = "/lol-challenges/v1/summary-player-data/local-player"
    const response = await request("GET", endpoint)
    const responseData = await response.json()
    const playerPreferences = { challengeIds: [] }

    playerPreferences.challengeIds = responseData.topChallenges.map(badgeChallenge => badgeChallenge.id)
    if (responseData.title.itemId !== -1) { playerPreferences.title = `${responseData.title.itemId}` }
    if (responseData.bannerId) { playerPreferences.bannerAccent = responseData.bannerId }

    return playerPreferences
}

/**
 * Atualiza as preferências do jogador.
 * 
 * @async
 * @function
 * @param {JSON} playerPreferences - As preferências do jogador a serem atualizadas.
 * @returns {Promise<Response>} Uma Promise que resolve com os dados da resposta da requisição.
 */
export async function updatePlayerPreferences(playerPreferences) {
    const endpoint = "/lol-challenges/v1/update-player-preferences"
    return await request("POST", endpoint, { body: playerPreferences })
}
