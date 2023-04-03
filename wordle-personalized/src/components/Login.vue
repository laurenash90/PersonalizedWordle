<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from "vue";
import { initializeApp } from '@firebase/app'
import { UserCredential, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { firebaseConfig } from '../myConfig'

const app = initializeApp(firebaseConfig)
const appNav = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref() // ERROR message

function submit() {
    appNav.push({ path: "/game" })

}

const signIn = () => {
    // need .value because ref()
    const auth = getAuth(); // from firebase/auth
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((data) => {
            //console.log("Succesfully signed in!");
            //console.log(auth.currentUser)
            appNav.push({ path: "/game" }) // redirect to game page
        })
        .catch((error) => {
            console.log(error.code);
            switch (error.code) {
                case "auth/invalid-email":
                    errorMessage.value = "Invalid email";
                    break;
                case "auth/wrong-password":
                    errorMessage.value = "Incorrect password";
                    break;
                case "auth/user-not-found":
                    errorMessage.value = "No account with that email was found";
                    break;
                default:
                    errorMessage.value = "Email or password was incorrect";
                    break;
            }
            alert(error.message);
        });
}

// Sign in with Google account
const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(getAuth(), provider)
        .then((result) => {
            console.log(result.user);
            appNav.push('/game');
        })
        .catch((error) => {
            console.error("Oops", error);
        });
}

</script>

<template>
    <h1>Login</h1>

    <div class="login">
        <div id="google">
            <button id="google" @click="signInWithGoogle">Sign In With Google</button>
        </div>

        <p>OR</p>

        <div id="email">
            <label for="Email">Email: <b></b></label>
            <input type="text" placeholder="Email" v-model="email">
        </div>

        <div id="password">
            <label id="password" for="Password">Password: <b></b></label>
            <input type="text" placeholder="Password" v-model="password">
        </div>

        <p v-if="errorMessage">{{ errorMessage }}</p>

        <br>

        <button id="submit" @click="signIn">Submit</button>

        <br><br>

        <RouterLink to="/signup"><button id="createaccount">Create an Account</button></RouterLink>
    </div>
</template>

<style scoped>
.login {
    display: grid;
    padding: 3%;
}

#email {
    padding: 1%;
}

#password {
    padding: 1%;
}
</style>