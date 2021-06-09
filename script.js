let currentPayment = {
  id: "cold-water",
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

const sidebar = document.getElementById("sidebar");

sidebar.onclick = function (event) {
  if (event.target.tagName === 'BUTTON') {
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
