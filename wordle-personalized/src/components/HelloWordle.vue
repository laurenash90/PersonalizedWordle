<script setup lang="ts">
import { ref, Ref, defineComponent } from "vue"
import { useStopwatch } from 'vue-timer-hook'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { addDoc, getFirestore, collection } from '@firebase/firestore'
import { stringLength } from '@firebase/util';

const appNav = useRouter();
let auth = getAuth();
const db = getFirestore();
let user = ref(auth.currentUser);
const userEmail = auth.currentUser?.email;
let isLoggedIn = ref();

// Date/Time
const currentDate = new Date();
const date = (currentDate.getMonth() + 1) + "-" + currentDate.getDate() + "-" + currentDate.getFullYear();
const time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
const timestamp = date + " " + time;

// Timer
const autoStart = false;
const stopwatch = useStopwatch(0, autoStart);


/* - - GAMEPLAY - - */
const gameName = ref("Wordle Clone")
const number = 30;
const userWords: Ref<string[]> = ref([]);
let guessedWords: Ref<string[]> = ref([]);

const wordList: string[] = ["hello", "beach", "split", "mango", "first", "years", "sound", "house", "below", "story", "young", "night", "earth"];
let secretWord = wordList[Math.floor(Math.random() * wordList.length)];
let userInput: string;
let letter: string;
let counter = 0;
let disableButton = false;
let isGreen = false;
let isYellow = false;
let isGrey = false;
let boxID: number;


// New Game method
function newGame() {
  // Toggles off colors to reset board
  for (let i = 1; i < 31; i++) {
    let letterBlock = document.getElementById(i.toString());
    letterBlock?.classList.toggle('green', false);
    letterBlock?.classList.toggle('yellow', false);
    letterBlock?.classList.toggle('grey', false);
  }
  userWords.value.splice(0);
  guessedWords.value.splice(0);
  disableButton = false;
  stopwatch.reset();
  counter = 0;
  secretWord = wordList[Math.floor(Math.random() * wordList.length)];
}
// Secret word button method
function viewSecretWord() {
  alert(secretWord);
}
// Checks guess
function check() {
  console.log(userInput);
  console.log(userWords);
  guessedWords.value.push(userInput);
  // Loops though userInput
  for (let i = 0; i < 5; i++) {
    letter = userInput[i];
    userWords.value.push(letter);
    console.log(letter);
    // Green - perfect match
    if (secretWord.charAt(i) == letter) {
      console.log("green");

      boxID = userWords.value.length;
      console.log(boxID);

      let letterBlock = document.getElementById(boxID.toString());
      letterBlock?.classList.toggle('green', true);

    }
    // Yellow - 'includes' match
    else if (secretWord.includes(letter, undefined)) {
      console.log("yellow");

      boxID = userWords.value.length;
      console.log(boxID);

      let letterBlock = document.getElementById(boxID.toString());
      letterBlock?.classList.toggle("yellow", true);
    }
    // Gray - not a match
    else {
      console.log("grey");

      boxID = userWords.value.length;
      console.log(boxID);

      let letterBlock = document.getElementById(boxID.toString());
      letterBlock?.classList.toggle("grey", true);
    }
  }
  // Checks to see if user guessed secret work, alert message
  if (secretWord == userInput) {
    stopwatch.pause();
    disableButton = true;
    alert("CONGRATULATIONS! You solved the Wordle!");

    // Game Over (won game) - Add to Collection
    const playTime = stopwatch.minutes.value + ":" + stopwatch.seconds.value;
    const myCollection = collection(db, userEmail)
    addDoc(myCollection, { secret_word: secretWord , guessed_words: guessedWords.value, win_lose: "W", date_time: timestamp, play_time: playTime })
  }
  // Increments the counter, clears input, calls isDisabled() to check if button should be disabled
  counter++;
  userInput = "";
  isDisabled();
}
// Disables 'Check' button after 6th guess
function isDisabled() {
  if (counter == 6) {
    stopwatch.pause();
    disableButton = true;
    
    // Game Over (lost game) - Add to Collection
    const playTime = stopwatch.minutes.value + ":" + stopwatch.seconds.value;
    const myCollection = collection(db, userEmail)
    addDoc(myCollection, { secret_word: secretWord, guessed_words: guessedWords.value, win_lose: "L", date_time: timestamp, play_time: playTime })
  }
}

function checkCounter() {
  if(counter != 0) {
    
  }
  else {
    stopwatch.start();
  }
}

auth.onAuthStateChanged(user => {
  if (user) {
    console.log("User logged in: ", user)
    isLoggedIn.value = true
  }
  else {
    console.log ("User logged out.")
    isLoggedIn.value = false
  }
})

const handleLogOut = () => {
  signOut(auth).then(() => {
    //isLoggedIn.value = false
    appNav.push('/')
  })
}

// Game Timer


</script>



<template>
  <div class="Container">
    <RouterLink to="/stats"><button id="gamestats" v-if="isLoggedIn">My Game Stats</button></RouterLink>
      
  <button id="buttonNewGame" @click="newGame">New Game</button>
  <div class="Timer">
    <span>Timer: </span><span id="numbers"><span>{{ stopwatch.minutes }}</span>:<span>{{ stopwatch.seconds }}</span></span>
  </div>
</div>

  <div class="GameGrid">
    <div class="GridBlock" :class="{ 'green': isGreen, 'yellow': isYellow, 'grey': isGrey }" v-for="n in number" :key="n"
      :id="`${n}`">{{ userWords[n - 1] }}</div>
  </div>

  <br>

  <span><label for="NextWord">Next word: <b></b></label></span>
  <span><input type="text" maxlength="5" v-model="userInput" @click="checkCounter"></span>
  <span><button id="buttonCheck" :disabled="disableButton" @click="check">Check</button></span>

  <br>

  

  <br>
  <button id="buttonRevealSecretWord" @click="viewSecretWord">Reveal Secret Word</button>
</template>

<style scoped>
.Container {
  display:list-item;
}

#gamestats {
  margin: 3%;
  float: center;
}

#buttonNewGame {
  margin: 3%;
  margin-left: 0;
  float: left;
}

.Timer {
  margin: 3%;
  font-size: x-large;
  float: right;
}
#numbers {
  font-weight: bold;
}
.GameGrid {
  display: grid;
  align-content: center;
  height: 700px;
  width: 600px;
  padding: 3% 3%;
  box-sizing: border-box;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(6, 1fr);
  grid-column-gap: 5px;
  grid-row-gap: 5px;
  background-color: #f5f5f5;
  grid-template-areas: "Row1 Row1 Row1 Row1 Row1"
    "Row2 Row2 Row2 Row2 Row2"
    "Row3 Row3 Row3 Row3 Row3"
    "Row4 Row4 Row4 Row4 Row4"
    "Row5 Row5 Row5 Row5 Row5";


}

.GridBlock {
  display: flex;
  justify-content: center;
  align-content: center;
  border-style: solid;
  border-color: black;
  text-transform: uppercase;
  font-size: 7vw;
  font-weight: bolder;
  padding: 5% 0;

}

#buttonRevealSecretWord {
  margin: 1%;
}

#buttonCheck {
  margin: 1%;
}

.green {
  background-color: #32cd32;
  display: flex;
  justify-content: center;
  align-content: center;
  border-style: solid;
  border-color: black;
  text-transform: uppercase;
  font-size: 7vw;
  font-weight: bolder;
  padding: 5% 0;

}

.yellow {
  background-color: #eefc5e;
  display: flex;
  justify-content: center;
  align-content: center;
  border-style: solid;
  border-color: black;
  text-transform: uppercase;
  font-size: 7vw;
  font-weight: bolder;
  padding: 5% 0;
}

.grey {
  background-color: #bfbfbf;
  display: flex;
  justify-content: center;
  align-content: center;
  border-style: solid;
  border-color: black;
  text-transform: uppercase;
  font-size: 7vw;
  font-weight: bolder;
  padding: 5% 0;
}
</style>
