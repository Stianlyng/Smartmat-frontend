import { defineStore } from 'pinia'
import { fetchUserGroups } from '../services/smartmatApi/GroupService.js'

//Stores the logged in user's group
export const useGroupStore = defineStore({
  id: 'GroupStore',
  state: () => ({
    groupId: null,
    groupAuth: null,
    groupName: null
  }),
  persist: {
    // Persists the users' group in the browser's session storage
    storage: sessionStorage
  },
  actions: {
    //Sets the user's group in session storage
    async setUserGroup(username) {
      try {
        const response = await fetchUserGroups(username)
        let primaryGroupIndex = 0
        for (let i = 0; i < response.length; i++) {
          if (response[i].primaryGroup) {
            primaryGroupIndex = i
            break
          }
        }

        this.groupId = response[primaryGroupIndex].group.groupId
        this.groupName = response[primaryGroupIndex].group.groupName
        this.groupAuth = response[primaryGroupIndex].groupAuthority
      } catch (error) {
        throw error
      }
    }
  },
  getters: {
    //Returns the user's group
    getGroupID() {
      return this.groupId
    },
    getGroupName() {
      return this.groupName
    },
    getGroupAuth() {
      return this.groupAuth
    },
    isRestricted() {
      return this.groupAuth == 'RESTRICTED'
    }
  }
})
