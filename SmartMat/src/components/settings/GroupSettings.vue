<script setup>
import '@/assets/css/settings/group-settings.css'
import { throwErrorPopup } from '@/utils/ErrorController'
import { useUserStore } from '@/stores/UserStore.js'
import { ref, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useGroupStore } from '@/stores/GroupStore'
import { showLoadingPopup, hideLoadingPopup } from '@/utils/LoadingController.js'
import {
  fetchGroupInfoByID,
  changeAuthority,
  fetchUserGroups,
  removeUser
} from '@/services/smartmatApi/GroupService'
import { useRouter } from 'vue-router'
import SetupGroup from '@/components/setup/SetupGroup.vue'
import InfoButton from '../InfoButton.vue'

const router = useRouter()

const groups = ref([]) // List of groups
const selectedGroup = ref(null) // Selected group
const selectedGroupName = ref('') // Name of selected group
const activeGroupId = useGroupStore().getGroupID // Active group ID, main group
const groupSetup = ref(false) // Is the user in group setup

// Selected group variables
const members = ref([]) // List of members in selected group
const groupCode = ref('') // Code of selected group
const isAdmin = ref(false) // Is the user admin of the selected group

onMounted(async () => {
  showLoadingPopup()
  const user = useUserStore().getUsername
  const groupsResponse = await fetchUserGroups()
  console.log(groupsResponse)
  for (let i = 0; i < groupsResponse.length; i++) {
    groups.value.push(groupsResponse[i])
  }
  hideLoadingPopup()
})

// Fetches group info and opens group
function openGroup(group) {
  selectedGroupName.value = group.groupName
  console.log(group.groupId)
  selectedGroup.value = group.groupId
  fetchMembers()
}

// Fetches members of selected group
async function fetchMembers() {
  showLoadingPopup()
  const membersResponse = await fetchGroupInfoByID(selectedGroup.value)
  console.log(membersResponse.data)
  groupCode.value = membersResponse.data.linkCode
  for (let i = 0; i < membersResponse.data.userAuthorityInfoList.length; i++) {
    if (
      membersResponse.data.userAuthorityInfoList[i].authority === 'ADMIN' &&
      membersResponse.data.userAuthorityInfoList[i].username === useUserStore().getUsername
    ) {
      isAdmin.value = true
      console.log('Admin')
    }

    members.value.push(membersResponse.data.userAuthorityInfoList[i])
  }
  hideLoadingPopup()
}

// Copy group code to clipboard
function copyCode() {
  const el = document.createElement('textarea')
  el.value = groupCode.value
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  throwErrorPopup('Gruppekode kopiert til utklippstavle')
}

// Update member role
async function updateMember(member) {
  showLoadingPopup()
  try {
    await changeAuthority(selectedGroup.value, member.username, member.authority)
    throwErrorPopup('Brukerens rolle er oppdatert')
  } catch (error) {
    throwErrorPopup('Kunne ikke oppdatere brukerens rolle')
    console.log(error)
  }
  console.log(member.authority)
  hideLoadingPopup()
}

// Redirect to home page
function newGroup() {
  router.push('/')
}

// Leave group
async function leaveGroup(groupId) {
  const userStore = useUserStore()

  if (!groupId) {
    throwErrorPopup('Gruppe-ID mangler')
    return
  }
  console.log('Main group: ' + activeGroupId)
  showLoadingPopup()

  try {
    console.log(selectedGroup.value)
    if (confirm('Er du sikker på at du vil forlate gruppen?')) {
      // Remove user from group
      const response = await removeUser(selectedGroup.value, userStore.getUsername)

      if (response.status === 200) {
        throwErrorPopup('Du har forlatt gruppen')
        // Reload group list
        await fetchUserGroups()
        // Navigate back to group overview
        router.push('/profile')
      } else {
        throwErrorPopup('Kunne ikke forlate gruppen')
      }
    }
  } catch (error) {
    console.log(error)
    throwErrorPopup('Kunne ikke forlate gruppen')
  }

  hideLoadingPopup()
}
</script>

<template>
  <div class="group-settings-container">
    <router-link to="/profile" class="back-button">
      <font-awesome-icon :icon="faArrowLeft" />
    </router-link>
    <div class="group-settings-title">
      <h1>Grupper</h1>
    </div>
    <div class="group-settings-actions">
      <button
        class="group-settings-button"
        v-if="selectedGroup === null && !groupSetup"
        @click="groupSetup = !groupSetup"
      >
        Opprett/bli med i en gruppe
      </button>
      <SetupGroup v-if="groupSetup" @nextStep="newGroup" />
    </div>
    <div class="group-settings-selector" v-if="selectedGroup === null && !groupSetup">
      <div
        class="group-button"
        v-for="group in groups"
        :key="group.group.groupId"
        :class="{ active: group.group.groupId === activeGroupId }"
        @click="openGroup(group.group)"
      >
        <div class="group-button-name">
          <h2>{{ group.group.groupName }}</h2>
        </div>
      </div>
    </div>
    <div class="group-overview" v-if="selectedGroup !== null && !groupSetup">
      <div class="group-overview-title">
        <h1>{{ selectedGroupName }}</h1>
        <InfoButton
          message="Her kan du se informasjon om gruppen, samt endre brukernes roller. Brukere med rollen administrator kan endre brukernes roller. Brukere med rollen begrenset kan ikke legge til produkter i handlelisten, eller kaste produkter fra kjøleskapet."
        />
      </div>
      <div class="group-overview-code">
        <h2>Gruppekode:</h2>
        <h2 class="group-code" @click="copyCode">
          {{ groupCode }}
        </h2>
      </div>
      <div class="group-overview-members">
        <div class="member" v-for="member in members" :key="member.username">
          <h2>{{ member.username }}</h2>
          <div
            class="member-role-edit"
            v-if="
              isAdmin &&
              member.username !== useUserStore().getUsername &&
              member.authority !== 'ADMIN'
            "
          >
            <select v-model="member.authority" @change="updateMember(member)">
              <option value="ADMIN">Administrator</option>
              <option value="MEMBER">Medlem</option>
              <option value="RESTRICTED">Begrenset</option>
            </select>
          </div>
          <div class="member-role" v-else>
            <h3 v-if="member.authority === 'ADMIN'">Administrator</h3>
            <h3 v-else-if="member.authority === 'RESTRICTED'">Begrenset</h3>
            <h3 v-else>Medlem</h3>
          </div>
        </div>
      </div>
    </div>
    <div class="leave-group-button">
      <button class="leave-group" v-if="!(selectedGroup === null)" @click="leaveGroup">
        Forlat gruppe
      </button>
    </div>
  </div>
</template>
