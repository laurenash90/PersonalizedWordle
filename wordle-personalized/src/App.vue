<script setup lang="ts">
import HelloWordle from './components/HelloWordle.vue'
import { User, getAuth, onAuthStateChanged, signInWithCredential, signOut, updateCurrentUser } from 'firebase/auth'
import { firebaseConfig } from './myConfig'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const appNav = useRouter()
let auth = getAuth();
let isLoggedIn = ref()


auth.onAuthStateChanged(user => {
  if (user) {
    console.log("User logged in: ", user)
    isLoggedIn.value = true
  }
  else {
    console.log("User logged out.")
    isLoggedIn.value = false
  }
})

const handleLogOut = () => {
  signOut(auth).then(() => {
    //isLoggedIn.value = false
    appNav.push('/')
  })
}
</script>

<template>
  <h1>Welcome to Wordle</h1>
  <RouterLink to="/">
    <button id="logout" v-if="isLoggedIn" @click="handleLogOut">Logout</button>
  </RouterLink>
  <br>
  <br>
  <RouterView></RouterView>
</template>


<style scoped></style>
