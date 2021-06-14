let currentPayment = {
  id: "cold-water",
  meterId: null,
  previous: null,
  current: null,
  amount: null,
};

let payments = [];
// let totalPayment = 0;

const tariffs = {
  taxes: 0.9,
  coldWater: 1.5,
  internet: 3.7,
  security: 5,
  exchange: 0.2,
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
  payments.push(currentPayment);
  countCosts();
  
  console.log(payments);
  
  showPayment();
  currentPayment = {
    id: "cold-water",
    meterId: null,
    previous: null,
    current: null,
  };
  
  previousMeterValue.value ="";
  currentMeterValue.value ="";
  meter.selectedIndex = 0;
  document.getElementById("save-button").disabled = true;
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
  
  const totalField = document.getElementById("meter-payment-total");
  totalField.innerText = totalPayment;
}


const clearButton = document.getElementById("clear-button");
clearButton.onclick = function() {
  payments = [];
  
  const paymentFields = document.getElementById("payment-fields");
  paymentFields.innerText = "";
  
  document.getElementById("meter-payment-total").innerText = "0";
};
