<script setup lang="ts">
import { routerKey, useRouter } from 'vue-router'
import { ref } from "vue"
import { initializeApp } from "@firebase/app"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { firebaseConfig } from "../myConfig"

const app = initializeApp(firebaseConfig)
const appNav = useRouter();
const email = ref("");
const password = ref("");

// Create account with email and password
const register = () => {
    const auth = getAuth()
    // need .value because ref()
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((data) => {
            console.log("Succesfully created an account!");
            //console.log(auth.currentUser)
            appNav.push('/game') // redirect to game page
        })
        .catch((error) => {
            console.log(error.code);
            alert(error.message);
        });
};



</script>

<template>
    <h1>Create an Account</h1>

    <div class="signup">

        <div id="email">
            <label for="Email" style="padding: 1%">Email:</label>
            <input type="text" placeholder="Email" v-model="email" />
        </div>

        <div id="password">
            <label for="Password" style="padding: 1%">Password:</label>
            <input type="text" placeholder="Password" v-model="password">
        </div>

        <br>

        <button id="submit" @click="register">Submit</button>

        <br><br>

        <div id="login">
            <RouterLink to="/"><button id="login">Back to Login</button></RouterLink>
        </div>

    </div>
</template>

<style scoped>
.signup {
    display: grid;
    padding: 3%;

}

#email {
    padding: 1%;
}

#username {
    padding: 1%;
}

#password {
    padding: 1%;
}

#submit {
    margin: 5px;
}
</style>