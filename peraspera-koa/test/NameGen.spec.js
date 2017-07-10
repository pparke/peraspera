import chai from 'chai';
import NameGen from '../src/lib/NameGen';

const { expect } = chai;

describe('NameGen', () => {
  const nameGen = new NameGen();

  it('should get a number of random characters', () => {
    const chars = new Array(10).fill('').map(nameGen.getRandomChar.bind(nameGen));
    expect(chars).to.be.an('array');
    chars.forEach((char, i) => {
      expect(char).to.be.a('string');
      console.log(`${i}: ${char}`);
    });
  });

  it('should get a random consonant', () => {
    const consonant = nameGen.getByFrequency(nameGen.frequencies.english.consonants);
    expect(nameGen.consonants.indexOf(consonant) > -1).to.equal(true);
  });

  it('should get a random vowel', () => {
    const vowel = nameGen.getByFrequency(nameGen.frequencies.english.vowels);
    expect(nameGen.vowels.indexOf(vowel) > -1).to.equal(true);
  });

  it('should identify a vowel correctly', () => {
    expect(nameGen.isVowel('a')).to.equal(true);
  });

  it('should identify a consonant correctly', () => {
    expect(nameGen.isConsonant('f')).to.equal(true);
  });

  it('should produce a random word', () => {
    const word = nameGen.generate(10);
    expect(word).to.be.a('string');
    expect(word).to.have.lengthOf(10);
    console.log(word);
  });
});
