<script setup lang="ts">
import { Ref, ref } from "vue";
import { getAuth } from "@firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  QuerySnapshot,
  QueryDocumentSnapshot,
  query,
  orderBy,
  where,
  DocumentReference,
  getDoc,
  Firestore,
} from "@firebase/firestore";
import { createReturnStatement } from "@vue/compiler-core";

const auth = getAuth();
const user = auth.currentUser;
const userEmail = auth.currentUser?.email;
const db = getFirestore();

// Array that stores docs pulled from Firestore
const arrayDocs: Ref<Document[]> = ref([])

// Type for document
type Document = {
  date_time: string;
  win_lose: string;
  secret_word: string;
  guessed_words: [];
  play_time: string;
}

// Collection reference
const userStats = collection(db, userEmail);

//  WILL RENDER ALL DOCS IN NO APPARENT ORDER
getDocs(userStats)
  .then((qs: QuerySnapshot) => {
    qs.forEach((myGames: QueryDocumentSnapshot) => {
      const gameData = myGames.data() as Document
      console.log(gameData)

      // Push document to array
      arrayDocs.value.push(gameData)

      console.log(arrayDocs)
    })
  })


//Query Functions
// Most recent date first
function queryDateTime() {
  arrayDocs.value.sort((a: Document, b: Document) => {
    return new Date(b.date_time).getTime() - new Date(a.date_time).getTime()
  })
}
// Shortest playtime first
function queryPlayTime() {
  arrayDocs.value.sort((a: Document, b: Document) => {
    const timeA = parseInt(a.play_time.split(":")[0]) * 60 + parseInt(a.play_time.split(":")[1])
    const timeB = parseInt(b.play_time.split(":")[0]) * 60 + parseInt(b.play_time.split(":")[1])
    return timeA - timeB
  })
}
// Less guesses first
function queryGuessedWords() {
  arrayDocs.value.sort((a: Document, b: Document) => {
    const wordsA = a.guessed_words.length
    const wordsB = b.guessed_words.length
    return wordsA - wordsB
  })
}

</script>

<template>
  <h1>Game Stats</h1>

  <RouterLink to="/game" id="backtogame">Back to game</RouterLink>

  <br />

  <div class="gamestats">
    <div id="top">
      <div id="title">Game history for {{ userEmail }}</div>

      <div id="sortby">
        <label>Sort by: </label>
        <button id="datetime" @click="queryDateTime">Date/Time</button>
        <button id="playtime" @click="queryPlayTime">Play Time</button>
        <button id="guessedwords" @click="queryGuessedWords">Guessed Words</button>
      </div>
    </div>

    <table id="statsTable" style="width: 100%">
      <thead id="tablehead">
        <tr>
          <th id="th1">Date/Time</th>
          <th id="th2">Win/Lose</th>
          <th id="th3">Secret Word</th>
          <th id="th4">Guessed Words</th>
          <th id="th5">Play Time</th>
        </tr>
      </thead>
      <tbody id="tablebody">
        <tr v-for="d in arrayDocs">
          <td>{{ d.date_time }}</td>
          <td>{{ d.win_lose }}</td>
          <td>{{ d.secret_word }}</td>
          <td>{{ d.guessed_words }}</td>
          <td>{{ d.play_time }}</td>
        </tr>

      </tbody>
    </table>
  </div>
</template>

<style scoped>
#backtogame {
  float: right;
}

#top {
  display: list-item;
}

#title {
  float: left;
  font-size: x-large;
  font-weight: bold;
}

#sortby {
  float: right;
  margin: 5px;
}

#datetime {
  margin: 2px;
}

#playtime {
  margin: 2px;
}

#guessedwords {
  margin: 2px;
}

#statsTable {
  border: 2px solid black;
  border-collapse: collapse;
  table-layout: fixed;
}

#tablehead {
  background-color: cadetblue;
  border: 2px solid black;
  padding: 10%;
  text-align: left;
}

#th1 {
  width: 20%;
}

#th2 {
  width: 12%;
}

#th3 {
  width: 15%;
}

#th4 {
  width: 30%;
}

#th5 {
  width: 10%;
}

#tablebody {
  border: 2px solid black;
  padding: 2%;
  word-wrap: break-word;
  text-align: left;
}

#bodyrow {
  border-bottom: 2px solid black;
}
</style>
