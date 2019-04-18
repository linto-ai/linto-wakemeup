this.recordIcon<template>
  <div class="recordBtn-container">
    <svg height="200" id="redordBtn" preserveAspectRatio="xMidYMid meet" viewBox="0 0 200 200" webgl="true"  :class="status">
      <g id="recordBtnGroup">
        <defs>
          <radialGradient id="volumeLevel">
            <stop offset="0%" stop-color="#c61e42"/>
            <stop offset="95%" stop-color="#ffffff"/>
          </radialGradient>
        </defs>
        <circle  cx="100" cy="100" r="80" id="recordBtn-volume" fill="url(#volumeLevel)"/>
        <circle  cx="100" cy="100" r="70" id="recordBtn-bg" class="btn-background" @click="clicBtn()"/>
        
        <g id="record-btn-numbers">
          <path class="number" id="nb1" d="M110.6,121.4h-9.1V96.6l0.1-4.1l0.1-4.5c-1.5,1.5-2.5,2.5-3.1,3l-4.9,4l-4.4-5.4l13.8-11h7.4V121.4z" transform-origin="center center"/>
          <path class="number" id="nb2" d="M115,121.7H85.1v-6.3l10.8-10.9c3.2-3.3,5.3-5.5,6.2-6.8c1-1.3,1.7-2.4,2.1-3.5c0.4-1.1,0.6-2.2,0.6-3.3 c0-1.7-0.5-3-1.4-3.8c-0.9-0.8-2.2-1.3-3.8-1.3c-1.7,0-3.3,0.4-4.8,1.1c-1.6,0.8-3.2,1.8-4.9,3.3L85,84.4c2.1-1.8,3.9-3.1,5.2-3.8 c1.4-0.7,2.9-1.3,4.5-1.7c1.6-0.4,3.5-0.6,5.5-0.6c2.7,0,5,0.5,7.1,1.5c2.1,1,3.6,2.3,4.8,4.1c1.1,1.8,1.7,3.8,1.7,6 c0,2-0.3,3.8-1,5.6c-0.7,1.7-1.8,3.5-3.2,5.3c-1.5,1.8-4,4.4-7.7,7.8l-5.5,5.2v0.4H115V121.7z" transform-origin="center center"/>
          <path class="number" id="nb3" d="M113.6,88.2c0,2.7-0.8,5-2.4,6.8c-1.6,1.9-3.9,3.2-6.8,3.9V99c3.5,0.4,6.1,1.5,7.9,3.1 c1.8,1.7,2.7,3.9,2.7,6.8c0,4.1-1.5,7.3-4.5,9.6c-3,2.3-7.3,3.4-12.8,3.4c-4.6,0-8.8-0.8-12.4-2.3V112c1.7,0.8,3.5,1.5,5.5,2.1 s4,0.8,5.9,0.8c3,0,5.2-0.5,6.6-1.5c1.4-1,2.1-2.6,2.1-4.9c0-2-0.8-3.4-2.5-4.3c-1.6-0.8-4.3-1.3-7.9-1.3h-3.3v-6.9h3.3 c3.3,0,5.7-0.4,7.3-1.3c1.5-0.9,2.3-2.4,2.3-4.5c0-3.2-2-4.9-6.1-4.9c-1.4,0-2.8,0.2-4.3,0.7c-1.5,0.5-3.1,1.3-4.8,2.4l-4.2-6.2 c3.9-2.8,8.6-4.2,14-4.2c4.4,0,7.9,0.9,10.5,2.7C112.3,82.5,113.6,85,113.6,88.2z" transform-origin="center center"/>
        </g>
        <g id="record-btn-icon" @click="clicBtn()">
          <path class="record-icon" d="M123.7,87.1c-1,0-1.8,0.8-1.8,1.8v11.4c0,12.1-9.8,21.9-21.9,21.9s-21.9-9.8-21.9-21.9V88.9 c0-1-0.8-1.8-1.8-1.8s-1.8,0.8-1.8,1.8v11.4c0,13.5,10.5,24.5,23.7, 25.5v9.5h-9.5c-1,0-1.8,0.8-1.8,1.8c0,1,0.8,1.8,1.8,1.8h22.6 c1,0,1.8-0.8,1.8-1.8c0-1-0.8-1.8-1.8-1.8h-9.5v-9.5c13.2-0.9,23.7-12,23.7-25.5V88.9C125.6,87.9,124.8,87.1,123.7,87.1z"/>
          <path class="record-icon" d="M101.2,61.1h-2.5c-8.3,0-15.1,6.8-15.1,15.1v25.3c0,8.3,6.8,15.1,15.1,15.1h2.5c8.3,0,15.1-6.8,15.1-15.1 V76.2C116.3,67.9,109.6,61.1,101.2,61.1z M112.7,81H106c-1,0-1.8,0.8-1.8,1.8s0.8,1.8,1.8,1.8h6.6v5.1H106c-1,0-1.8,0.8-1.8,1.8 s0.8,1.8,1.8,1.8h6.6v5.1H106c-1,0-1.8,0.8-1.8,1.8s0.8,1.8,1.8,1.8h6.6c-0.3,6-5.3,10.9-11.4,10.9h-2.5 c-6.1,0-11.1-4.8-11.4-10.9H94c1,0,1.8-0.8,1.8-1.8s-0.8-1.8-1.8-1.8h-6.6v-5.1H94c1,0,1.8-0.8,1.8-1.8s-0.8-1.8-1.8-1.8h-6.6 v-5.1H94c1,0,1.8-0.8,1.8-1.8S94.9,81,94,81h-6.6v-4.7c0-4.6,2.7-8.5,6.5-10.4V71c0,1,0.8,1.8,1.8,1.8c1,0,1.8-0.8,1.8-1.8v-6.1 c0.4-0.1,4.7-0.1,5.1,0v6.2c0,1,0.8,1.8,1.8,1.8s1.8-0.8,1.8-1.8v-5.1c3.8,1.9,6.5,5.8,6.5,10.4L112.7,81L112.7,81z" />
        </g>
      </g>
      <g class="text">
          <text x="100%"  y="50%" opacity="0" id="recordBtn-text" style="font-size: 32px; fill: #444444">
            Dites : "<tspan :fill="redChart">{{ wakeword }}</tspan>"
          </text>
      </g>
    </svg>
  </div>
</template>
<script>
import { bus } from '../main.js'
export default {
  props: ['wakeword'], 
  data () {
    return {
      redChart: '#c61e42',
      greenChart: '#2da800',
      svg: null,
      recordBtnShadow: null,
      recordBtnBg: null,
      recordIcon: null,
      status: 'notRecording',
      animate: false,
      svgText: '',
      offsetText: 0,
      nb3: null,
      nb2: null,
      nb1: null,
      svgElements: [],
      hasRecorded: false
    }
  },
  watch: {
    status: function (data) {
      if(data === 'beforeRecording') {
        this.hasRecorded = false
        this.animateBeforeRecording()
      }
      else if(data === 'recording') {
        this.hasRecorded = false
        this.animateRecording()
      } 
      else {
        this.cancelAnimation()
      }
    },
    hasRecorded: function (data) {
      if(data){
        setTimeout(() => {
          for(let i = 0; i < this.recordIcon.length; i++){
            this.recordIcon[i].setAttribute('fill', this.greenChart)
          }
        }, 400)
      }
    }
  },
  mounted () {
    this.svg = document.getElementById('recordBtn')

    // Circle volume
    this.recordBtnShadow = document.getElementById('recordBtn-volume')

    // background circle
    this.recordBtnBg = document.getElementById('recordBtn-bg')
    this.recordBtnBg.setAttribute('fill', '#ffffff')

    
    // Record icon
    this.recordIcon = document.getElementsByClassName('record-icon')
    for(let i = 0; i < this.recordIcon.length; i++){
      this.recordIcon[i].setAttribute('fill', this.redChart)
    }

    // Numbers
    this.nb1 = document.getElementById('nb1')
    this.nb2 = document.getElementById('nb2')
    this.nb3 = document.getElementById('nb3')
    
    this.nb1.setAttribute('fill', this.redChart)
    this.nb2.setAttribute('fill', this.redChart)
    this.nb3.setAttribute('fill', this.redChart)

    this.nb1.setAttribute('opacity', 0)
    this.nb2.setAttribute('opacity', 0)
    this.nb3.setAttribute('opacity', 0)

    // Svg text
    this.svgText = document.getElementById('recordBtn-text')
    
    this.svgElements = [this.recordBtnShadow, this.recordIcon[0], this.recordIcon[1], this.recordBtnBg, this.nb1, this.nb2, this.nb3, this.svgText]
    
    bus.$on('stop_recording', () => {
      this.hasRecorded = true
      this.status = 'notRecording'
    })

    bus.$on('before_recording', () => {
      this.status = 'beforeRecording'
    })
  },
  methods: {
    clicBtn () {
      if (this.status === 'notRecording'){
        
        this.status = 'beforeRecording'
      }  else {
        this.cancelAnimation()
      }

      if(this.hasRecorded) {
        bus.$emit('reset_recording', {})
      }
    },
    cancelAnimation () {
      this.status = 'notRecording'
      for(let i = 0; i < this.svgElements.length; i++){
        this.svgElements[i].setAttribute('transform','translate(0 0)')
        if(this.svgElements[i].classList.contains('record-icon')){
          this.svgElements[i].setAttribute('fill', this.redChart)
        }
        if(this.svgElements[i].classList.contains('btn-background')){
          this.svgElements[i].setAttribute('fill', '#ffffff')
        }
      }
      this.svgText.setAttribute('opacity', 0)
    },
    animateBeforeRecording () {
      for(let i = 0; i < this.recordIcon.length; i++){
        this.recordIcon[i].setAttribute('opacity', 0)
      }
      setTimeout(()=>{
        this.nb3.setAttribute('opacity', 1)
        setTimeout(()=>{
          this.nb3.setAttribute('transform', `scale(0.5)`);
          setTimeout(() => {
              this.nb3.setAttribute('opacity', 0)
              this.nb2.setAttribute('opacity', 1)
              setTimeout(()=>{
              this.nb2.setAttribute('transform', `scale(0.5)`);
              setTimeout(() => {
                  this.nb2.setAttribute('opacity', 0)
                  this.nb1.setAttribute('opacity', 1)
                  setTimeout(()=>{
                  this.nb1.setAttribute('transform', `scale(0.5)`);
                  setTimeout(() => {
                      this.nb1.setAttribute('opacity', 0)
                      this.nb1.setAttribute('transform', `scale(1)`);
                      this.nb2.setAttribute('transform', `scale(1)`);
                      this.nb3.setAttribute('transform', `scale(1)`);
                      for(let i = 0; i < this.recordIcon.length; i++){
                        this.recordIcon[i].setAttribute('opacity', 1)
                      }
                      this.offsetText =  this.svgText.getBBox().width - 20
                      for(let j=0; j < this.svgElements.length; j++){
                        this.svgElements[j].setAttribute('transform', `translate(-${this.offsetText} 0)`)
                      }
                      this.svgText.setAttribute('opacity', 1)

                      this.status = 'recording'
                      bus.$emit('start_recording', {})
                  }, 300)
                }, 400)
              }, 300)
            }, 400)
          }, 300)
        }, 400)
      }, 300)
    },
    animateRecording () {
      if(this.status === 'recording'){
        if(this.recordBtnBg.getAttribute('fill') === '#ffffff'){
          this.recordBtnBg.setAttribute('fill', this.redChart);
          for(let i = 0; i < this.recordIcon.length; i++){
            this.recordIcon[i].setAttribute('fill', '#ffffff')
          }
        } else {
          this.recordBtnBg.setAttribute('fill', '#ffffff')
          // Record icon
          
          for(let i = 0; i < this.recordIcon.length; i++){
            this.recordIcon[i].setAttribute('fill', this.redChart)
          }
        }
        setTimeout(() => {
          this.animateRecording()
        }, 500)
      } else {
        this.recordBtnBg.setAttribute('fill', '#ffffff')
        // Record icon
        
        for(let i = 0; i < this.recordIcon.length; i++){
          this.recordIcon[i].setAttribute('fill', this.redChart)
        }
      }
    }
  }
}
</script>
