<template>
  <vue-aspect-ratio class="flex flex-col w-full" ar="63:88" width="100%">
    <div class="card-wrapper h-full relative">
      <div :class="{'bg-white':!isBlack,'bg-black':isBlack,'active':active,'shadow':active}"
           class="w-full flex-col justify-between shadow-lg rounded-lg relative p-2 px-2 flex h-full"
      >

        <div
          :class="cardClasses"
          class="font-bold card-text w-full">
          <p v-resize-text="{minFontSize:'2px',ratio: 0.8}" v-html="text.replace(/_/g,'______')"></p>
          <slot></slot>
        </div>

        <div class="flex items-center">
          <div class="flex w-2/12">
            <img :style="{filter: `invert(${isBlack ? 1 : 0})`} " class="w-full h-full" src="/icon.png" alt="">
          </div>
          <div class="flex">
            <p v-resize-text="{minFontSize:'2px',ratio: isBlack ? 1 : 0.8}"
               :class="{'text-white':isBlack,'text-black':!isBlack,'mb-1': isBlack}"
               class="mx-1 card-bottom-title leading-none font-bold">
              Cards
              Against
              Humanity
            </p>
          </div>
          <div class="flex">
            <div v-if="pick > 1" class="rounded-full bg-white text-black px-2 flex justify-center items-center">
              {{pick}}
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center w-full absolute card-overlay rounded-lg" v-if="active">
        <button v-if="!judging" @click="play" class="btn btn-primary py-10">Play</button>
      </div>
    </div>
  </vue-aspect-ratio>

</template>

<script>
    import VueAspectRatio from "vue-aspect-ratio";
    import VueResizeText from 'vue-resize-text';
    import Vue from 'vue';

    Vue.use(VueResizeText)
    export default {
        name: "Card",

        props: {
            text: {
                type: String
            },
            type: {
                type: String,
                default: 'white',
            },
            judging: {
                type: Boolean,
                default: false,
            },
            active: {
                type: Boolean,
                default: false,
            },
            pick: {
                type: Number,
                default: 0,
            },


        },
        components: {
            "vue-aspect-ratio": VueAspectRatio
        },
        directives: {},
        methods: {
            play() {
                this.$emit('play', {text: this.text})
            },

        },
        computed: {
            isBlack() {
                return this.type === 'black';
            },
            cardClasses() {

                return {
                    align: true,
                    'text-white': this.isBlack,
                    'text-black': !this.isBlack,
                    'text-5xl': this.isBlack,
                    'font-full': !this.isBlack,
                    'px-2 pt-1': this.isBlack,
                    'flex flex-col justify-center':this.text === "",
                }
            }
        }

    }
</script>

<style scoped>
  .active {
  }

</style>
