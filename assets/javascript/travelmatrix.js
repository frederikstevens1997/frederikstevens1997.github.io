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

  var txt = document.querySelector(".choose_txt");
  txt.style.display = "none";

  // check if from and to are the same
  if (from === to) {
    // if so, display a message and return early
    document.getElementById("div_to_change").innerHTML = "The origin and destination must be different.";
    var fdiv = document.querySelector(".fbars");
    fdiv.style.display = "none";
    var bhdiv = document.querySelector(".bars-header");
    bhdiv.style.display = "none";
    var sdiv = document.querySelector(".sbars");
    sdiv.style.display = "none";
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
            resultStr += `<h3>You can make this journey sustainable by using the following means of transportation:</h3>`;
            resultStr += `${links}<br>`;
            if (emissionPlane > 0) {
              const emissionPlane = parseFloat(info.trav[5]["emission-plane"]);
              const emissionAlt = parseFloat(info.trav[6]["emission-alt"]);
              const emissionCalc = emissionPlane - emissionAlt;
              resultStr += `<p>By doing so you will save ${emissionCalc}kg of CO2 emissions per person compared to travelling by plane, which would generate ${emissionPlane}kg of CO2 emissions per person.</p>`;
              var f_div = document.querySelector(".fdiv");
              f_div.style.width =  emissionAlt/2000 * 75 + "%";
              var s_div = document.querySelector(".sdiv");
              s_div.style.width =  emissionPlane/2000 * 75 + "%";
              var f_txt = document.getElementById("ftxt");
              var s_txt = document.getElementById("stxt");
              const fTextNode = document.createTextNode(emissionAlt + "kg of CO2 emissions:");
              const sTextNode = document.createTextNode(emissionPlane + "kg of CO2 emissions:");
              f_txt.appendChild(fTextNode);
              s_txt.appendChild(sTextNode);
              var fbar = document.querySelector(".fbars");
              fbar.style.display = "block";
              var title_bar = document.querySelector(".bars-header");
              title_bar.style.display = "block";
              var sbar = document.querySelector(".sbars");
              sbar.style.display = "block";
            } else {
              const emissionAlt = parseFloat(info.trav[6]["emission-alt"]);
              emission_alt = emissionAlt;
              resultStr += `<p>Given the short distance of this travel, train should be the default means of transportation. Your emissions per person would be ${emissionAlt}kg of CO2.</p>`;
              var fdiv = document.querySelector(".fbars");
              fdiv.style.display = "none";
              var bhdiv = document.querySelector(".bars-header");
              bhdiv.style.display = "none";
              var sdiv = document.querySelector(".sbars");
              sdiv.style.display = "none";
            }
          });
        }

        // display the matching travel information in the "results" div
        document.getElementById("div_to_change").innerHTML = resultStr;
      })
      .catch(error => console.error('Error loading travel information:', error));
}


