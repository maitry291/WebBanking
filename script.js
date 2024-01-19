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
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-01-15T17:01:17.194Z',
    '2024-01-16T23:36:17.929Z',
    '2024-01-18T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

function formatMovementDate(date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed == 0) return `Today`;
  if (daysPassed == 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  return Intl.DateTimeFormat(locale).format(date);
}

function formatMovements(num, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(Math.abs(num));
}

const displayMovements = function (currAcc, sort = false) {
  containerMovements.innerHTML = ``;

  const newMovementsArr = sort
    ? currAcc.movements.slice().sort((a, b) => a - b)
    : currAcc.movements;

  newMovementsArr.forEach(function (mov, i) {
    const date = new Date(currAcc.movementsDates[i]);
    const displayDate = formatMovementDate(date, currAcc.locale);
    const formattedMov = formatMovements(mov, currAcc.locale, currAcc.currency);
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const htmlEleCode = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', htmlEleCode);
  });
};

const calcBalance = function (acc) {
  const balance = acc.movements.reduce((accum, curr) => accum + curr, 0);
  acc.balance = balance;
  labelBalance.textContent = formatMovements(
    balance,
    currAcc.locale,
    currAcc.currency
  );
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

  labelSumIn.textContent = formatMovements(
    income,
    currAcc.locale,
    currAcc.currency
  );
  labelSumOut.textContent = formatMovements(
    outcome,
    currAcc.locale,
    currAcc.currency
  );
  labelSumInterest.textContent = formatMovements(
    interest,
    currAcc.locale,
    currAcc.currency
  );
};

function updateUI(currAcc) {
  displayMovements(currAcc);
  calcBalance(currAcc);
  calcDisplaySummary(currAcc);
}

function logOutUser() {
  containerApp.style.opacity = 0;
  labelWelcome.textContent = `Log in to get started`;
}

//fake login
currAcc = account1;
containerApp.style.opacity = 100;
updateUI(currAcc);

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

    const now = new Date();
    const options = {
      // weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    // const locale = navigator.language;
    labelDate.textContent = Intl.DateTimeFormat(currAcc.locale, options).format(
      now
    );

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

    //update dates array
    currAcc.movementsDates.push(new Date().toISOString());
    toAccount.movementsDates.push(new Date().toISOString());
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
  const requetsedLoan = Math.floor(inputLoanAmount.value); //floor converts it in number
  inputLoanAmount.value = ``;
  if (
    requetsedLoan > 0 &&
    currAcc.movements.some(deposit => deposit >= 0.1 * requetsedLoan)
  ) {
    //approve loan and deposit money
    currAcc.movements.push(requetsedLoan);
    //update dates array
    currAcc.movementsDates.push(new Date().toISOString());
    updateUI(currAcc);
  }
});

//sorting movements feature
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currAcc, !sorted);
  sorted = !sorted;
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
