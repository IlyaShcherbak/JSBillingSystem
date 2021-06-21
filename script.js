let currentPayment = {
  id: "cold-water",
  meterId: null,
  previous: null,
  current: null,
  amount: null,
};

const tariffs = {
  taxes    : 0.9,
  coldWater: 1.5,
  internet : 3.7,
  security : 5,
  exchange : 0.2,
}

let categories = [
  {
    id   : "taxes",
    label: "Налоги",
    total: 0,
  },
  {
    id   : "cold-water",
    label: "Холодная вода",
    total: 0,
  },
  {
    id   : "internet",
    label: "Интернет",
    total: 0,
  },
  {
    id   : "security",
    label: "Охрана",
    total: 0,
  },
  {
    id   : "exchange",
    label: "Обмен валют",
    total: 0,
  },
];

let payments = [];
let balance = 300;
let savedTotal = 0;

reloadUpdate();

console.log(localStorage);


function reloadUpdate() {
  if (localStorage.getItem("payments")) {
    payments = JSON.parse(localStorage.getItem("payments"));
    console.log("payments " + localStorage.getItem("payments"));
    document.getElementById("cold-water-checkbox").disabled = false;
  }
  
  if (!document.getElementById("payment-fields").innerText && localStorage.getItem("paymentFields")) {
    document.getElementById("payment-fields").innerText = JSON.parse(localStorage.getItem("paymentFields"));
  }
  
  if (document.getElementById("meter-payment-total").innerText === "0" && localStorage.getItem("paymentTotal")) {
    document.getElementById("meter-payment-total").innerText = JSON.parse(localStorage.getItem("paymentTotal"));
  }
  
  if (localStorage.getItem("categories")) {
    categories = JSON.parse(localStorage.getItem("categories"));
    console.log("categories " + categories);
  }
  
  if (localStorage.getItem("balance")) {
    balance = +localStorage.getItem("balance");
    console.log("balance " + balance);
  }
  
  if (localStorage.getItem("statusMessages") && localStorage.hasOwnProperty("isError")) {
    document.getElementById("payment-state").innerText = localStorage.getItem("statusMessages");
    document.getElementById("payment-state").classList.add("green-text");
    
    if (localStorage.getItem("isError") === "true"){
      document.getElementById("payment-state").classList.add("red-text"); //?
    }
  }
  
  savedTotal = +localStorage.getItem("paymentTotal");
  document.getElementById("meter-payment-total").innerText = savedTotal;
  console.log(`saved total `+ savedTotal);
  console.log("is error " + localStorage.getItem("isError"), typeof(localStorage.getItem("isError")));

}



const errorMessages = {
  invalidZero: "Вводимые значения должны быть больше 0",
  invalidCurrentValue: "Текущие показания должны быть больше предыдущих",
};
let errorMessage = "";

const sidebar = document.getElementById("sidebar");
sidebar.onclick = function (event) {
  if (event.target.tagName === "BUTTON") {
    const clickedElementID = event.target.id;
    
    if(clickedElementID !== currentPayment.id){
      setSelectedSidebarItem(clickedElementID);
  
      showContentById(clickedElementID);
      
      currentPayment.id = clickedElementID;
    }
  }
}


function setSelectedSidebarItem(id) {
  document.getElementById(currentPayment.id).classList.remove('selected');
  document.getElementById(id).classList.add('selected');
}

function showContentById(id) {
  let currentContent = document.getElementById(currentPayment.id + '-content');
  // if (currentContent === null) {
  //   currentContent = document.getElementById("no-content");
  // }
  currentContent.classList.add("d-none");
  
  let clickedElementContent = document.getElementById(id + "-content");
  // if (clickedElementContent === null) {
  //   clickedElementContent = document.getElementById("no-content");
  // }
  clickedElementContent.classList.remove("d-none");
  
  // const clickedElementTitle = document.getElementById(id).innerText;
  // clickedElementContent.getElementsByClassName("title")[0].innerText = clickedElementTitle;
}

const meter = document.getElementById("utility-meter");
meter.onclick = function () {
  const selectedOptionText = meter.options[meter.selectedIndex].text;
  
  if(currentPayment.meterId !== selectedOptionText) {
    currentPayment.meterId = selectedOptionText;
    checkButtonState();
  }
}


const previousMeterValue = document.getElementById("previous-meter-value");
previousMeterValue.onchange = function (event) {
  const value = event.target.value;
  
  currentPayment.previous = +value;
  validate();
};


const currentMeterValue = document.getElementById("current-meter-value");
currentMeterValue.onchange = function (event) {
  const value = event.target.value;
  
  currentPayment.current = +value;
  validate();
};


function validate() {
  errorMessage = "";
  
  if (currentPayment.previous !== null && currentPayment.previous < 1) {
    previousMeterValue.classList.add("invalid");
    errorMessage = errorMessages.invalidZero;
  }
  if (currentPayment.current !== null && currentPayment.current < 1) {
    currentMeterValue.classList.add("invalid");
    errorMessage = errorMessages.invalidZero;
  }
  if (currentPayment.current !== null && currentPayment.current < currentPayment.previous) {
    currentMeterValue.classList.add("invalid");
    errorMessage = errorMessages.invalidCurrentValue;
  }
  if (!errorMessage) {
    previousMeterValue.classList.remove("invalid");
    currentMeterValue.classList.remove("invalid");
  }
  
  document.getElementById("error-message").innerText = errorMessage;
  checkButtonState();
}

function checkButtonState() {
  const button = document.getElementById("save-button");
  const isValid = !errorMessage && currentPayment.meterId && currentPayment.previous && currentPayment.current;
  button.disabled = !isValid;
  // button.disabled = !(!errorMessage && currentPayment.meterId && currentPayment.previous && currentPayment.current);
}


const saveButton = document.getElementById("save-button");
saveButton.onclick = function () {
  localStorage.removeItem("payments");
  payments.push(currentPayment);
  countCosts();
  
  showPayment();
  currentPayment = {
    id: "cold-water",
    meterId: null,
    previous: null,
    current: null,
  };
  
  localStorage.setItem("payments", JSON.stringify(payments));
  
  const paymentFields = document.getElementById("payment-fields").innerText;
  localStorage.setItem("paymentFields", JSON.stringify(paymentFields))
  
  previousMeterValue.value ="";
  currentMeterValue.value ="";
  meter.selectedIndex = 0;
  document.getElementById("save-button").disabled = true;
  
  document.getElementById("cold-water-checkbox").disabled = false;
};


function countCosts() {
  currentPayment.amount = (currentPayment.current - currentPayment.previous) * tariffs.coldWater;
}

function showPayment() {
  const text = document.createElement("p");
  text.innerText = `${currentPayment.meterId} $ ${currentPayment.amount}`;
  
  const paymentFields = document.getElementById("payment-fields");
  paymentFields.appendChild(text);
  
  const initialValue = 0;
  const totalPayment = payments.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.amount;
  }, initialValue);
  
  categories.find(category => category.id === currentPayment.id).total = totalPayment + savedTotal;//!!!!!!!!!!!!!!!!!!
  console.log("categories after save btn"+ categories);
  localStorage.setItem("categories", JSON.stringify(categories));
  
  localStorage.setItem("paymentTotal", JSON.stringify(totalPayment));
  
  
  const totalField = document.getElementById("meter-payment-total");
  console.log(totalPayment, savedTotal);
  totalField.innerText = totalPayment ;
}


const clearButton = document.getElementById("clear-button");
clearButton.onclick = function() {
  payments = [];
  
  const paymentFields = document.getElementById("payment-fields");
  paymentFields.innerText = "";
  
  document.getElementById("meter-payment-total").innerText = "0";
  localStorage.clear();
  console.log(localStorage);
};


function payCategory(category) {
  const isCategorySelected = document.getElementById(`${category.id}-checkbox`).checked;
  const messages = {
    paymentMessage: "",
    statusMessage : "",
    isError: false,
  }
  
  if (isCategorySelected && balance>= category.total) {
    balance = balance - category.total;
    console.log(balance, category.total);
    localStorage.setItem("balance", JSON.stringify(balance));
  
    messages.paymentMessage = `${category.id}: оплачено`;
    messages.statusMessage = `${category.label}: успешно оплачено`;
    messages.isError = false;
    
    category.total = 0;
    
    localStorage.setItem("isError", JSON.stringify(messages.isError));
    return messages;
  }
  if (isCategorySelected && balance < category.total) {
    messages.paymentMessage = `${category.id}: не оплачено`;
    messages.statusMessage  = `${category.label}: ошибка транзакции`;
    
    messages.isError = true;
    
    localStorage.setItem("isError", JSON.stringify(messages.isError));
    return messages;
  }
}

const payButton = document.getElementById("pay-button");
payButton.onclick = function() {
  let payMessage = "";
  let paymentStatesMessage = "";
  
  const paymentStates = document.getElementById("payment-state");
  const paymentStatesContent = document.createElement("p");
  paymentStatesContent.classList.add("green-text");
  
  categories.forEach(category => {
    const selectedCategory = payCategory(category);
    if (selectedCategory) {
      payMessage = payMessage + selectedCategory.paymentMessage + "\n";
      paymentStatesMessage = paymentStatesMessage + selectedCategory.statusMessage + "\n"
      
      if (selectedCategory.isError) {
        paymentStatesContent.classList.add("red-text");
      }
    }
  });
  console.log(payMessage);
  
  localStorage.setItem("statusMessages", paymentStatesMessage);
  
  paymentStatesContent.innerText = paymentStatesMessage;
  paymentStates.appendChild(paymentStatesContent);
  
  
  const noPaymentsLeft = categories.every(categoryTotal => categoryTotal.total === 0);
  console.log("noPaymentsLeft " + noPaymentsLeft);
  if (noPaymentsLeft) {
    localStorage.clear();
  }
  
};
