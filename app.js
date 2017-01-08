var socket = io.connect("/");
socket.on("connect", ()=>{
    console.log("Successfully connected to socket.io server.");
})

socket.on("technologyRequested", data => {
    console.log("Technology received:");
    console.log(data);
    renderTechnology(data)
});

socket.on("fluidRequested", data => {
    console.log("Fluid received:");
    console.log(data);
    renderProcessData(data)
});

function renderTechnology(data) {

  var div = document.getElementsByClassName("productline")[0]
  var select = document.createElement("select")

  if (div.hasChildNodes()) {
    div.removeChild(div.childNodes[0]);
  }

  div.appendChild(select)

  if (data.device.length === 1) {
    select.className = "styled-select light big productline disabled"
  } else {
    select.className = "styled-select light big productline"
  }

  select.name = "productline"
  select.form = "calculateform"


  for(var i = 0; i < data.device.length; i++) {
    var option = document.createElement("option")
    option.innerText = data.device[i].name
    option.value = data.device[i].image
    select.appendChild(option)
  }

  renderProductline(data.device[0].image)
}

function renderProductline(data) {

  var div = document.getElementsByClassName("device")[0]
  var img = document.createElement("img")

  if (div.hasChildNodes()) {
    div.removeChild(div.childNodes[0]);
  }

  div.appendChild(img)

  img.className = "rotamass first"
  img.src = data
}

function renderProcessData(data) {
  renderFluidName(data)
  renderFluiFormula(data)
  renderOperatingTemperature(data)
  renderOperatingPressure(data)
  renderDynamicViscosity(data)
  renderOperatingDensity(data)
}

function renderFluidName(data) {

  var div = document.getElementsByClassName("fluid-name")[0]
  var select = document.createElement("select")

  if (div.hasChildNodes()) {
    div.removeChild(div.childNodes[0]);
  }

  div.appendChild(select)

  select.className = "styled-select light big first"
  select.name = "fluid"
  select.form = "calculateform"

  for(var i = 0; i < data.length; i++) {
    var option = document.createElement("option")
    option.innerText = data[i].name
    option.value = data[i].id
    select.appendChild(option)
  }
}

function renderFluiFormula(data) {

  var div = document.getElementsByClassName("fluid-formula")[0]
  var select = document.createElement("select")

  if (div.hasChildNodes()) {
    div.removeChild(div.childNodes[0]);
  }

  div.appendChild(select)

  select.className = "styled-select light big"
  select.name = "formula"
  select.form = "calculateform"


  for(var i = 0; i < data.length; i++) {
    var option = document.createElement("option")
    option.innerText = data[i].formula
    option.value = data[i].id
    select.appendChild(option)
  }
}

function renderOperatingTemperature(data) {
  var input = document.getElementsByClassName("operating-temperature")[0]
  input.value = data[0].operatingTemperature
}

function renderOperatingPressure(data) {
  var input = document.getElementsByClassName("operating-pressure")[0]
  input.value = data[0].operatingPressure
}

function renderDynamicViscosity(data) {
  var input = document.getElementsByClassName("dynamic-viscosity")[0]
  input.value = data[0].dynamicViscosity
}

function renderOperatingDensity(data) {
  var input = document.getElementsByClassName("operating-density")[0]
  input.value = data[0].operatingDensity
}

function getTechnology(id){
	var request = new XMLHttpRequest();
   request.open("GET","/api/technologies?id=" + id);
   request.addEventListener('load', function(event) {
      if (request.status == 200) {
         console.info(request.responseText);
      } else {
         console.error(request.statusText, request.responseText);
      }
   });
   request.send();
}

function getFluidsByType(fluidType){
	var request = new XMLHttpRequest();
   request.open("GET","/api/fluids?fluidType=" + fluidType);
   request.addEventListener('load', function(event) {
      if (request.status == 200) {
         console.info(request.responseText);
      } else {
         console.error(request.statusText, request.responseText);
      }
   });
   request.send();
}

$("body").on("change", ".technology", e => {
  getTechnology($( ".technology" ).val());
});

$("body").on("change", ".productline.styled-select.light.big", e => {
  renderProductline($( ".productline.styled-select.light.big" ).val());
});

$("body").on("change", ".regular-radio.first.fluid", e => {
  getFluidsByType($( ".regular-radio.first.fluid" ).val());
});
