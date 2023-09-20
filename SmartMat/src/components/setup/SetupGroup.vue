<script setup>
import { ref } from 'vue'
import { throwErrorPopup } from '@/utils/ErrorController'
import { addUserToGroup, createGroupWithUser } from '@/services/smartmatApi/GroupService.js'
import { useGroupStore } from '@/stores/GroupStore'
import { useUserStore } from '@/stores/UserStore'

const emit = defineEmits(['nextStep'])
const selection = ref(null)
const groupCode = ref(null)
const groupName = ref(null)

//Emits nextStep event
function nextStep() {
  emit('nextStep')
}

//Joins a group with the user as member
async function joinGroup() {
  if (groupCode.value === null) {
    throwErrorPopup('Du må skrive inn en kode')
    return
  } else if (groupCode.value.length !== 6) {
    throwErrorPopup('Koden må være 6 tegn lang')
    return
  }
  try {
    await addUserToGroup(groupCode.value)
    await useGroupStore().setUserGroup(useUserStore().getUsername)
  } catch (error) {
    throwErrorPopup(error)
    return
  }

  throwErrorPopup('Blir med i gruppe med kode ' + groupCode.value)
  nextStep()
}

//Creates a group with the user as admin
async function createGroup() {
  if (groupName.value === null) {
    throwErrorPopup('Du må skrive inn et navn')
    return
  } else if (groupName.value.length < 3) {
    throwErrorPopup('Navnet må være minst 3 tegn langt')
    return
  }

  try {
    await createGroupWithUser(groupName.value)
    await useGroupStore().setUserGroup(useUserStore().getUsername)
  } catch (error) {
    throwErrorPopup(error)
    return
  }

  throwErrorPopup('Oppretter gruppe med navn ' + groupName.value)
  nextStep()
}
</script>

<template>
  <h1 v-if="selection === null">Ønsker du å være med i et kjøleskap, eller opprette ditt eget?</h1>
  <h1 v-if="selection === 'join'">Skriv inn kjøleskapskoden</h1>
  <h1 v-if="selection === 'create'">Hva skal kjøleskapet hete?</h1>
  <div v-if="selection === null">
    <p>På SmartMat kan du være med i et kjøleskap med andre, eller opprette ditt eget kjøleskap.</p>
    <p>
      I et kjøleskap kan du dele produkter, oppskrifter og handlelister med andre. Dere vil også
      måle hvor mye mat dere kaster, og få tips til hvordan dere kan redusere matsvinnet.
    </p>
  </div>
  <div v-if="selection === 'join'">
    <input type="text" placeholder="Kjøleskapskode" v-model="groupCode" />
    <button class="button button--primary" @click="joinGroup">Bli med</button>
  </div>
  <div v-if="selection === 'create'" class="column">
    <input
      type="text"
      placeholder="Kjøleskapsnavn"
      v-model="groupName"
      style="margin-bottom: 1rem"
    />
    <button class="button button--primary" @click="createGroup">Lag kjøleskap</button>
  </div>
  <div class="button-row" v-if="selection === null">
    <button class="button button--primary" @click="selection = 'join'">Bli med</button>
    <button class="button button--secondary" @click="selection = 'create'">Opprett nytt</button>
  </div>
  <div class="button-row" v-if="selection !== null">
    <p class="button-secondary" @click="selection = null">Tilbake</p>
  </div>
</template>
