var dropdown1 = document.getElementById("dropdown1");
var dropdown2 = document.getElementById("dropdown2");
var div = document.getElementById("div_to_change");
var btn = document.getElementById("search_btn");

function populateSelectFromJSON(selectId) {
  const select = document.getElementById(selectId);

  fetch('assets/json/locations.json')
  .then(response => response.json())
  .then(data => {
    data.locations.forEach(location => {
    const option = document.createElement('option');
    option.value = location.value;
    option.text = location.name;
    select.appendChild(option);
    });
  })
  .catch(error => console.error(error));
}

document.getElementById("search_btn").addEventListener("click", displayMatchingTravelInfo);

function displayMatchingTravelInfo() {
  const from = document.getElementById("dropdown1").value;
  const to = document.getElementById("dropdown2").value;

  // check if from and to are the same
  if (from === to) {
    // if so, display a message and return early
    document.getElementById("div_to_change").innerHTML = "The origin and destination must be different.";
    var div = document.querySelector(".bars");
    div.style.display = "none";
    return;
  }

  // load the JSON data from a file
  fetch('assets/json/matrix.json')
  .then(response => response.json())
  .then(data => {
  // process the data when it's loaded
  const matchingTravelInfo = data["travel-information"].filter(info => {
    const fromMatch = info.trav[0]["from"] === from;
    const toMatch = info.trav[1]["to"] === to;
    return fromMatch && toMatch;
  });

  // create a string to display the matching travel information
  let resultStr = "";
  let emission_p = 0;
  if (matchingTravelInfo.length === 0) {
    resultStr = `No travel information found for ${from} to ${to}.`;
  } else {
    matchingTravelInfo.forEach(info => {
      const emissionPlane = parseFloat(info.trav[4]["emission-plane"]);
      emission_p = emissionPlane;
      const links = info.trav[2].links.map((link, index) => {
        const linkName = info.trav[3]["link-names"][index];
        return `<a href="${link}" target="_blank">${linkName}</a>`;
      }).join("<br>");
      resultStr += `<p>You can make this journey sustainable by using the following means of transportation:</p>`;
      resultStr += `${links}<br>`;
      if (emissionPlane > 0) {
        const emissionPlane = info.trav[4]["emission-plane"];
        const emissionCalc = parseFloat(info.trav[4]["emission-plane"]) - parseFloat(info.trav[5]["emission-alt"]);
        resultStr += `<p>By doing so you would be saving ${emissionCalc} kg of CO2 emissions per person compared to using the plane (which would create ${emissionPlane} kg of CO2 emissions per person).</p>`;
      } else {
        const emissionAlt = parseFloat(info.trav[5]["emission-alt"]);
        emission_alt = emissionAlt;
        resultStr += `<p>Given the short distance of this travel, taking the train should be the default means of transportation. Your emissions per person would be ${emissionAlt} kg of CO2.</p>`;
      }
      });
  }

  // display the matching travel information in the "results" div
  document.getElementById("div_to_change").innerHTML = resultStr;
  var div = document.querySelector(".bars");
  var f_div = document.querySelector(".first_div");
  f_div.style.width =  emission_p/2000 * 75 + "%";
  div.style.display = "block";
  })
  .catch(error => console.error('Error loading travel information:', error));
}

