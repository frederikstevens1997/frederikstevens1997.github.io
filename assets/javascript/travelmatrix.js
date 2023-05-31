// Get references to HTML elements
var dropdown1 = document.getElementById("dropdown1"); // Represents the dropdown element for the origin location
var dropdown2 = document.getElementById("dropdown2"); // Represents the dropdown element for the destination
var div = document.getElementById("div_to_change"); // Represents the div element to display the travel information
var btn = document.getElementById("search_btn"); // Represents the search button element

// Populate dropdowns
function populateSelectFromJSON(selectId) {
  // Get the dropdown element by its ID
  const select = document.getElementById(selectId);

  // Fetch JSON data containing locations
  fetch('assets/json/locations.json')
  .then(response => response.json())
  .then(data => {
    // Iterate over each location in the JSON data
    data.locations.forEach(location => {
      // Create an option element
      const option = document.createElement('option');
      option.value = location.value; // Set the value attribute of the option
      option.text = location.name; // Set the text content of the option
      select.appendChild(option); // Append the option to the dropdown
    });
  })
  .catch(error => console.error(error));
}

// Add event listener to search button
document.getElementById("search_btn").addEventListener("click", displayMatchingTravelInfo);

// Function to display matching travel information
function displayMatchingTravelInfo() {
  const from = document.getElementById("dropdown1").value; // Get the selected origin location
  const to = document.getElementById("dropdown2").value; // Get the selected destination

  var txt = document.querySelector(".txt"); // Get the element with class "txt"
  txt.style.display = "none"; // Hide the element with class "txt"

  if (from === to) {
    // Display an error message if the origin and destination are the same
    document.getElementById("div_to_change").innerHTML = "The origin and destination must be different.";
    displayNone(); // Call the displayNone() function to hide other elements
    return;
  }

  // Fetch JSON data containing travel information
  fetch('assets/json/matrix.json')
      .then(response => response.json())
      .then(data => {
        // Filter the travel information based on origin and destination
        const matchingTravelInfo = data["travel-information"].filter(info => {
          const fromMatch = info.trav[0]["from"] === from;
          const toMatch = info.trav[1]["to"] === to;
          return fromMatch && toMatch;
        });

        let resultStr = "";
        
        if (matchingTravelInfo.length === 0) {
          resultStr = `No travel information found for ${from} to ${to}.`;
        } else {
          matchingTravelInfo.forEach(info => {
            const emissionPlane = parseFloat(info.trav[5]["emission-plane"]);
            const links = info.trav[2].links.map((link, index) => {
              const linkName = info.trav[4]["link-names"][index];
              const linkText = info.trav[3]["link-text"][index];
              return `${linkText}<a href="${link}" target="_blank">${linkName}</a>.`;
            }).join("<br>");
            resultStr += `<h3>You can make this journey more sustainable by using the following means of transportation:</h3>`;
            resultStr += `${links}<br>`;
            if (emissionPlane > 0) {
              resultStr += displayBars(info);
            } else {
              const emissionAlt = parseFloat(info.trav[6]["emission-alt"]);
              emission_alt = emissionAlt;
              resultStr += `<p>Given the short distance of this travel, train should be the default means of transportation. Your emissions per person would be ${emissionAlt}kg of CO2.</p>`;
              displayNone();
            }
          });
        }

        document.getElementById("div_to_change").innerHTML = resultStr;
      })
      .catch(error => console.error('Error loading travel information:', error));
}

// Function to hide certain elements
function displayNone() {
  var fdiv = document.querySelector(".fbars");
  var bhdiv = document.querySelector(".bars-header");
  var sdiv = document.querySelector(".sbars");

  fdiv.style.display = "none";
  bhdiv.style.display = "none";
  sdiv.style.display = "none";
}

// Function to display bars and calculate emissions
function displayBars(info) {
  const emissionPlane = parseFloat(info.trav[5]["emission-plane"]);
  const emissionAlt = parseFloat(info.trav[6]["emission-alt"]);
  const emissionCalc = emissionPlane - emissionAlt;

  var f_div = document.querySelector(".fdiv");
  var s_div = document.querySelector(".sdiv");
  const f_txt = document.getElementById("ftxt");
  const s_txt = document.getElementById("stxt");

  var fbar = document.querySelector(".fbars");
  var title_bar = document.querySelector(".bars-header");
  var sbar = document.querySelector(".sbars");

  resultStr = `<p>By doing so you will save ${emissionCalc}kg of CO2 emissions per person compared to travelling by plane, which would generate ${emissionPlane}kg of CO2 emissions per person.</p>`;
  
  f_div.style.width =  emissionAlt/2000 * 75 + "%";
  s_div.style.width =  emissionPlane/2000 * 75 + "%";
  
  f_txt.textContent = "Emissions generated by choosing a sustainable way of travelling (per person): " + emissionAlt + "kg of CO2 emissions";
  s_txt.textContent = "Emissions generated by flying (per person): " + emissionPlane + "kg of CO2 emissions";

  
  fbar.style.display = "block";
  title_bar.style.display = "block";
  sbar.style.display = "block";

  return resultStr;
}
