function pigIt(str){
  const wordArray = str.split(' ');
  const dopText = 'ay';

  return wordArray.map(word => {
    const [firstLetter, ...letters] = word.split('');
    if (word.match(/[^a-zA-Z]/g)) return word;
    return [...letters, firstLetter].join('') + dopText;
  }).join(' ');
}

console.log(pigIt('Pig latin is cool !'));
