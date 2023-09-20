<script setup>
import '@/assets/css/group/group-selector.css'
import { throwErrorPopup } from '@/utils/ErrorController'
import { ref, onMounted } from 'vue'
import { useGroupStore } from '@/stores/GroupStore'
import { useUserStore } from '@/stores/UserStore'
import { changePrimaryGroup, fetchUserGroups } from '@/services/smartmatApi/GroupService'

const groupName = useGroupStore().getGroupName
const selected = ref(0)

const groups = ref([])

//Fetch groups
onMounted(async () => {
  const user = useUserStore().getUsername
  console.log(user)
  const group = await fetchUserGroups()
  console.log(group)
  for (let i = 0; i < group.length; i++) {
    groups.value.push(group[i].group)
    if (group[i].primaryGroup) {
      selected.value = i
      console.log(selected.value)
    }
  }
})

//Change group
async function changeGroup(group) {
  console.log(group.groupId)
  const respone = await changePrimaryGroup(useGroupStore().getGroupID, group.groupId)

  console.log(respone)
  throwErrorPopup('Changed group to: ' + group.groupName)
  //Reload page
  location.reload()
}
</script>

<template>
  <div class="group-selector">
    <select v-model="selected" @change="changeGroup(groups[selected])">
      <option v-for="(group, index) in groups" :value="index">
        {{ group.groupName }}
      </option>
    </select>
  </div>
</template>
