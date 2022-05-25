'use strict';

const numberOfBlocks = 10;
const blockSize = 20; //K
const divisor = 110101; //P
const ber = 10 ** -1; //BER

const xor = function (a, b) {
  let result = '';
  for (let i = 0; i < `${a}`.length; i++) {
    if (a[i] === b[i]) result += '0';
    else result += '1';
  }
  return result;
};

const computeFCS = function (dividend, divisor) {
  //Adding the necessary Zeros to the dividend before proceeding with the division (T=2^(n-k)D)
  const zerosToAppend = divisor.length - 1;
  for (let i = 0; i < zerosToAppend; i++) dividend += '0';

  // Number of bits to be XORed at a time.
  console.log(`We  appended: ${zerosToAppend} mhdenika ston diairetaio`);

  let pick = divisor.length;
  console.log(
    '--------------------------\nBinary division (modulo-2)\n--------------------------'
  );

  console.log(`Divisor: ${divisor}\nDividend: ${dividend}`);
  console.log(
    `Length of the divisor is: ${pick}\nLength of the divvidend is: ${dividend.length}`
  );

  //Slicing the dividend to appropriate length for particular step
  let tmp = dividend.slice(0, pick);

  let j = 1;

  while (pick < dividend.length) {
    if (tmp[0] === '1') {
      tmp = xor(divisor, tmp) + dividend[pick];
      if (tmp[0] === '0') tmp = tmp.slice(1);
      //console.log(`fc --> tmp: ${tmp}, ${typeof tmp}`);
    } else {
      tmp = tmp.slice(1) + dividend[pick];
      //tmp = xor('0'.repeat(pick), tmp) + dividend[pick];
      //console.log(`sc --> tmp: ${tmp}, ${typeof tmp}`);
    }
    //console.log(`Loop number ${j} ${tmp}`);
    //console.log('here!');
    pick += 1;
    j++;
  }
  //console.log(tmp);
  if (tmp[0] === '1') tmp = xor(divisor, tmp);
  // } else {
  //   tmp = xor('0'.repeat(pick), tmp);
  // }

  const res = tmp;
  return res.slice(1);
};

const remainder5 = computeFCS('1010001101000001', divisor.toString());
//const remainder = computeFCS('100100000', '1101');
//const remainder3 = computeFCS('1010001101000001', '110101');
//const remainder4 = computeFCS('10101001111101', '100101');
//const remainder6 = computeFCS('10010', '11');
//const remainder2 = computeFCS('00010100010001111100', '110101');
console.log('Remainder: ', remainder5, typeof remainder5);
//console.log(xor('1111', '0101'));
// computeFCS('101110110100000', '110101');

const createBlock = function (k) {
  let block = '';
  for (let i = 0; i < k; i++) {
    //console.log(i);
    let randomNumber = Math.random() >= 0.5 ? 1 : 0;
    block += randomNumber;
  }
  //console.log(block, block.length, typeof block);
  return block;
};

//console.log(createBlock(10));
const blocksArr = [];
for (let i = 0; i < numberOfBlocks; i++) {
  blocksArr.push(createBlock(blockSize));
}
console.log(blocksArr);

const fcsArr = [];
for (let i = 0; i < blocksArr.length; i++) {
  fcsArr.push(computeFCS(blocksArr[i].toString(), divisor.toString()));
}
console.log(fcsArr);

const tArr = [];
for (let i = 0; i < blocksArr.length; i++) {
  tArr.push(blocksArr[i] + fcsArr[i]);
}
console.log(tArr);
// console.log(typeof tArr[0]);

//Takes message T (block*2n-k + CRC)
const checkT = function (t, p) {
  const remainder = computeFCS(t.toString(), p.toString());
  if (parseInt(remainder) === 0) {
    console.log('Finally we did it');
  } else console.log('wtf');
};

for (let i = 0; i < blocksArr.length; i++) {
  console.log(
    `${i + 1} D: ${blocksArr[i]} P: ${divisor}  FCS: ${fcsArr[i]}  T: ${
      tArr[i]
    }`
  );
}

for (let i = 0; i < tArr.length; i++) {
  console.log(i + 1, tArr[i], fcsArr[i], checkT(tArr[i], divisor));
}

const transferChannelBer = function (t) {
  const berPrecentage = ber * 100;
  const randomNumber = Math.random() * 100;
  const error = randomNumber <= berPrecentage ? true : false;

  console.log(
    `BER Precentage: ${berPrecentage}%\nrandomNumber: ${randomNumber}`
  );
  console.log('Error: ', error);
};

transferChannelBer(10);

/*
 To do:
 1) Create function to check if a message T is transported correctly to the receiver DONE 
 2) Refactor Code
 3) Set Up Github
*/
