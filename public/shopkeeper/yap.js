let isYappingCanceled = false;

function cancelYaps() {
  isYappingCanceled = true;
  Howler.stop();
}

const yap_sounds = {
  // these sounds and most of the yapping code are adapted from https://github.com/equalo-official/animalese-generator
  a: new Howl({ src: 'audio/a.wav' }),
  b: new Howl({ src: 'audio/b.wav' }),
  c: new Howl({ src: 'audio/c.wav' }),
  d: new Howl({ src: 'audio/d.wav' }),
  e: new Howl({ src: 'audio/e.wav' }),
  f: new Howl({ src: 'audio/f.wav' }),
  g: new Howl({ src: 'audio/g.wav' }),
  h: new Howl({ src: 'audio/h.wav' }),
  i: new Howl({ src: 'audio/i.wav' }),
  j: new Howl({ src: 'audio/j.wav' }),
  k: new Howl({ src: 'audio/k.wav' }),
  l: new Howl({ src: 'audio/l.wav' }),
  m: new Howl({ src: 'audio/m.wav' }),
  n: new Howl({ src: 'audio/n.wav' }),
  o: new Howl({ src: 'audio/o.wav' }),
  p: new Howl({ src: 'audio/p.wav' }),
  q: new Howl({ src: 'audio/q.wav' }),
  r: new Howl({ src: 'audio/r.wav' }),
  s: new Howl({ src: 'audio/s.wav' }),
  t: new Howl({ src: 'audio/t.wav' }),
  u: new Howl({ src: 'audio/u.wav' }),
  v: new Howl({ src: 'audio/v.wav' }),
  w: new Howl({ src: 'audio/w.wav' }),
  x: new Howl({ src: 'audio/x.wav' }),
  y: new Howl({ src: 'audio/y.wav' }),
  z: new Howl({ src: 'audio/z.wav' }),
  th: new Howl({ src: 'audio/th.wav' }),
  sh: new Howl({ src: 'audio/sh.wav' }),
  _: new Howl({ src: 'audio/_.wav' })
}

async function yap(text, {
  letterCallback = () => { },
  endCallback = () => { },
  baseRate = 3.2,
  rateVariance = 1,
} = {}) {
  isYappingCanceled = false;

  const yap_queue = [];
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const lowerChar = char?.toLowerCase()
    const prevChar = text[i - 1]
    const prevLowerChar = prevChar?.toLowerCase()
    const nextChar = text[i + 1]
    const nextLowerChar = nextChar?.toLowerCase()

    if (lowerChar === 's' && nextLowerChar === 'h') { // test for 'sh' sound
      yap_queue.push({ letter: char, sound: yap_sounds['sh'] });
      continue;
    } else if (lowerChar === 't' && nextLowerChar === 'h') { // test for 'th' sound
      yap_queue.push({ letter: char, sound: yap_sounds['th'] });
      continue;
    } else if (lowerChar === 'h' && (prevLowerChar === 's' || prevLowerChar === 't')) { // test if previous letter was 's' or 't' and current letter is 'h'
      yap_queue.push({ letter: char, sound: yap_sounds['_'] });
      continue;
    } else if (',?. '.includes(char)) {
      yap_queue.push({ letter: char, sound: yap_sounds['_'] });
      continue;
    } else if (lowerChar === prevLowerChar) { // skip repeat letters
      yap_queue.push({ letter: char, sound: yap_sounds['_'] });
      continue;
    }

    if (lowerChar.match(/[a-z.]/)) {
      yap_queue.push({ letter: char, sound: yap_sounds[lowerChar] })
      continue; // skip characters that are not letters or periods
    }

    yap_queue.push({ letter: char, sound: yap_sounds['_'] })
  }

  function next_yap() {
    if (isYappingCanceled) {
      console.log('yap canceled');
      return;
    }
    if (yap_queue.length === 0) {
      console.log('yap done')
      endCallback()
      return
    }
    let { sound, letter } = yap_queue.shift()
    sound.rate(Math.random() * rateVariance + baseRate)
    sound.volume(1)
    sound.once('end', next_yap)
    sound.play()
    sound.once('play', () => {
      letterCallback({ sound, letter, length: yap_queue.length })
    })
  }

  next_yap();
}