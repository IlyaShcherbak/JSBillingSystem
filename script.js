let currentPayment = {
  id: "cold-water",
  meterId: "",
  previous: null,
  current: null,
};

const payments = [
  {
    id: "cold-water",
    meterId: "ДС 949321",
    current: 246.791,
    previous: 231.408,
    amount: 20,
  }
];

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
    console.log(currentPayment);
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
  
  if (currentPayment.previous !== null &&currentPayment.previous < 1) {
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
}
