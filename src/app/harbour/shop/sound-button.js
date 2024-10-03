import { useState, useEffect, useRef } from "react";

const musicUrl = 'https://cloud-22krjnymh-hack-club-bot.vercel.app/0fanfare_2__zthdwj7smms__audio.mp4'
const trumpetUrl = 'https://cloud-74zjdhued-hack-club-bot.vercel.app/1frame_12.png'
const flagUrl = 'https://cloud-pfu2uqcdh-hack-club-bot.vercel.app/0frame_6.png'

const Trumpet = ({bot, rot, ani, dur, flip=false}) => {
  const pos = {}
  if (flip) {
    pos.left = '-4%'
  } else {
    pos.right = '-4%'
  }
  return (
    <div class={`fixed opacity-0 animate-slide_in_${flip ? 'left' : 'right'}`} style={{animationDelay: '8000ms', animationFillMode: 'forwards', bottom: `${bot}%`, ...pos}}>
      <div style={{transform: `rotate(${rot}deg)`}}>
        <div class={`inline-block animate-[${ani}_750ms_ease-out_0ms_alternate_infinite]`} >
          <div class="animate-quick_yapping">
            <img src={trumpetUrl} class={`w-42 ${flip ? 'scale-x-[-1]' : ''}`} alt="trumpet" />
          </div>
        </div>
      </div>
    </div>
  )
}

const Flag = ({bot, rot, ani, dur, flip=false}) => {
  const pos = {}
  if (flip) {
    pos.left = '-4%'
  } else {
    pos.right = '-4%'
  }
  return (
    <div class={`fixed opacity-0 animate-slide_in_${flip ? 'left' : 'right'}`} style={{animationDelay: '8000ms', animationFillMode: 'forwards', bottom: `${bot}%`, ...pos}}>
      <div style={{transform: `rotate(${rot}deg)`}}>
        <div class={`inline-block animate-[${ani}_750ms_ease-out_0ms_alternate_infinite]`} >
          <div class="animate-quick_yapping">
            <img src={flagUrl} class={`w-42 ${flip ? 'scale-x-[-1]' : ''}`} alt="trumpet" />
          </div>
        </div>
      </div>
    </div>
  )
}

const theTrumpets = () => {
  return (<>
    {/* first trumpet always starts from the right and bobs up and down  */}
    <div class="fixed bottom-20 -right-4 animate-slide_in_right">
      <div class="rotate-[17deg]">
        <div class="inline-block animate-trumpet1 ease-out ">
          <div class="animate-quick_yapping">
            <img src={trumpetUrl} class="w-32" alt="trumpet" />
          </div>
        </div>
      </div>
    </div>
    {/* other trumpets are delayed */}
    <Trumpet bot={40} rot={15} ani="trumpet2" dur="500" />
    <Trumpet bot={60} rot={-15} ani="trumpet3" dur="1250" />
    <Trumpet bot={30} rot={7} ani="trumpet2" dur="1250" />
    {/* left trumpets */}
    <Trumpet bot={35} rot={-7} ani="trumpet2" dur="1000" flip={true} />
    <Trumpet bot={15} rot={7} ani="trumpet3" dur="750" flip={true} />
    <Trumpet bot={50} rot={17} ani="trumpet2" dur="750" flip={true} />
  </>)
}

const theFlags = () => {
  return (<>
    {/* first trumpet always starts from the right and bobs up and down  */}
    <div class="fixed top-0 -right-4 animate-slide_in_right">
      <div class="">
        <div class="inline-block animate-trumpet1 ease-out ">
          <div class="animate-quick_yapping">
            <img src={flagUrl} class="w-32" alt="trumpet" />
          </div>
        </div>
      </div>
    </div>
    {/* other trumpets are delayed */}
    <Flag bot={40} rot={15} ani="trumpet2" dur="500" />
  </>)
}

const SoundButton = () => {
  const [ soundState, setSoundState ] = useState(false)
  const audioRef = useRef()

  // toggle sound state
  const handleClick = () => {
    setSoundState(!soundState)
  }

  useEffect(() => {
    // play sound if soundState is true
    if (soundState) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [soundState])

  return (
    <>
      <audio src={musicUrl} loop ref={audioRef} />
      {soundState ? (theTrumpets()) : ('')}
      {soundState ? (theFlags()) : ('')}
      <div class="fixed bottom-3 right-3 cursor-pointer" onClick={handleClick}>
        <div class="bg-darker border-pink size-24 rounded-full border-2 flex items-center justify-center">
          {soundState ? ('🔊') : ('🔇')}
        </div>
      </div>
    </>
  )
}

export { SoundButton }