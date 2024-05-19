'use strict';

/////////////////////////////////////////////////
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

const login = document.querySelector('.login');
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

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const nav = document.querySelector('nav');
const newAccAlert = document.querySelector('.alert__new__acc');
const alertClose = document.querySelector('.icon-cross');

let currentAccount,
  timer,
  newRegisteredAcc,
  convertedAmount,
  convertedDetails,
  loggedIn = false,
  permitNumbers = false;
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// OBJECT ORIENTED PROGRAMMING REMAKE
class Account {
  #movements;
  #pin;
  constructor(
    owner,
    movements,
    interestRate,
    pin,
    movementsDates,
    currency,
    locale
  ) {
    this.owner = owner;
    this.#movements = movements;
    this.interestRate = interestRate;
    this.#pin = pin;
    this.movementsDates = movementsDates;
    this.currency = currency;
    this.locale = locale;
  }

  // ------Account fuctionalities---------

  getPin() {
    return this.#pin;
  }
  getMovements() {
    return this.#movements;
  }

  formatMovementDate(date, locale) {
    const calcDaysPassed = (date1, date2) =>
      Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

    const daysPassed = calcDaysPassed(new Date(), date);
    // console.log(daysPassed); // 1573 1538 1502 1438 1401 11 90 9 6

    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    else {
      // const day = `${date.getDate()}`.padStart(2, 0);
      // const month = `${date.getMonth() + 1}`.padStart(2, 0);
      // const year = date.getFullYear();
      // return `${day}/${month}/${year}`;

      return new Intl.DateTimeFormat(locale).format(date);
    }
  }

  formatCur(value, locale, currency) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  }

  displayMovements(sort = false) {
    containerMovements.innerHTML = '';

    const movs = sort
      ? this.getMovements()
          .slice()
          .sort((a, b) => a - b)
      : this.getMovements();

    if (movs.length === 0) {
      containerMovements.insertAdjacentHTML(
        'afterbegin',
        `<div class="icon__warn__box">
        <svg class="icon icon-warning"><use xlink:href="../img/icons.svg#icon-warning"></use></svg>
        <p class="no__tranc__warn">No transaction history for this account yet</p>
        </div>`
      );
    }

    const movsFunc = function (mov, i) {
      const type = mov > 0 ? 'deposit' : 'withdrawal';
      const date = new Date(this.movementsDates[i]);
      const displayDate = this.formatMovementDate(date, this.locale);

      const formattedMov = this.formatCur(mov, this.locale, this.currency);

      const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
        i + 1
      } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
        </div>
      `;

      containerMovements.insertAdjacentHTML('afterbegin', html);
    }.bind(this);
    movs.forEach(movsFunc);
  }

  calcDisplayBalance() {
    this.balance = this.getMovements().reduce((acc, mov) => acc + mov, 0);
    // labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
    labelBalance.textContent = this.formatCur(
      this.balance,
      this.locale,
      this.currency
    );
  }

  calcDisplaySummary() {
    const incomes = this.getMovements()
      .filter(mov => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    // labelSumIn.textContent = `${incomes.toFixed(2)}€`;
    labelSumIn.textContent = this.formatCur(
      incomes,
      this.locale,
      this.currency
    );

    const out = this.getMovements()
      .filter(mov => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
    // labelSumOut.textContent = `${Math.abs(out.toFixed(2))}€`;
    labelSumOut.textContent = this.formatCur(
      Math.abs(out),
      this.locale,
      this.currency
    );
    const interest = this.getMovements()
      .filter(mov => mov > 0)
      .map(deposit => (deposit * this.interestRate) / 100)
      .filter((int, i, arr) => {
        // console.log(arr);
        return int >= 1;
      })
      .reduce((acc, int) => acc + int, 0);
    labelSumInterest.textContent = this.formatCur(
      interest,
      this.locale,
      this.currency
    );
  }

  updateUI() {
    // Display movements
    this.displayMovements();

    // Display balance
    this.calcDisplayBalance();

    // Display summary
    this.calcDisplaySummary();
  }
}
const newAccsRate = 1.2;
const newAccountData = JSON.parse(localStorage.getItem('formData'));
const newAccsLang = navigator.language;

const account1 = new Account(
  'Jonas Schmedtmann',
  [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  1.2,
  1111,
  [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-02-27T14:43:26.374Z',
    '2024-02-29T18:49:59.371Z',
    '2024-03-03T12:01:20.894Z',
  ],
  'EUR',
  'pt-PT'
);
const account2 = new Account(
  'Jessica Davis',
  [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  1.5,
  2222,
  [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  'USD',
  'en-US'
);

// New Feature
// Creating new account from Bankist site
const createNewAcc = function (
  owner,
  movements,
  interestRate,
  pin,
  movementsDates,
  currency,
  locale
) {
  return new Account(
    owner,
    movements,
    interestRate,
    pin,
    movementsDates,
    currency,
    locale
  );
};

const account3 = createNewAcc(
  `${newAccountData.firstName} ${newAccountData.lastName}`,
  [],
  newAccsRate,
  newAccountData.email,
  [],
  'USD',
  newAccsLang
);
newRegisteredAcc = account3;
const accounts = [account1, account2];

accounts.push(account3);

/////////////////////////////////////////////////
// FUNCTIONS
const createUsername = function () {
  accounts.forEach(acc => {
    const username = acc.owner
      .slice()
      .toLowerCase()
      .split(' ')
      .map(acc => acc[0])
      .join('');

    acc.username = username;
  });
};
createUsername();

// New Feature
const checkDoubleUsername = function () {
  let usernameDoublenum = 0;
  // if (newRegisteredAcc.username
  accounts.map((acc, i) => {
    if (acc !== accounts[accounts.length - 1]) {
      newRegisteredAcc.username === acc.username
        ? (accounts[accounts.length - 1].username = `${
            accounts[accounts.length - 1].username
          }${usernameDoublenum}`)
        : (accounts[accounts.length - 1].username =
            accounts[accounts.length - 1].username);
    }
  });

  usernameDoublenum++;
};
checkDoubleUsername();

const initInputs = function () {
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
  inputTransferAmount.value = inputTransferTo.value = '';
  inputLoanAmount.value = '';
  inputCloseUsername.value = inputClosePin.value = '';
};

const hideUI = function () {
  // Clear input fields
  initInputs();
  labelWelcome.textContent = `Log in to get started`;
  containerApp.style.opacity = 0;
};

// New Feature
// Function to fetch conversion rate
async function getConversionRate(baseCurrency, targetCurrency) {
  const apiKey = '4b1bb641f007911d17a62540'; // Replace 'YOUR_API_KEY' with your actual API key
  const apiUrl = ` https://v6.exchangerate-api.com/v6/4b1bb641f007911d17a62540/latest/${baseCurrency}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // console.log(data);

    if (data.error) {
      throw new Error(data.description);
    }

    const rate = data.conversion_rates[targetCurrency];

    if (!rate) {
      throw new Error(`Conversion rate for ${targetCurrency} not found.`);
    }

    return rate;
  } catch (error) {
    console.error('Error fetching conversion rate:', error.message);
    return null;
  }
}

// console.log(account1.username, account2.username);

const startLogOutTimer = function () {
  // Set time to 10 minutes
  let time = 600;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}: ${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
      containerApp.style.opacity = 0;
      loggedIn = false;
    }

    // Decrease 1s
    time--;
  };

  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// New feature
// 6. creating new account alert
const switchAlert = function () {
  if (!newAccAlert.classList.contains('hidden')) {
    const alertHeight = newAccAlert.getBoundingClientRect().height;
    nav.style.marginTop = `${alertHeight}px`;
  } else {
    nav.style.marginTop = '0px';
  }
};

const alertNewAcc = function (username, pin) {
  const alertMessage = `
  <h3 class="alert__message">
    Success! your new account username and pin are '${username}' and '${pin}'
  </h3>
  <svg class="icon icon-cross">
    <use xlink:href="../img/icons.svg#icon-cross"></use>
  </svg>
`;
  newAccAlert.insertAdjacentHTML('beforeend', alertMessage);

  switchAlert();
};
alertNewAcc(newRegisteredAcc.username, newRegisteredAcc.getPin());

const alphabetsOnly = function (event) {
  // Get the ASCII code of the pressed key
  const keyCode = event.keyCode;

  accounts.forEach(acc => {
    if (
      /\d/.test(acc.username) === true &&
      keyCode >= 48 &&
      keyCode <= 57 &&
      this.value ===
        acc.username
          .split('')
          .filter(letter => isNaN(letter))
          .join('')
    ) {
      permitNumbers = true;
    }
    if (
      this.value === acc.username ||
      this.value.length - 1 === acc.username.length - 1
    )
      permitNumbers = false;
  });

  // Allow alphabetical characters: A-Z and a-z
  if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122)) {
    return true;
  } else if (permitNumbers === true) {
    return true;
  } else {
    // Prevent the default action of the key press
    event.preventDefault();
    return false;
  }
};

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
  // modal.innerHTML = '';
};

const modalPopup = function (e, html) {
  modal.innerHTML = '';
  modal.insertAdjacentHTML(
    'afterbegin',
    `<button class="btn--close-modal">&times;</button>`
  );
  const btnCloseModal = document.querySelector('.btn--close-modal');
  btnCloseModal.addEventListener('click', closeModal);
  modal.insertAdjacentHTML('beforeend', html);
  openModal(e);
};

// -------New features-------
// 1. use show modal component to display new username and pin -> from marketing site
// initialize popup for newly created account from bankist site
modal.insertAdjacentHTML(
  'beforeend',
  `<h3 class="modal__heading">Your new Account has been created!</h3>
<p class="modal__text">Your username and pin are <em>${
    newRegisteredAcc.username
  }</em> and <em>${newRegisteredAcc.getPin()}</em></p>`
);

// //////////////////////////

const getModalHeadingBox = function (iconNum, headingText, style) {
  return `<div class="modal__heading__box">
  <div class="modal__heading__icon modal__heading__icon__${iconNum}">
    <svg class="icon icon-${style}">
      <use xlink:href="../img/icons.svg#icon-${style}"></use>
    </svg>
  </div>
  <h3 class="modal__heading">${headingText}!</h3>
</div>`;
};
// New Feature
// 7. use show modal component to show failed login
//  failed login popup
const getFailedLoginorAccCloseHTML = function (iconNum, action) {
  const wrongInput = `Could not ${action}! Please check that the username and/or pin provided are accurate`;

  let message;
  const getMessage = function (input1, input2) {
    if (input1 === '' && input2 === '')
      message = `No username or pin inputed! Please input your username and pin!`;
    else message = wrongInput;
  };

  if (loggedIn === false) {
    getMessage(inputLoginUsername.value, inputLoginPin.value);
  } else {
    getMessage(inputCloseUsername.value, inputClosePin.value);
  }

  return `${getModalHeadingBox(iconNum, 'failed', 'cross')}
      <p class="modal__text">${message}</p>`;
};

///////////////////////////////////////
// EVENT HANDLERS

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (
    currentAccount?.getPin() ===
    (typeof currentAccount?.getPin() === 'number'
      ? +inputLoginPin.value
      : inputLoginPin.value)
  ) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, '0');
    // const min = `${now.getMinutes()}`.padStart(2, '0');
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Experimenting API -> Intl
    // Search -> Iso Language Code Table -> Lingoes http://www.lingoes.net › translator › langcode
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };

    // getting locale
    const locale = navigator.language;
    // console.log(locale); // 'en-US'

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    initInputs();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    currentAccount.updateUI();

    // login.style.display = 'none';
    // nav.classList.add('logged__in');

    loggedIn = true;
  } else {
    modalPopup(e, getFailedLoginorAccCloseHTML(2, `login`));
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount.displayMovements(!sorted);
  sorted = !sorted;
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // New feature
  // Doing successful and failed transfer popup

  const getSuccessTranfHTML = function (iconNum) {
    return `${getModalHeadingBox(iconNum, 'Success', 'checkmark')}
  <p class="modal__text">Your transfer of <em>${amount}${
      currentAccount.currency
    }${convertedDetails ? convertedDetails : ''}</em> has been sent to <em>${
      receiverAcc.owner
    } </em></p>`;
  };

  const getFailedTranfHTML = function (iconNum) {
    return `${getModalHeadingBox(iconNum, 'Failed', 'cross')}
  <p class="modal__text">Your transfer ${
    inputTransferAmount.value !== '' ? `of <em>${amount}</em>` : ''
  }<em>${
      inputTransferAmount.value !== '' ? currentAccount.currency : ''
    }</em> was declined. To troubleshoot please check that: </p>
      <ul class="tranf__failed__list">
      <li class="transf__failed__item">
        the amount is valid(i.e the amount is greater than zero or is not
        above your account balance)
      </li>
      <li class="transf__failed__item">
        the receiver's username is correct!
      </li>
      <li class="transf__failed__item">you are not sending to yourself(using your own username)</li>
    </ul>
    `;
  };

  const getFailedConvertCurHTML = function (iconNum) {
    return `${getModalHeadingBox(iconNum, 'Failed', 'cross')}
  <p class="modal__text">Could not get conversion rates! Please check that you have a stable internet connection and try again. </p>`;
  };

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Using the currency conversion
    // Example usage
    const baseCurrency = currentAccount.currency;
    const targetCurrency = receiverAcc.currency;

    // Do not do this -> you want this stored in a function not in a variable so that the convertedDetaols variable do not get executed immediately but only when the fuction is called
    /*
    const successTransfHTML = `<div class="modal__heading__box">
    <div class="modal__heading__icon">
      <svg class="icon icon-checkmark">
        <use xlink:href="#icon-checkmark"></use>
      </svg>
    </div>
    <h3 class="modal__heading">Success!</h3>
  </div>
  <p class="modal__text">Your transfer of <em>${amount}${
      currentAccount.currency
    }${convertedDetails ? convertedDetails : ''}</em> has been sent to <em>${
      receiverAcc.owner
    } </em></p>`;
    */

    if (baseCurrency !== targetCurrency) {
      getConversionRate(baseCurrency, targetCurrency).then(rate => {
        if (rate !== null) {
          convertedAmount = amount * rate;
          receiverAcc.getMovements().push(convertedAmount);

          // Successful transfer message
          convertedDetails = `(${convertedAmount}${receiverAcc.currency})`;

          modalPopup(e, getSuccessTranfHTML(1));
          inputTransferAmount.value = inputTransferTo.value = '';

          // Doing the transfer
          currentAccount.getMovements().push(-amount);
          // Update UI
          currentAccount.updateUI();
        } else {
          modalPopup(e, getFailedConvertCurHTML(2));
          console.log('Failed to fetch conversion rate.');
        }
      });
    } else {
      convertedDetails = '';
      modalPopup(e, getSuccessTranfHTML(1));
      inputTransferAmount.value = inputTransferTo.value = '';

      receiverAcc.getMovements().push(amount);

      // Doing the transfer
      currentAccount.getMovements().push(-amount);
    }

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    currentAccount.updateUI();

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  } else {
    // 2. use show modal component to explain failed transfer
    modalPopup(e, getFailedTranfHTML(2));
    inputTransferAmount.value = inputTransferTo.value = '';
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  // New Feature
  // 5. use show modal component for sucessful and failxed loans
  if (
    amount > 0 &&
    currentAccount.getMovements().some(mov => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      // display modal - successful loan
      const getSuccessLoanHTML = function (iconNum) {
        return `${getModalHeadingBox(iconNum, 'Success', 'checkmark')}
      <p class="modal__text">Your Loan of <em>${amount}${
          currentAccount.currency
        }</em> was successful!</p>`;
      };

      modalPopup(e, getSuccessLoanHTML(1));

      // Add movement
      currentAccount.getMovements().push(amount);

      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      currentAccount.updateUI();
    }, 2500); // wait 2.5 seconds before updating UI
  } else {
    const getFailedLoanHTML = function (iconNum) {
      return `${getModalHeadingBox(iconNum, 'Failed', 'cross')}
    <p class="modal__text">Your loan ${
      inputLoanAmount.value !== '' ? `of <em>${amount}</em>` : ''
    }<em>${
        inputLoanAmount.value !== '' ? currentAccount.currency : ''
      }</em> was declined. To troubleshoot please check that:
    <ul class="tranf__failed__list">
      <li class="transf__failed__item">the amount is valid(i.e the amount is greater than zero) 
      </li>
      <li class="transf__failed__item"> you have made a transaction from your transaction history, to which 10% of the amount deposited or withdrawn is equal or greater than the current loan amount</p>
      </li>
    </ul>`;
    };
    modalPopup(e, getFailedLoanHTML(2));
  }
  inputLoanAmount.value = '';

  // Reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    currentAccount?.getPin() ===
      (typeof currentAccount?.getPin() === 'number'
        ? +inputClosePin.value
        : inputClosePin.value)
  ) {
    // New Feature
    // 5. use show modal component for confirmation of close of account
    const confirmCloseAccHTML = `<h3 class="modal__heading">Confirm close of account</h3>
    <p class='modal__text'>Are you sure you want to close this account?</p>
    <div class="close-account-btn-box">
    <button class="btn btn-cancel">Cancel</button>
    <button class="btn btn-close-acc">Yes</button>
    </div>
    `;
    modalPopup(e, confirmCloseAccHTML);

    const btnCancel = document.querySelector('.btn-cancel');
    const btnCloseAcc = document.querySelector('.btn-close-acc');

    btnCloseAcc.addEventListener('click', function () {
      const index = accounts.findIndex(
        acc => acc.username === currentAccount.username
      );
      // console.log(index);
      // .indexOf(23)

      // Delete account
      accounts.splice(index, 1);

      // Hide UI
      hideUI();

      // close modal
      closeModal();

      // Switch alert off if new registered account has been closed
      if (!accounts.some(acc => acc === newRegisteredAcc)) {
        newAccAlert.classList.add('hidden');
        switchAlert();
      }

      loggedIn = false;
    });

    btnCancel.addEventListener('click', closeModal);
  } else {
    modalPopup(e, getFailedLoginorAccCloseHTML(2, `close this account`));
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

newAccAlert.addEventListener('click', function (e) {
  const clicked = e.target.closest('.icon-cross');
  if (!clicked) return;

  this.classList.add('hidden');
  switchAlert();
});

inputTransferTo.addEventListener(
  'keypress',
  alphabetsOnly.bind(inputTransferTo)
);
inputCloseUsername.addEventListener(
  'keypress',
  alphabetsOnly.bind(inputCloseUsername)
);
inputLoginUsername.addEventListener(
  'keypress',
  alphabetsOnly.bind(inputLoginUsername)
);
// Extra Features I intend to include
// 3. use show modal component to open new account
// 4. logging out

console.log(accounts);
