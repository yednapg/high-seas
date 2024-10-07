import jsyaml from 'js-yaml'
import { useEffect } from 'react'

const shopkeeperImages = {
  questionRaccoon: 'https://cloud-nfmmdwony-hack-club-bot.vercel.app/0000.png'
}

const puns = [
  "Recommended by 4 out of 5 dead adventurers",
  "Recommended by Dr. Agon!",
  "Knight tested, dragon approved!",
  "info:raccSmirk|Dragon deez-|action:clear|info:orphShock|speed:600|HEIDI!",
]

let transcriptData
async function init() {
  let yaml = await fetch('/shopkeeper/transcript.yml').then(r => r.text())
  transcriptData = jsyaml.load(yaml)
}

function transcript(path, context = {}, skipArrays = true, depth = 0) {
  if (depth > 10) { console.log('hit recursion depth 10!'); return }
  try {
    const leaf = getDescendantProp(transcriptData, path, skipArrays)
    if (typeof leaf === 'string') {
      return evalInContext('`' + leaf + '`', {...context, t: transcript})
    } else {
      return leaf
    }
  } catch(e) {
    console.error(e)
    return path
  }
}

function evalInContext(js, context) {
  console.log({js, context})
  return function() { return eval(js); }.call(context);
}

function getDescendantProp(obj, desc, skipArrays) {
  const arr = desc.split(".");
  console.log({arr, obj})
  while (arr.length) {
    obj = obj[arr.shift()];
    if (Array.isArray(obj) && skipArrays) {
      obj = obj[Math.floor(Math.random() * obj.length)]
    }
  }
  return obj;
}

// const Shopkeepers = ({
//   transcript = ''
// }) => {
//   const [ shopkeeperUrl, setShopkeeperUrl ] = useState(shopkeeperImages['questionRaccoon'])
//   const [ chat, setChat ] = useState('')
//   useEffect(() => {
//     const commands = transcript.split('|') // split text by pipe
//     commands.forEach(command => {
//       if (command.startsWith('icon:')) {
//         const shopkeeper = command.split(':')[1]
//         if (shopkeeperImages[shopkeeper]) {
//           setShopkeeperUrl(shopkeeperImages[shopkeeper])
//         }
//       } else if (command.startsWith('speed:')) {
//       } else {
//         setChat(command)
//       }
//   }, [])
//   return (
//     <>
//     </>
//   )
// }

const Shopkeeper = () => {
  // useEffect(() => {
  //   if (!transcriptData) { init() }
  //   const scripts = []
  //   const addScript = (src) => {
  //     const script = document.createElement('script');
  //     script.src = src;
  //     document.body.appendChild(script);
  //     scripts.push(script)
  //   }

  //   addScript("https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js")
  //   addScript("/shopkeeper/yap.js")
  // }, [])
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
    <iframe src="/shopkeeper/index.html" style={{
      width: '100%',
      height: '100%',
      border: 'none',
      zIndex: 999,
      position: 'fixed',
      }}></iframe>
    </div>
  )
}

export { Shopkeeper }