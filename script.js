const title = document.getElementsByClassName("title")[0];
const desc = document.getElementsByClassName("description")[0];
const image = document.getElementById("current-image");
const search = document.getElementById("search-form");
const searchedValues = document.getElementById("searched-values");
const apiKey = "neT9QnUQd0DoPvLuS5Lee2c3tht1X9il3UgbmSxB";
// console.log(date);
let historyId = 1;
//Function to fetchData
async function fetchdata(date) {
  let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}&thumbs=true`;

  await fetch(url, { method: "GET" }).then(async (data) => {
    await data
      .json()
      .then((data) => {
        if (data.hasOwnProperty("error")) {
          throw new Error(data.error.message);
        } else {
          addDataToUI(data);
        }
      })
      .catch((error) => {
        alert(error);
      });
  });
}

//Function to add data into ui
function addDataToUI(data) {
  console.log(data);
  if(data.thumbnail_url)
  {
    image.src = `${data.thumbnail_url}`;
  }
  else{
    image.src = `${data.url}`;
  }
  title.innerText = `${data.title}`;
  desc.innerText = `${data.explanation}`;
}

//Function to get current image of the day
function getCurrentImageOfTheDay() {
  const date = new Date().toISOString().split("T")[0];
  fetchdata(date);
}

function getImageOfTheDay(element) {
  let value = "";
  Array.from(element).forEach((val) => {
    if (val.type === "date") {
      value = val.value;
    }
  });
  fetchdata(value);
  saveSearch(value);
}

function saveSearch(value) {
  let dates = [];

  if(localStorage.getItem("Dates"))
  {
        let tempDates = localStorage.getItem("Dates");
        tempDates = JSON.parse(tempDates);
        tempDates.push(value);
        localStorage.setItem("Dates",JSON.stringify(tempDates));
  }
  else{
    dates.push(value);
    localStorage.setItem("Dates",JSON.stringify(dates));

  }
  addDatatoHistory();
}

function addDatatoHistory() {
  let tempDates = localStorage.getItem("Dates");
  tempDates = JSON.parse(tempDates);
  searchedValues.innerHTML = "";
  tempDates.forEach(val =>{
     let li = document.createElement("li");
     li.innerText = val;
     li.addEventListener("click", (e)=>{
        fetchdata(e.target.innerText);
     });
     searchedValues.appendChild(li);
  })
}

search.addEventListener("submit", (e) => {
  e.preventDefault();
  let element = e.target.children;
  getImageOfTheDay(element);
});

getCurrentImageOfTheDay();
