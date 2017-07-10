
export default class NameGen {
  constructor() {
    this.consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
    this.vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
    this.double = ['b', 'd', 'e', 'o', 'g', 'l', 'm', 'n', 'p', 'r', 's', 't'];
    this.compoundCon = ['ch', 'ck', 'gh', 'ng', 'ph', 'qu', 'sc', 'sh', 'th', 'wh', 'bt', 'pt', 'kn', 'gn', 'pn', 'mb', 'lm', 'ps', 'rh', 'wr'];
    this.compoundVow = ['io', 'ie', 'ia', 'ua', 'eu', 'ae', 'ea', 'oy', 'yo', 'eo', 'oe', 'oa'];
    this.frequencies = {
      'english': {
        'consonants': {
          'b': 0.0149,
          'c': 0.0278,
          'd': 0.0425,
          'f': 0.0223,
          'g': 0.0202,
          'h': 0.0609,
          'j': 0.0015,
          'k': 0.0077,
          'l': 0.0403,
          'm': 0.0241,
          'n': 0.0675,
          'p': 0.0193,
          'q': 0.001,
          'r': 0.0599,
          's': 0.0633,
          't': 0.0906,
          'v': 0.0098,
          'w': 0.0236,
          'x': 0.0015,
          'z': 0.0007
        },
        'vowels': {
          'a': 0.0817,
          'e': 0.127,
          'i': 0.0697,
          'o': 0.0751,
          'u': 0.0276,
          'y': 0.0197
        }
      }
    };
  }

  generate(length) {
    const name = [];

    for (let i = 0; i < length; i++) {
      if (i === 0) {
        name.push(this.getRandomChar());
      }
      else {
        name.push(this.getNextChar(name[i - 1]));
      }
    }

    return name.join('');
  }

  getNextChar(lastChar) {
    if (this.isConsonant(lastChar)) {
      // get a vowel
      return this.getByFrequency(this.frequencies.english.vowels);
    }
    else if (this.isVowel(lastChar)) {
      // get a consonant
      return this.getByFrequency(this.frequencies.english.consonants);
    }
    throw new Error('Last character was not a vowel or a consonant');
  }

  isVowel(char) {
    return this.vowels.includes(char);
  }

  isConsonant(char) {
    return this.consonants.includes(char);
  }

  getByFrequency(freqs) {
    const sorted = [];
    let probSum = 0;
    Object.keys(freqs)
      .map((key) => {
        return { key, frequency: freqs[key] };
      })
      .reduce((srtd, f, i) => {
        if (i === 0) {
          srtd.push(f);
        }
        if (f.frequency >= srtd[0].frequency) {
          srtd.unshift(f);
        }
        else {
          srtd.push(f);
        }
        probSum += f.frequency;
        return srtd;
      }, sorted)
      .map((el) => {
        el.probability = (el.frequency / probSum);
      });

    const selection = Math.random();
    let character = '';
    let cumulative = 0;
    const notFound = sorted.every((prob) => {
      cumulative += prob.probability;
      if (selection <= cumulative) {
        character = prob.key;
        return false;
      }
      return true;
    });

    if (!notFound) {
      return character;
    }

    throw new Error(`Could not determine character with selection: ${selection}
                     and probabilities ${JSON.stringify(sorted, null, '\t')}`);
  }

  getRandomChar() {
    const alpha = Array.concat(this.consonants, this.vowels);
    return alpha[Math.floor(Math.random() * alpha.length)];
  }
}
