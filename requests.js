import { request } from "../_controladoUtils";

/**
 * @author balaclava
 * @name profile-utils
 * @link https://github.com/controlado/profile-utils
 * @description Utilities for your profile! 🐧
 */

/**
 * Representa as preferências do jogador.
 *
 * @typedef {Object} PlayerPreferences
 * @property {number[]} challengeIds - Os IDs dos emblemas do perfil.
 * @property {string} [title] - O título do perfil.
 * @property {string} [bannerAccent] - O banner do perfil.
 */

/**
 * Obtém as preferências do jogador.
 *
 * @async
 * @function
 * @returns {Promise<PlayerPreferences>} Uma Promise que resolve com os dados das preferências do jogador.
 */
export async function getPlayerPreferences() {
  const response = await request("GET", "/lol-challenges/v1/summary-player-data/local-player");
  const responseData = await response.json();
  const playerPreferences = { challengeIds: [] };

  playerPreferences.challengeIds = responseData.topChallenges.map(badgeChallenge => badgeChallenge.id);
  if (responseData.title.itemId !== -1) { playerPreferences.title = `${responseData.title.itemId}`; }
  if (responseData.bannerId) { playerPreferences.bannerAccent = responseData.bannerId; }

  return playerPreferences;
}

/**
 * Atualiza as preferências do jogador.
 *
 * @async
 * @function
 * @param {PlayerPreferences} playerPreferences - As preferências do jogador a serem atualizadas.
 * @returns {Promise<Response>} Uma Promise que resolve com os dados da resposta da requisição.
 */
export async function updatePlayerPreferences(playerPreferences) {
  const endpoint = "/lol-challenges/v1/update-player-preferences";
  return await request("POST", endpoint, { body: playerPreferences });
}
