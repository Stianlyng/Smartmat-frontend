import { createAxiosClient } from '@/utils/AxiosSetup.js'
import { useUserStore } from '@/stores/UserStore.js'
import router from '../../router'

//Creates an axios instance with the given baseURL and headers
const apiClient = createAxiosClient('groups')

//Updates the progress expperience points for the given group
export async function updateProgress(groupId, exp) {
  try {
    const response = await apiClient.put('/' + groupId + '/newLevel/' + exp)

    return response
  } catch (error) {
    throw new Error('Kunne ikke oppdatere fremgang for gruppen: ' + groupId)
  }
}

//Fetches the groups for the user
export async function fetchUserGroups() {
  try {
    const response = await apiClient.get('/')

    console.log(response.data)

    if (response.data.length == 0) {
      router.push('/setup')
    }

    return response.data
  } catch (error) {
    router.push('/setup')
    throw new Error('Kunne ikke finne gruppene til brukeren.')
  }
}

//Creates a group by using the provided information
export async function createGroup(groupInfo) {
  try {
    const response = await apiClient.post('', groupInfo)

    //Success will return 200 OK and the group information
    return response
  } catch (error) {
    throw new Error('Kunne ikke opprette gruppen: ' + groupName)
  }
}

//Fetches the group with the given groupname
export async function fetchGroupInfoByName(groupName) {
  try {
    const response = await apiClient.get('/' + groupName)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne gruppen: ' + groupName)
  }
}

//Fetch group experience progress
export async function fetchGroupProgress(groupId) {
  try {
    const response = await apiClient.get('/' + groupId + '/progress')

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne fremgang for gruppen: ' + groupId)
  }
}

//Fetches the group level for the given groupId
export async function fetchGroupLevel(groupId) {
  try {
    const response = await apiClient.get('/' + groupId + '/level')

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne nivå for gruppen: ' + groupId)
  }
}

//Fetches the group with the given group ID
export async function fetchGroupInfoByID(groupId) {
  try {
    const response = await apiClient.get('/' + groupId)

    return response
  } catch (error) {
    throw new Error('Kunne ikke finne gruppen med ID: ' + groupId)
  }
}

//Creates a group with the logged in user
export async function createGroupWithUser(groupName) {
  try {
    const response = await apiClient.post('/group', {
      groupName: groupName,
      username: useUserStore().getUsername
    })

    return response
  } catch (error) {
    throw new Error('Kunne ikke opprette gruppe med navn: ' + groupName)
  }
}

//Adds a user to the group with the given group CODE
export async function addUserToGroup(groupCode) {
  try {
    const response = await apiClient.post('/connection', {
      username: useUserStore().getUsername,
      linkCode: groupCode
    })

    return response
  } catch (error) {
    throw new Error('Kunne ikke legge til bruker til gruppen med kode: ' + groupCode)
  }
}

export async function changePrimaryGroup(oldGroupId, newGroupId) {
  try {
    const response = await apiClient.put('/markNewPrimary/' + newGroupId)

    return response
  } catch (error) {
    throw new Error('Kunne ikke endre primærgruppe')
  }
}

// Changes the authority of a user in a group
export async function changeAuthority(groupId, username, authority) {
  try {
    const response = await apiClient.put('/groupAuthority', {
      groupId: groupId,
      username: username,
      authority: authority
    })

    return response
  } catch (error) {
    throw new Error('Kunne ikke endre autoritet')
  }
}

// Removes the user selected from the group, this should only be available to the admin of the group
export async function removeUser(groupId, username) {
  try {
    const response = await apiClient.delete('/removeUser/' + groupId + '/' + username, {
      headers: {
        Authorization: 'Bearer ' + useUserStore().getToken
      }
    })
    return response
  } catch (error) {
    throw new Error('Kunne ikke fjerne brukeren ' + username + ' fra gruppen ' + groupId)
  }
}
