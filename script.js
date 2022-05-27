'use strict';

const numberOfBlocks = 1000;
const blockSize = 20; //K
const divisor = 110101; //P
const BER = 10 ** -3; //BER
const PER = 1 - (1 - BER) ** blockSize; //PER

let totalErrors = 0;

//Precentages
let preErrorMess;
let preErrorMessDetected;
let preErrorMessNotDetected;

const xor = function (a, b) {
  let result = '';
  for (let i = 0; i < `${a}`.length; i++) {
    if (a[i] === b[i]) result += '0';
    else result += '1';
  }
  return result;
};

const computeFCS = function (dividend, divisor) {
  //Appending the necessary Zeros to the dividend before proceeding with the division (T=2^(n-k)*D)
  const zerosToAppend = divisor.length - 1;
  for (let i = 0; i < zerosToAppend; i++) dividend += '0';
  console.log(`We  appended: ${zerosToAppend} mhdenika ston diairetaio`);

  // Number of bits to be XORed at a time.
  let pick = divisor.length;

  //Slicing the dividend to appropriate length for particular step
  let tmp = dividend.slice(0, pick);

  while (pick < dividend.length) {
    if (tmp[0] === '1') {
      tmp = xor(divisor, tmp) + dividend[pick];
      if (tmp[0] === '0') tmp = tmp.slice(1);
    } else {
      tmp = tmp.slice(1) + dividend[pick];
    }
    pick += 1;
  }
  if (tmp[0] === '1') tmp = xor(divisor, tmp);

  const res = tmp;
  return res.slice(1);
};

const createBlock = function (k) {
  let block = '';
  for (let i = 0; i < k; i++) {
    let randomNumber = Math.random() >= 0.5 ? 1 : 0;
    block += randomNumber;
  }
  return block;
};

//Parameters: message T (block*2n-k + CRC) and Divisor P
//Returns: true if remainder is 0 otherwise false
const checkT = function (t, p) {
  const remainder = computeFCS(t.toString(), p.toString());
  if (parseInt(remainder) === 0) {
    return 1;
  } else {
    return 0;
  }
};

const transferChannelBer = function (t) {
  const randomNumber = Math.random();
  //const PEProb = 1 - (1 - ber) ** blockSize;
  // const PEProbPrec = (PEProb * 100).toFixed(2);
  // const randomNumberPrec = (Math.random() * 100).toFixed(2);
  const error = randomNumber <= PER ? true : false;

  console.log(`Packet Error Probability: ${PER}`);
  console.log(`randomNumber: ${randomNumber}`);
  console.log('Error: ', error);

  if (!error) {
    return t;
  } else {
    totalErrors++;
    return changeRandomChar(t);
    // if (t[0] === '0') return '1' + t.slice(1);
    // else return '0' + t.slice(1);
  }
};

const changeRandomChar = function (str) {
  const randNumber = Math.round(Math.random() * (str.length - 1));
  const strArr = str.split('');
  strArr[randNumber] = strArr[randNumber] === '0' ? '1' : '0';
  console.log(`Change at position ${randNumber}`);
  return strArr.join('');
};

const printInfoPrecenteges = function () {
  console.log(
    `Total messages transmitted: ${numberOfBlocks}\nTotal number of messages containing errors: ${totalErrors}\nPrecentage of messages transmitted with errors: ${
      (totalErrors / numberOfBlocks) * 100
    }%`
  );
};

//Create Blocks array
const blocksArr = [];
for (let i = 0; i < numberOfBlocks; i++) {
  blocksArr.push(createBlock(blockSize));
}
// console.log('Blocks Array: ', blocksArr);

//Create FCS array
const fcsArr = [];
for (let i = 0; i < blocksArr.length; i++) {
  fcsArr.push(computeFCS(blocksArr[i].toString(), divisor.toString()));
}
// console.log('FCS Array: ', fcsArr);

const tArr = [];
for (let i = 0; i < blocksArr.length; i++) {
  tArr.push(blocksArr[i] + fcsArr[i]);
}
// console.log('T Array: ', tArr);

const tArrBer = [];
for (let i = 0; i < blocksArr.length; i++) {
  tArrBer.push(transferChannelBer(tArr[i]));
}
console.log('tArrBer: ', tArrBer);

// for (let i = 0; i < blocksArr.length; i++) {
//   console.log(
//     `${i + 1} D: ${blocksArr[i]} P: ${divisor}  FCS: ${fcsArr[i]}  T: ${
//       tArr[i]
//     }`
//   );
// }

for (let i = 0; i < tArr.length; i++) {
  console.log(i + 1, tArr[i], fcsArr[i], checkT(tArrBer[i], divisor), 'here!');
}

// for (let i = 0; i < tArr.length; i++)
//   console.log(
//     'Before:',
//     tArr[i],
//     'After:',
//     transferChannelBer(tArr[i])
//     //checkT(transferChannelBer(tArr[i]), divisor)
//     //checkT(tArrBer[i], divisor)
//   );
console.log(`Total Packages with errors: ${totalErrors}`);
printInfoPrecenteges();
/*
 To do:
 1) Create function to check if a message T is transported correctly to the receiver DONE 
 2) Refactor Code
 3) Set Up Github DONE
 4) When there is an error make a change to a random letter of the string
*/

//Prwta tranfer through ber channel then --> checkT
//Afou exw to tArr to pairnaw olo mesa apo to berChannel kai ftiaxnw enan neo pinaka

//To ber anaferetai se ena minima T
