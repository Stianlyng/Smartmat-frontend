import { createAxiosClient } from '@/utils/AxiosSetup.js'

//Creates an axios instance with the given baseURL and headers
const apiClient = createAxiosClient('achievements')

//Fetches all achievements
export async function fetchAllAchievements() {
  try {
    const response = await apiClient.get('/all')

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne alle oppnåelser')
  }
}

//Fetches the achievement with the given achievement name
export async function fetchAchievementByName(achievementName) {
  try {
    const response = await apiClient.get('/achievement/' + achievementName)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne oppnåelsen: ' + achievementName)
  }
}
