<template>
  <div class="flex w-full sm:w-2/3 md:w-2/3 lg:w-2/4 xl:w-1/5 h-screen items-center justify-center flex-col items-center">
    <div class="card bg-gray-800 w-full p-4 rounded shadow">
      <h2 class="text-white text-2xl">Welcome to</h2>
      <h1 class="text-white text-4xl font-bold leading-none">Cards Against Humanity</h1>
      <div class="border-b border-gray-700 mt-3 w-full"></div>
      <div class="flex flex-col justify-center" v-if="step === 'landing'">
        <button @click="step = 'new'" class="btn btn-primary mt-5 text-xl">
          Create New Game
        </button>
        <button @click="joinGame" class="btn btn-primary mt-5 text-xl">
          Join Game
        </button>
      </div>


      <div v-else-if="step === 'new'" class="flex w-full flex-col items-center ">
        <input v-model="username" type="text" class="mt-5 w-full"
               placeholder="Enter Your username...">
        <input v-model="password" type="text" class="mt-5 w-full"
               placeholder="Enter Your password...">
        <div class="flex mt-1 w-full justify-end">
          <a @click="step = 'packs'" class="font-bold text-indigo-500 cursor-pointer">Customize Packs</a>
        </div>
        <div class="flex w-full -mx-2 justify-center flex-col items-center">
          <div class="flex w-full my-2">
            <span class="text-white text-base text-red-600 font-bold"> {{errorMessage}}</span>
          </div>
          <div class="flex px-2">
            <button @click="createGame" class="btn btn-primary mx-2">
              Create
            </button>
            <button @click="step = 'landing'" class="btn btn-secondary mx-2">
              Back
            </button>
          </div>

        </div>
      </div>
      <div v-else-if="'packs'" class="flex flex-col packs items-center">
        <ul style="height: 30vh" class="overflow-scroll mt-2 mb-4 w-full">
          <li v-for="(card,index) in customCards">
            <div class="flex w-full">
              <input :class="{'bg-black':card.black,'text-white':card.black}" v-model="card.text" type="text"
                     class="mt-3 w-full px-2" placeholder="Enter your card text...">
              <button @click="card.black = !card.black" class="bg-white text-white p-2 rounded mt-3 ml-2 px-3">
                <img style="width:3rem;height:auto" src="/icon.png" alt="">
              </button>
              <button @click="customCards.splice(index,1)" class="bg-red-600 text-white p-2 rounded mt-3 ml-2 px-4">
                <svg class="w-5 h-5 fill-current" viewBox="-40 0 427 427.00131" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/>
                  <path
                    d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/>
                  <path
                    d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"/>
                  <path
                    d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"/>
                </svg>
              </button>
            </div>
            <span class="text-white" v-if="card.black">Use _ to create a blank</span>
          </li>
          <li class="mt-2">
            <a class="cursor-pointer text-indigo-400 font-bold" @click="customCards.push({text:'',black: false})">Add
              Custom Card</a>
          </li>
          <li v-for="(pack,index) in sortedPacks" class="my-1">
            <label class="custom-label flex">
              <div class="bg-white shadow w-6 h-6 p-1 flex justify-center items-center mr-2 rounded">
                <input v-model="pack.checked" type="checkbox" class="hidden" checked>
                <svg class="hidden w-5 h-5 text-indigo-600 pointer-events-none" viewBox="0 0 172 172">
                  <g fill="none" stroke-width="none" stroke-miterlimit="10" font-family="none" font-weight="none"
                     font-size="none" text-anchor="none" style="mix-blend-mode:normal">
                    <path d="M0 172V0h172v172z"/>
                    <path d="M145.433 37.933L64.5 118.8658 33.7337 88.0996l-10.134 10.1341L64.5 139.1341l91.067-91.067z"
                          fill="currentColor" stroke-width="10"/>
                  </g>
                </svg>
              </div>
              <span class="select-none text-white"> {{pack.name}}</span>
            </label>
          </li>
        </ul>
        <button @click="step = 'new'" class="btn btn-primary">Save</button>
      </div>

    </div>
    <div class="flex w-full mt-4 px-4 flex-col items-center">
      <img class="w-1/6 rounded-full" src="/telegram.jpg" alt="">
      <span class="text-white text-center mt-2">
           <a target="_blank" href="https://t.me/cards_against_humanity" class="text-indigo-400 font-bold text-center">Click Here</a>
  Join our telegram group to find players and share feedback
    </span>
    </div>

  </div>
</template>

<script lang="ts">
    import Vue from 'vue'

    import {Component} from 'vue-property-decorator'
    import {AxiosInstance} from 'axios';
    import axios from "axios";

    interface Pack {
        key: string;
        name: string;
        official: boolean;
        order: number;
        checked: boolean;
    }

    @Component
    export default class MainView extends Vue {
        username: string = "";
        code: string = "";
        step: string = "landing";
        password: string = "";
        errorMessage: string | null = null;
        customCards: object[] = [];

        mounted(): void {

        }

        packs: Pack[] = [
            {
                key: 'got',
                name: '[C] Game of Thrones (no spoilers)',
                official: false,
                order: 50,
                checked: false
            },
            {
                key: 'c-northernlion',
                name: '[C] Northernlion',
                official: false,
                order: 61,
                checked: false
            },
            {
                key: 'c-imgur',
                name: '[C] Imgur',
                official: false,
                order: 55,
                checked: false
            },
            {
                key: 'greenbox',
                name: 'Green Box Expansion',
                official: true,
                order: 7,
                checked: false
            },
            {
                key: 'c-admin',
                name: "[C] Admin's Picks",
                official: false,
                order: 39,
                checked: false
            },
            {
                key: 'c-fim',
                name: '[C] FiMFiction.net',
                official: false,
                order: 47,
                checked: false
            },
            {
                key: 'c-ladies',
                name: '[C] Ladies Against Humanity',
                official: false,
                order: 54,
                checked: false
            },
            {
                key: 'c-mrman',
                name: '[C] Mr. Man Collection',
                official: false,
                order: 57,
                checked: false
            },
            {
                key: 'c-anime',
                name: '[C] Anime',
                official: false,
                order: 40,
                checked: false
            },
            {
                key: 'weed',
                name: 'Weed Pack',
                official: true,
                order: 12,
                checked: false
            },
            {
                key: 'c-ragingpsyfag',
                name: "[C] RagingPsyfag's Pack of Shenanigans",
                official: false,
                order: 62,
                checked: false
            },
            {
                key: 'period',
                name: 'Period Pack',
                official: true,
                order: 24,
                checked: false
            },
            {
                key: 'hack',
                name: '[C] Hackers Against Humanity',
                official: false,
                order: 52,
                checked: false
            },
            {
                key: 'trumpbag',
                name: 'Trump Survival Pack',
                official: true,
                order: 17,
                checked: false
            },
            {
                key: 'hillary',
                name: 'Vote for Hillary Pack',
                official: true,
                order: 15,
                checked: false
            },
            {
                key: 'paxp2013',
                name: 'PAX Prime 2013',
                official: true,
                order: 21,
                checked: false
            },
            {
                key: 'c-vidya',
                name: '[C] Vidya',
                official: false,
                order: 70,
                checked: false
            },
            {
                key: 'fantasy',
                name: 'Fantasy Pack',
                official: true,
                order: 10,
                checked: false
            },
            {
                key: 'base',
                name: 'Base Set',
                official: true,
                order: 0,
                checked: true
            },
            {
                key: 'science',
                name: 'Science Pack',
                official: true,
                order: 13,
                checked: false
            },
            {
                key: 'apples',
                name: '[$] Apples to Apples&reg; Party Pack',
                official: false,
                order: 35,
                checked: false
            },
            {
                key: 'crabs',
                name: '[$] Crabs Adjust Humidity',
                official: false,
                order: 36,
                checked: false
            },
            {
                key: 'nsfh',
                name: '[C] Not Safe For Humanity',
                official: false,
                order: 60,
                checked: false
            },
            {
                key: 'c-rt',
                name: '[C] Rooster Teeth',
                official: false,
                order: 64,
                checked: false
            },
            {
                key: 'c-nobilis',
                name: '[C] Nobilis Reed',
                official: false,
                order: 59,
                checked: false
            },
            {
                key: 'c-gamegrumps',
                name: '[C] Game Grumps',
                official: false,
                order: 48,
                checked: false
            },
            {
                key: 'canadian',
                name: 'Canadian',
                official: true,
                order: 30,
                checked: false
            },
            {
                key: 'paxe2014',
                name: 'PAX East 2014',
                official: true,
                order: 22,
                checked: false
            },
            {
                key: 'xmas2012',
                name: '2012 Holiday Pack',
                official: true,
                order: 18,
                checked: false
            },
            {
                key: 'reject',
                name: 'Reject Pack',
                official: true,
                order: 28,
                checked: false
            },
            {
                key: 'paxe2013',
                name: 'PAX East 2013',
                official: true,
                order: 20,
                checked: false
            },
            {
                key: 'c-khaos',
                name: '[C] Khaos WolfKat',
                official: false,
                order: 56,
                checked: false
            },
            {
                key: 'c-neindy',
                name: '[C] NEIndy',
                official: false,
                order: 58,
                checked: false
            },
            {
                key: 'c-tg',
                name: '[C] /tg/',
                official: false,
                order: 38,
                checked: false
            },
            {
                key: 'c-antisocial',
                name: '[C] Antisocial Injustice',
                official: false,
                order: 41,
                checked: false
            },
            {
                key: 'cahe3',
                name: 'The Third Expansion',
                official: true,
                order: 3,
                checked: false
            },
            {
                key: 'cahe2',
                name: 'The Second Expansion',
                official: true,
                order: 2,
                checked: false
            },
            {
                key: 'cahe1',
                name: 'The First Expansion',
                official: true,
                order: 1,
                checked: false
            },
            {
                key: 'food',
                name: 'Food Pack',
                official: true,
                order: 11,
                checked: false
            },
            {
                key: 'cahe6',
                name: 'The Sixth Expansion',
                official: true,
                order: 6,
                checked: false
            },
            {
                key: 'cahe5',
                name: 'The Fifth Expansion',
                official: true,
                order: 5,
                checked: false
            },
            {
                key: 'cahe4',
                name: 'The Fourth Expansion',
                official: true,
                order: 4,
                checked: false
            },
            {
                key: 'c-guywglasses',
                name: '[C] That Guy With The Glasses',
                official: false,
                order: 68,
                checked: false
            },
            {
                key: 'hocah',
                name: 'House of Cards Against Humanity',
                official: true,
                order: 27,
                checked: false
            },
            {
                key: 'paxpp2014',
                name: 'PAX Prime 2014 Panel Pack',
                official: true,
                order: 25,
                checked: false
            },
            {
                key: 'c-derps',
                name: '[C] Derps Against Humanity',
                official: false,
                order: 44,
                checked: false
            },
            {
                key: 'matrimony',
                name: '[$] Cads About Matrimony',
                official: false,
                order: 37,
                checked: false
            },
            {
                key: 'www',
                name: 'World Wide Web Pack',
                official: true,
                order: 14,
                checked: false
            },
            {
                key: 'cahgrognards',
                name: '[C] Grognards Against Humanity (RPG fandom pack)',
                official: false,
                order: 51,
                checked: false
            },
            {
                key: 'c-golby',
                name: '[C] Golby Fan Club',
                official: false,
                order: 49,
                checked: false
            },
            {
                key: 'c-eurovision',
                name: '[C] Eurovision Song Contest',
                official: false,
                order: 46,
                checked: false
            },
            {
                key: 'trumpvote',
                name: 'Vote for Trump Pack',
                official: true,
                order: 16,
                checked: false
            },
            {
                key: 'image1',
                name: '[C] Joey Image 1',
                official: false,
                order: 53,
                checked: false
            },
            {
                key: 'xmas2013',
                name: '2013 Holiday Pack',
                official: true,
                order: 19,
                checked: false
            },
            {
                key: '90s',
                name: '90s Nostalgia Pack',
                official: true,
                order: 8,
                checked: false
            },
            {
                key: 'box',
                name: 'Box Expansion',
                official: true,
                order: 9,
                checked: false
            },
            {
                key: 'c-xkcd',
                name: '[C] xkcd',
                official: false,
                order: 71,
                checked: false
            },
            {
                key: 'misprint',
                name: 'Misprint Replacement Bonus Cards',
                official: true,
                order: 31,
                checked: false
            },
            {
                key: 'c-doctorwho',
                name: '[C] Doctor Who',
                official: false,
                order: 45,
                checked: false
            },
            {
                key: 'reject2',
                name: 'Reject Pack 2',
                official: true,
                order: 29,
                checked: false
            },
            {
                key: 'c-vewysewious',
                name: '[C] Very Serious',
                official: false,
                order: 69,
                checked: false
            },
            {
                key: 'c-rpanons',
                name: '[C] RPAnons',
                official: false,
                order: 65,
                checked: false
            },
            {
                key: 'c-prtg',
                name: '[C] PRTG',
                official: false,
                order: 34,
                checked: false
            },
            {
                key: 'pax2015',
                name: 'PAX Prime 2015 Food Packs',
                official: true,
                order: 26,
                checked: false
            },
            {
                key: 'baseuk',
                name: 'Base Set (UK Edition)',
                official: true,
                order: 32,
                checked: false
            },
            {
                key: 'c-homestuck',
                name: '[C] Cards Against Homestuck',
                official: false,
                order: 43,
                checked: false
            },
            {
                key: 'paxep2014',
                name: 'PAX East 2014 Panel Pack',
                official: true,
                order: 23,
                checked: false
            },
            {
                key: 'c-stupid',
                name: '[C] Ridiculously Stupid',
                official: false,
                order: 63,
                checked: false
            },
            {
                key: 'c-socialgamer',
                name: '[C] SocialGamer',
                official: false,
                order: 66,
                checked: false
            },
            {
                key: 'c-sodomydog',
                name: "[C] Sodomy Dog's Furry Pack",
                official: false,
                order: 67,
                checked: false
            },
            {
                key: 'c-equinity',
                name: '[C] Cards Against Equinity',
                official: false,
                order: 42,
                checked: false
            }
        ];


        createGame() {
            if (!this.username || this.username.trim() == '') {
                this.errorMessage = 'Username is required';
                return;
            }
            axios.post('/api/games', {
                username: this.username,
                password: this.password,
                packs: this.packs.filter(pack => pack.checked).map(pack => pack.key),
                customCards: this.customCards,
            }).then(response => {

                this.$router.push({
                    name: 'games-code',
                    params: {
                        code: response.data.code,
                        username: this.username,
                        password: this.password,
                    }
                });
            }).catch(error => {
                this.errorMessage = error.response.data.message;
            });
        }

        joinGame() {
            this.$router.push({
                name: 'games-code',
                params: {}
            })


        }

        get sortedPacks(): Pack[] {
            return this.packs.sort((a, b) => a.order - b.order)
        }
    }

</script>

<style>
  input:focus {
    outline: none;
  }

  input {
    @apply text-gray-900 rounded px-3 py-3;
    transition: all 0.3s ease-in;
  }

  button:focus {
    outline: none;
  }


  .custom-label input:checked + svg {
    display: block !important;
  }

  /* Sample `apply` at-rules with Tailwind CSS
  .container {
    @apply min-h-screen flex justify-center items-center text-center mx-auto;
  }
  */
</style>
