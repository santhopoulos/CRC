'use strict';

const numberOfBlocks = 10000;
const blockSize = 20; //K
const divisor = 110101; //P
const BER = 10 ** -3; //BER (Bit error rate)
const PER = 1 - (1 - BER) ** blockSize; //PER (Package error rate)

let totalErrors = 0;
// let errorsDetected = 0;

//Precentages
let preErrorMess; //Precentage of messages transmitted with error/errors
let preErrorMessDetected; //Precentage of detected messages containing error/errors
let preErrorMessNotDetected; //Precentage of undetected messages containing error/errors

const xor = function (a, b) {
  let result = '';
  for (let i = 0; i < `${a}`.length; i++) {
    if (a[i] === b[i]) result += '0';
    else result += '1';
  }
  return result;
};

const computeFCS = function (dividend, divisor) {
  //Appending the necessary Zeros to the dividend
  const zerosToAppend = divisor.length - 1;
  for (let i = 0; i < zerosToAppend; i++) dividend += '0';

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

  return tmp.slice(1);
};

//creates a Block of k bits with each bit having equal possibility to be 1 or 0
const createBlock = function (k) {
  console.log('Blocks created');
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

//Method to transfer the message through BER channel
const transferMessageChannelBer = function (t) {
  const randomNumber = Math.random();
  const error = randomNumber <= PER ? true : false;

  if (!error) {
    return t;
  } else {
    totalErrors++;
    const tError = changeRandomChar(t);
    // console.log(
    //   'Error found!\nOriginal message T:',
    //   t,
    //   '\nT with error: ',
    //   tError
    // );
    return tError;
  }
};

//Accepts a string as a parameter and returns it with a randomly changed char
const changeRandomChar = function (str) {
  const randNumber = Math.round(Math.random() * (str.length - 1));
  const strArr = str.split('');
  strArr[randNumber] = strArr[randNumber] === '0' ? '1' : '0';
  // console.log(`Change at position ${randNumber}`);
  return strArr.join('');
};

const detectTotalErros = function (arr) {
  let errorsDetected = 0;
  for (let i = 0; i < arr.length; i++) {
    if (checkT(arr[i], divisor) !== 1) errorsDetected++;
  }
  return errorsDetected;
};

const printPrecenteges = function () {
  preErrorMess = (totalErrors / numberOfBlocks) * 100;
  preErrorMessDetected = (detectTotalErros(tArrBer) / totalErrors) * 100;
  preErrorMessNotDetected = 100 - preErrorMessDetected;
  console.log(
    `Total messages transmitted: ${numberOfBlocks}\nTotal number of messages containing errors: ${totalErrors}\nPrecentage of messages transmitted with errors: ${preErrorMess.toFixed(
      2
    )}%  `
  );
  console.log(`Detected Errors Precentage: ${preErrorMessDetected}%  `);
  console.log(
    `Precentage of undetected message with error/errors: ${preErrorMessNotDetected}%`
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
  tArrBer.push(transferMessageChannelBer(tArr[i]));
}
// console.log('tArrBer: ', tArrBer);

// for (let i = 0; i < blocksArr.length; i++) {
//   console.log(
//     `${i + 1} D: ${blocksArr[i]} P: ${divisor}  FCS: ${fcsArr[i]}  T: ${
//       tArr[i]
//     }`
//   );
// }

// for (let i = 0; i < tArr.length; i++) {
//   console.log(i + 1, tArr[i], fcsArr[i], checkT(tArrBer[i], divisor), 'here!');
// }

// for (let i = 0; i < tArr.length; i++)
//   console.log(
//     'Before:',
//     tArr[i],
//     'After:',
//     transferChannelBer(tArr[i])
//     //checkT(transferChannelBer(tArr[i]), divisor)
//     //checkT(tArrBer[i], divisor)
//   );

printPrecenteges();
