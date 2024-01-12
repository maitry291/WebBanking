'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currAcc;
const createUserNames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);

const displayMovements = function (movementsArr) {
  containerMovements.innerHTML = ``;

  movementsArr.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const htmlEleCode = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">Rs. ${Math.abs(mov)}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', htmlEleCode);
  });
};

const calcBalance = function (acc) {
  const balance = acc.movements.reduce((accum, curr) => accum + curr, 0);
  acc.balance = balance;
  labelBalance.textContent = `Rs. ${balance}`;
};

const calcDisplaySummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((accum, curr) => accum + curr);
  const outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((accum, curr) => accum + curr, 0);
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .reduce((accum, int) => accum + int, 0);

  labelSumIn.textContent = `Rs. ${income}`;
  labelSumOut.textContent = `Rs. ${Math.abs(outcome)}`;
  labelSumInterest.textContent = `Rs. ${interest}`;
};

function updateUI(currAcc) {
  displayMovements(currAcc.movements);
  calcBalance(currAcc);
  calcDisplaySummary(currAcc);
}

function logOutUser() {
  containerApp.style.opacity = 0;
  labelWelcome.textContent = `Log in to get started`;
}

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //prevents form from submitting
  const userName = inputLoginUsername.value;
  currAcc = accounts.find(acc => acc.userName === userName);
  //compare entered pin with the correct pin
  if (currAcc?.pin === Number(inputLoginPin.value)) {
    //login success
    console.log(`login success`);
    console.log(currAcc);
    //clear login credentials
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //dsiplay UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currAcc.owner.split(' ')[0]}`;
    //display app container
    containerApp.style.opacity = 1;
    updateUI(currAcc);
  } else {
    //login failed --wrong pin entered
    console.log(`wrong pin`);
  }
});

//transfer money feature
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const toAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  //clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  // amount;
  if (
    amount > 0 &&
    toAccount &&
    amount <= currAcc.balance &&
    toAccount?.userName !== currAcc.userName
  ) {
    console.log(`transfer valid`);
    //now debit amount from currAcc and deposit in toAcc
    currAcc.movements.push(0 - amount);
    toAccount.movements.push(amount);
    updateUI(currAcc);
  } else {
    console.log(`enter correct amount`);
  }
});

//close account feature
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername?.value === currAcc.userName &&
    Number(inputClosePin?.value) === currAcc.pin
  ) {
    //perform deletion from accounts array
    const removeIdx = accounts.findIndex(
      acc => acc.userName === currAcc.userName
    );
    console.log(removeIdx);
    accounts.splice(removeIdx, 1);
    //log out user
    inputCloseUsername.value = inputClosePin.value = ``;
    logOutUser();
  }
});

//request loan feature
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const requetsedLoan = Number(inputLoanAmount.value);
  inputLoanAmount.value = ``;
  if (
    requetsedLoan > 0 &&
    currAcc.movements.some(deposit => deposit >= 0.1 * requetsedLoan)
  ) {
    //approve loan and deposit money
    currAcc.movements.push(requetsedLoan);
    updateUI(currAcc);
  }
});

// const rupeeToUSD = 82.91;
// const totalDepositsUsd = function (movements) {
//   return movements
//     .filter(mov => mov > 0)
//     .map(mov => mov * rupeeToUSD)
//     .reduce((accum, curr) => accum + curr, 0);
// };
// console.log(totalDepositsUsd(account1.movements));

/*
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const arr = [1, 2, 3, 4, 5, 6];

//slice method -creates new array, doesn't change the existing
console.log(arr.slice(3,5));
console.log(arr.slice(-3)); //last 3 elements of the array
console.log(arr.slice(2,-3)); //from 2nd index till 3rd last index

//splice method - mutates the array by remaining elements 
console.log(arr.splice(3)); //[4,5,6] means this method deletes elements from 3rd index from arr
console.log(arr);  //[1,2,3]

//reverse
console.log(arr.reverse());  //mutates/changes original array
console.log(arr);

//concat
console.log(arr.concat([4,5])); //doesn't mutate original array

//join
console.log(arr.join(',')); 
console.log(arr); //not changed

//at method - works in both strings and array
console.log(arr.at(0));
//negative index allowed same as working in slice method
console.log(arr.at(-1)); //prints last element
*/
