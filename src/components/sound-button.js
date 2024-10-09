import { useState, useEffect, useRef } from "react";
import { sample } from "../../lib/flavor";

const musicUrl = 'https://cloud-22krjnymh-hack-club-bot.vercel.app/0fanfare_2__zthdwj7smms__audio.mp4'
const trumpetUrl = 'https://cloud-74zjdhued-hack-club-bot.vercel.app/1frame_12.png'
const flagUrl = 'https://cloud-pfu2uqcdh-hack-club-bot.vercel.app/0frame_6.png'

const Trumpet = ({bot, rot, flip=false}) => {
  const pos = {}
  if (flip) {
    pos.left = '-4%'
  } else {
    pos.right = '-4%'
  }
  const slide_in = flip ? 'animate-slide_in_left' : 'animate-slide_in_right'
  // We need to define this because tailwind's JIT doesn't recognize them unless they're defined here
  const animations = [
    'animate-trumpet2',
    'animate-trumpet3',
    // 'animate-trumpet4',
  ]
  return (
    <div className={`fixed opacity-0 ${slide_in}`} style={{animationDelay: '8000ms', animationFillMode: 'forwards', bottom: `${bot}%`, ...pos}}>
      <div style={{transform: `rotate(${rot}deg)`}}>
        <div className={sample(animations)} style={{animationDuration: '2000ms'}}>
          <div className="animate-quick_yapping">
            <img src={trumpetUrl} className={`w-42 ${flip ? 'scale-x-[-1]' : ''}`} alt="trumpet" />
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
    <div className="fixed bottom-20 -right-4 animate-slide_in_right">
      <div className="rotate-[17deg]">
        <div className="inline-block animate-trumpet1 repeat-infinite">
          <div className="animate-quick_yapping">
            <img src={trumpetUrl} className="w-32" alt="trumpet" />
          </div>
        </div>
      </div>
    </div>
    {/* other trumpets are delayed */}
    <Trumpet bot={40} rot={15} ani="trumpet2" />
    <Trumpet bot={60} rot={-15} ani="trumpet3" />
    <Trumpet bot={30} rot={7} ani="trumpet2" />
    {/* left trumpets */}
    <Trumpet bot={35} rot={-7} ani="trumpet2" flip={true} />
    <Trumpet bot={15} rot={7} ani="trumpet3" flip={true} />
    <Trumpet bot={50} rot={17} ani="trumpet2" flip={true} />
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
      <div className="fixed bottom-3 right-3 cursor-pointer" onClick={handleClick}>
        <div className="bg-darker border-pink size-24 rounded-full border-2 flex items-center justify-center">
          {soundState ? ('🔊') : ('🔇')}
        </div>
      </div>
    </>
  )
}

export { SoundButton }