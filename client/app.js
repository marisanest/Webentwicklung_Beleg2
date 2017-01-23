var socket = io.connect("/");

socket.on("connect", () => {
    console.log("Successfully connected to socket.io server.");
})

socket.on("technologiesRequested", data => {
    cacheTechnologies = data;
    renderTechnologies();
});

socket.on("fluidsRequested", data => {
    cacheFluids = data;
    initProcessData();
});

/*
 * AJAX METHODS BEGIN
 */

function getTechnologies() {
    var request = new XMLHttpRequest();
    request.open("GET", "/api/technologies");
    request.addEventListener('load', function(event) {
        if (request.status == 200) {
            console.info(request.responseText);
        } else {
            console.error(request.statusText, request.responseText);
        }
    });
    request.send();
}

function getFluidsByType() {
    var fluidType = loadFluidtypeChoice()
    var request = new XMLHttpRequest();
    request.open("GET", "/api/fluids?fluidType=" + fluidType);
    request.addEventListener('load', function(event) {
        if (request.status == 200) {
            console.info(request.responseText);
        } else {
            console.error(request.statusText, request.responseText);
        }
    });
    request.send();
}

/*
 * AJAX FUNCTIONS END
 */

function loadFluidtypeChoice() {
    var result = "liquid"

    if (localStorage.hasOwnProperty("radio-liquid")) {
        var value = localStorage.getItem("radio-liquid");
        if (value === "false") {
            result = "gas"
        }
    }
    return result;
}

revertCheckbox = false;
getTechnologies();
getFluidsByType();

/*
 * RENDER LAYOUT FUNCTIONS BEGIN
 */

/*
 * function renders all remaining select fields
 */
function initProcessData() {
    prepareLocalStorage();
    renderProcessData();
}

function prepareLocalStorage() {

    var initialised = (localStorage.hasOwnProperty("radio-gas") && localStorage.hasOwnProperty("radio-liquid"))
    var reset = (localStorage.getItem("radio-gas") != ((cacheFluids[0].aggregateType === "gas").toString()))

    if (!initialised) {
        initLocalStorage();
    } else if (reset) {
        resetLocalStorage();
    }
}

function initLocalStorage() {
    localStorage.setItem("radio-liquid", "true")
    localStorage.setItem("radio-gas", "false")
    localStorage.setItem("radio-volume", "true")
    localStorage.setItem("radio-mass", "false")
    localStorage.setItem("checkbox-1-1", "false")
    updateProcessDataLocaleStorage(cacheFluids[0].id)
}

function resetLocalStorage() {
    localStorage.setItem("radio-gas", ((cacheFluids[0].aggregateType === "gas").toString()))
    localStorage.setItem("radio-liquid", ((cacheFluids[0].aggregateType === "liquid").toString()))
    updateProcessDataLocaleStorage(cacheFluids[0].id)
}

function renderProcessData() {
    var data = cacheFluids;
    renderFluidLabel();
    renderFluidName(data);
    renderFluidFormula(data);
    renderOperatingTemperature(data);
    renderOperatingPressure(data);
    renderDynamicViscosity(data);
    renderOperatingDensity(data);
    if (!revertCheckbox) {
        loadLocalStorage();
    }
    revertCheckbox = false;
}

/*
 * Loads values from local Storage
 */
function loadLocalStorage() {
    loadRadioButtons()
    loadFluidCheckBox()
}

function loadRadioButtons() {

    var checkButtons = ["radio-liquid", "radio-gas", "radio-volume", "radio-mass"]

    for (var i = 0; i < checkButtons.length; i++) {
        if (localStorage.hasOwnProperty(checkButtons[i])) {
            var value = localStorage.getItem(checkButtons[i]);
            if (value === "true") {
                document.getElementById(checkButtons[i]).checked = true;
            } else {
                document.getElementById(checkButtons[i]).removeAttribute("checked");
            }
        }
    }
}

function loadFluidCheckBox() {

    if (localStorage.hasOwnProperty("checkbox-1-1")) {
        var value = localStorage.getItem("checkbox-1-1");
        var checkBox = document.getElementById("checkbox-1-1")

        if (value === "true") {
            checkBox.checked = value;
            adjustLayout(checkBox);
        } else {
            checkBox.removeAttribute("checked")
        }
    }
}

function renderFluidLabel() {

    if (!document.getElementsByClassName("formula-label")[0]) {
        var fluidLabel = document.getElementById("fluid-labels")
        var label = document.createElement("div");

        label.className = "label second formula-label"
        label.innerText = "Formula:"

        fluidLabel.appendChild(label)
    }
}

function renderFluidName(data) {

    var div = document.getElementsByClassName("fluid-name")[0];

    if (div.children[0]) {
        div.children[0].remove();
    }

    var select = document.createElement("select");
    select.className = "styled-select light big first fluid-name-select";
    select.name = "fluid";
    select.form = "calculateform";
    select.id = "fluidChoice";
    div.appendChild(select);

    for (var i = 0; i < data.length; i++) {
        var option = document.createElement("option");
        option.innerText = data[i].name;
        option.value = data[i].id;
        select.appendChild(option);
    }
    if (!revertCheckbox) {
        loadFluidChoice();
    }
}

function loadFluidChoice() {

    var value = localStorage.getItem("fluidChoice");
    var parent = document.getElementById("fluidChoice")
    children = parent.children

    for (var i = 0; i < children.length; i++) {
        if (children[i].value === value) {
            children[i].setAttribute("selected", "true");
        }
    }
}

function renderFluidFormula(data) {

    var div = document.getElementsByClassName("fluid-formula")[0];

    if (div.children[0]) {
        div.children[0].remove();
    }

    var select = document.createElement("select");
    select.className = "styled-select light big fluid-formula-select";
    select.name = "formula";
    select.form = "calculateform";
    select.id = "fluidFormulaChoice"

    div.appendChild(select);

    for (var i = 0; i < data.length; i++) {
        var option = document.createElement("option");
        option.innerText = data[i].formula;
        option.value = data[i].id;
        select.appendChild(option);
    }
    if (!revertCheckbox) {
        loadFluidFormulaChoice();
    }
}

function loadFluidFormulaChoice() {

    var value = localStorage.getItem("fluidFormulaChoice");
    var parent = document.getElementById("fluidFormulaChoice")
    children = parent.children

    for (var i = 0; i < children.length; i++) {
        if (children[i].value === value) {
            children[i].setAttribute("selected", "true");
        }
    }
}

function renderOperatingTemperature(data) {

    var input = document.getElementById("tempOp")
    input.value = data[0].operatingTemperature;

    if (!revertCheckbox) {
        loadInputValue(input);
    }
    verifyTemp();
}

function renderOperatingPressure(data) {

    var input = document.getElementById("pressOp")
    input.value = data[0].operatingPressure;

    if (!revertCheckbox) {
        loadInputValue(input);
    }
    verifyPressure();
}

function renderDynamicViscosity(data) {

    var input = document.getElementById("viscosity")
    input.value = data[0].dynamicViscosity;

    if (!revertCheckbox) {
        loadInputValue(input);
    }
}

function renderOperatingDensity(data) {

    var input = document.getElementById("density")
    input.value = data[0].operatingDensity;

    if (!revertCheckbox) {
        loadInputValue(input);
    }
}

function loadInputValue(input) {
    var value = localStorage.getItem(input.id);
    input.value = value;
}

/*
 * RENDER LAYOUT FUNCTIONS END
 */

/*
 * ADJUST LAYOUT FUNCTIONS IF CUSTOM FLUID BEGIN
 */

function adjustLayout(checkBox) {
    if (checkBox.checked) {

        adjustLayoutOfBoxThird();
        adjustLayoutOfBoxFourth();
        adjustLayoutOfViscosityAndDensity(checkBox);

    } else {

        if(localStorage.getItem("radio-liquid") === "true") {

          localStorage.setItem("radio-liquid", "false");
          localStorage.setItem("radio-gas", "true");
          getFluidsByType();

          adjustLayoutOfViscosityAndDensity(checkBox);

          localStorage.setItem("radio-liquid", "true");
          localStorage.setItem("radio-gas", "false");
          getFluidsByType();

          adjustLayoutOfViscosityAndDensity(checkBox);
          revertCheckbox = true;
        } else {

          localStorage.setItem("radio-liquid", "true");
          localStorage.setItem("radio-gas", "false");
          getFluidsByType();

          adjustLayoutOfViscosityAndDensity(checkBox);

          localStorage.setItem("radio-liquid", "false");
          localStorage.setItem("radio-gas", "true");
          getFluidsByType();

          adjustLayoutOfViscosityAndDensity(checkBox);
          revertCheckbox = true;
        }
    }
}

function adjustLayoutOfBoxThird() {

    var fluidName = document.getElementById("fluidName")
    var fluidFormula = document.getElementById("fluidFormula")
    var fluidLabel = document.getElementById("fluid-labels")

    if (fluidName.children[0]) {
        fluidName.children[0].remove();
    }

    var input = document.createElement("input")
    input.id = "fluidInput"
    input.type = "text"
    input.className = "text biggest"

    fluidName.appendChild(input)

    if (localStorage.getItem("fluidInput")) {
        input.value = localStorage.getItem("fluidInput")
    } else {
        input.value = ""
    }

    if (fluidFormula.children[0]) {
        fluidFormula.children[0].remove();
    }

    if (fluidLabel.children[1]) {
        fluidLabel.children[1].remove();
    }
}

function adjustLayoutOfBoxFourth() {

    var tempOp = document.getElementById("tempOp");
    var pressOp = document.getElementById("pressOp");

    if (localStorage.getItem("fluidInput")) {
        tempOp.value = localStorage.getItem("tempOp")
    } else {
        tempOp.value = ""
    }

    if (localStorage.getItem("fluidInput")) {
        pressOp.value = localStorage.getItem("pressOp")
    } else {
        pressOp.value = ""
    }
}

function adjustLayoutOfViscosityAndDensity(checkBox) {

    var viscosity = document.getElementById("viscosity")
    var density = document.getElementById("density")

    if (checkBox.checked) {

      localStorage.setItem("oldViscosity", viscosity.value)

      if (localStorage.getItem("viscosity")) {
          viscosity.value = localStorage.getItem("viscosity")
      } else {
          viscosity.value = ""
      }

      viscosity.removeAttribute("readonly")
      viscosity.setAttribute("class", "text big dynamic-viscosity")


      localStorage.setItem("oldDensity", density.value)

      if (localStorage.getItem("density")) {
          density.value = localStorage.getItem("density")
      } else {
          density.value = ""
      }

      density.removeAttribute("readonly")
      density.setAttribute("class", "text big operating-density")

    } else {
      viscosity.setAttribute("readonly", "true")
      viscosity.setAttribute("class", "text big disabled dynamic-viscosity")

      density.setAttribute("readonly", "true")
      density.setAttribute("class", "text big disabled operating-density")
    }
}

/*
 * ADJUST LAYOUT FUNCTIONS IF CUSTOM FLUID END
 */

/*
 * VERIFICATION FUNCTIONS BEGIN
 */
 function onlyVerifyAll() {

     var validFluid = verifyFluid();
     var validTemp = verifyTemp();
     var validPressure = verifyPressure();
     var validVisc = verifyVisc();
     var validDens = verifyDens();
 }



function verifyAll() {

    var validFluid = verifyFluid();
    var validTemp = verifyTemp();
    var validPressure = verifyPressure();
    var validVisc = verifyVisc();
    var validDens = verifyDens();

    if (validFluid && validTemp && validPressure && validVisc && validDens) {
        calculate();
    } else {
        alert("You need to enter correct values! For more information hover over the bordered red boxes!")
    }
}

function verifyFluid() {

    var customFluid = document.getElementById("checkbox-1-1").checked;
    var valid = true;

    if (customFluid) {

        var fluidElement = document.getElementById("fluidInput");
        var fluid = fluidElement.value
        var pattern = new RegExp("[a-zA-Z0-9]+");
        valid = pattern.test(fluid);

        if (!valid) {

            fluidElement.setAttribute("class", "text biggest red")
            fluidElement.setAttribute("validationError", "true");

            new Tooltip({
              target: document.querySelector('#fluidInput'),
              content: "Es muss ein Fluid eingegben werden, das mindestens aus einem Buchstaben oder einer Zahl besteht!",
              classes: 'tooltip-theme-arrows',
              position: 'bottom center'
            })

        } else {

            var fluidName = document.getElementById("fluidName")

            var input = document.createElement("input")
            input.id = "fluidInput"
            input.type = "text"
            input.className = "text biggest"
            input.value = fluid
            input.setAttribute("validationError", "false");

            fluidName.replaceChild(input, fluidName.children[0])
        }
    }
    return valid;
}

function verifyTemp() {

    var customFluid = document.getElementById("checkbox-1-1").checked;
    var tempElement = document.getElementById("tempOp");

    if (customFluid) {
        var maxTemp = 350
        var minTemp = -200
    } else {
        var maxTemp = 1000
        var minTemp = -273.15
    }

    var temperature = parseFloat(tempElement.value)
    var valid = (temperature <= maxTemp && temperature >= minTemp && !isNaN(temperature))

    if (!valid) {
        tempElement.setAttribute("validationError", "true");
        tempElement.setAttribute("class", "text small red operating-temperature")

        if (customFluid) {

          new Tooltip({
            target: document.querySelector('#tempOp'),
            content: "Es muss eine Temperatur eingegben werden, die zwischen -200°C und 350°C liegt!",
            classes: 'tooltip-theme-arrows',
            position: 'bottom center'
          })

        } else {

          new Tooltip({
            target: document.querySelector('#tempOp'),
            content: "Es muss eine Temperatur eingegben werden, die zwischen -273.15°C und 1000°C liegt!",
            classes: 'tooltip-theme-arrows',
            position: 'bottom center'
          })

        }
    } else {

        var temperatureInputs = document.getElementById("temperaturInputs")

        var input = document.createElement("input")
        input.id = "tempOp"
        input.name = "temperaturop"
        input.className = "text small operating-temperature"
        input.value = temperature
        input.setAttribute("validationError", "false");

        temperatureInputs.replaceChild(input, temperatureInputs.children[1])
    }

    return valid;
}

function verifyPressure() {

    var customFluid = document.getElementById("checkbox-1-1").checked;
    var pressElement = document.getElementById("pressOp");

    if (customFluid) {
        var maxPress = 200
        var minPress = 0
    } else {
        var maxPress = 500
        var minPress = 0.1
    }

    var pressure = parseFloat(pressElement.value)
    var valid = (pressure <= maxPress && pressure >= minPress && !isNaN(pressure))

    if (!valid) {
        pressElement.setAttribute("validationError", "true");
        pressElement.setAttribute("class", "text small red operating-pressure")
        pressElement.setAttribute("data-toggle", "tooltip");
        if (customFluid) {

          new Tooltip({
            target: document.querySelector('#pressOp'),
            content: "Es muss ein Druck eingegben werden, der zwischen 0 bar und 200 bar liegt!",
            classes: 'tooltip-theme-arrows',
            position: 'bottom center'
          })

        } else {

          new Tooltip({
            target: document.querySelector('#pressOp'),
            content: "Es muss ein Druck eingegben werden, der zwischen 0.1 bar und 500 bar liegt!",
            classes: 'tooltip-theme-arrows',
            position: 'bottom center'
          })

        }
    } else {

        var pressureInputs = document.getElementById("pressureInputs")

        var input = document.createElement("input")
        input.id = "pressOp"
        input.name = "pressureop"
        input.className = "text small operating-pressure"
        input.value = pressure
        input.setAttribute("validationError", "false");

        pressureInputs.replaceChild(input, pressureInputs.children[1])
    }

    return valid;
}

function verifyVisc() {

    var customFluid = document.getElementById("checkbox-1-1").checked;
    var valid = true;

    if (customFluid) {

        var maxVisc = 2
        var minVisc = 0.01

        var viscosityElement = document.getElementById("viscosity");
        var viscosity = parseFloat(viscosityElement.value)

        valid = (viscosity <= maxVisc && viscosity >= minVisc && !isNaN(viscosity))

        if (!valid) {

            viscosityElement.setAttribute("validationError", "true");
            viscosityElement.setAttribute("class", "text big red dynamic-viscosity")

            new Tooltip({
              target: document.querySelector('#viscosity'),
              content: "Es muss eine Viscosität eingegben werden, die zwischen 0.01 mPas und 2 mPas liegt!",
              classes: 'tooltip-theme-arrows',
              position: 'bottom center'
            })

        } else {

            var viscosityInputs = document.getElementById("viscosityInputs")

            var input = document.createElement("input")
            input.id = "viscosity"
            input.name = "dynamicvis"
            input.className = "text big dynamic-viscosity"
            input.value = viscosity
            input.setAttribute("validationError", "false");

            viscosityInputs.replaceChild(input, viscosityInputs.children[0])
        }
    } else {

      var viscosityInputs = document.getElementById("viscosityInputs")

      var input = document.createElement("input")
      input.id = "viscosity"
      input.name = "dynamicvis"
      input.className = "text big disabled dynamic-viscosity"
      input.setAttribute("readonly", "true")
      input.value = viscosity
      input.setAttribute("validationError", "false");

      viscosityInputs.replaceChild(input, viscosityInputs.children[0])

    }

    return valid
}

function verifyDens() {

    var customFluid = document.getElementById("checkbox-1-1").checked;
    var valid = true;

    if (customFluid) {

        var maxVisc = 200
        var minVisc = 0.01

        var densityElement = document.getElementById("density");
        var density = parseFloat(densityElement.value)

        valid = (density <= maxVisc && density >= minVisc && !isNaN(density))

        if (!valid) {

            densityElement.setAttribute("validationError", "true");
            densityElement.setAttribute("class", "text big red  operating-density")

            new Tooltip({
              target: document.querySelector('#density'),
              content: "Es muss eine Dichte eingegben werden, die zwischen 0.01 kg/l und 2 kg/l liegt!",
              classes: 'tooltip-theme-arrows',
              position: 'bottom center'
            })

        } else {

            var densityInputs = document.getElementById("densityInputs")

            var input = document.createElement("input")
            input.id = "density"
            input.name = "operatingden"
            input.className = "text big operating-density"
            input.value = density
            input.setAttribute("validationError", "false");

            densityInputs.replaceChild(input, densityInputs.children[0])
        }
    } else {

        var densityInputs = document.getElementById("densityInputs")

        var input = document.createElement("input")
        input.id = "density"
        input.name = "operatingden"
        input.className = "text big disabled operating-density"
        input.setAttribute("readonly", "true")
        input.value = density
        input.setAttribute("validationError", "false");

        densityInputs.replaceChild(input, densityInputs.children[0])
    }

    return valid
}

/*
 * VERIFICATION FUNCTIONS END
 */

/*
 * CALCULATION FUNCTIONS BEGIN
 */

function calculate() {
    //T1, p1, must be global, as well as oldViscosity and oldDensity
    var t1 = localStorage.getItem("tempOpOld")
    var p1 = localStorage.getItem("pressOpOld")
    var t2 = document.getElementById("tempOp").value;
    var p2 = document.getElementById("pressOp").value;
    calculateViscosity(t1, t2);
    calculateDensity(p1, p2, t1, t2);
    localStorage.setItem("tempOpOld", t2);
    localStorage.setItem("pressOpOld", p2);
}

function calculateViscosity(t1, t2) {
    var oldViscosity = localStorage.getItem("viscosity")
    var newViscosity = oldViscosity * ((273.15 + t1) / (273.15 + t2))
    document.getElementById("viscosity").value = newViscosity;
    localStorage.setItem("viscosity", newViscosity)
}

function calculateDensity(p1, p2, t1, t2) {
    var oldDensity = localStorage.getItem("density")
    var newDensity = oldDensity * ((273.15 + t1) / (273.15 + t2)) * (p2 / p1)
    document.getElementById("density").value = newDensity;
    localStorage.setItem("density", newDensity)
}

/*
 * CALCULATION FUNCTIONS END
 */

/*
 * GUI AND STORAGE UPDATE FUNCTIONS BEGIN
 */

function updateProcessData(id) {

    var id = parseInt(id);

    if (!id || isNaN(id)) {
        return;
    }

    updateFluidName(id);
    updateFluidFormula(id);
    updateTemperature(id);
    updatePressure(id);
    updateViscosity(id);
    updateDensity(id);
}

function updateFluidName(id) {
    var div = document.getElementsByClassName("fluid-name-select")[0];
    div.value = id;
}

function updateFluidFormula(id) {
    var div = document.getElementsByClassName("fluid-formula-select")[0];
    div.value = id;
}

function updateTemperature(id) {
    var data = cacheFluids.find(i => i.id === id);
    var input = document.getElementsByClassName("operating-temperature")[0];
    input.value = data.operatingTemperature
}

function updatePressure(id) {
    var data = cacheFluids.find(i => i.id === id);
    var input = document.getElementsByClassName("operating-pressure")[0];
    input.value = data.operatingPressure
}

function updateViscosity(id) {
    var data = cacheFluids.find(i => i.id === id);
    var input = document.getElementsByClassName("dynamic-viscosity")[0];
    input.value = data.dynamicViscosity
}

function updateDensity(id) {
    var data = cacheFluids.find(i => i.id === id);
    var input = document.getElementsByClassName("operating-density")[0];
    input.value = data.operatingDensity
}

function updateProcessDataLocaleStorage(id) {

    var id = parseInt(id);

    if (!id || isNaN(id)) {
        return;
    }

    var data = cacheFluids.find(i => i.id === id);
    localStorage.setItem("tempOp", data.operatingTemperature)
    localStorage.setItem("pressOp", data.operatingPressure)
    localStorage.setItem("viscosity", data.dynamicViscosity)
    localStorage.setItem("oldViscosity", data.dynamicViscosity)
    localStorage.setItem("density", data.operatingDensity)
    localStorage.setItem("oldDensity", data.operatingDensity)
    localStorage.setItem("fluidChoice", data.id)
    localStorage.setItem("fluidFormulaChoice", data.id)
    localStorage.setItem("tempOpOld", data.operatingTemperature)
    localStorage.setItem("pressOpOld", data.operatingPressure)
}

function resetProcesData() {
  localStorage.setItem("fluidInput", "")
  localStorage.setItem("density", "")
  localStorage.setItem("viscosity", "")
  localStorage.setItem("tempOp", "")
  localStorage.setItem("pressOp", "")
}

function reset() {
  localStorage.clear();
  var checkbox = document.getElementById("checkbox-1-1")
  if(checkbox.checked) {
    checkbox.checked = false;
    adjustLayout(checkbox);
  }
  removeProductline();
  getTechnologies();
  getFluidsByType();
}

/*
 * GUI AND STORAGE UPDATE FUNCTIONS END
 */

/*
 * FLOWMETER TYPES BEGIN
 */

/*
 * Fills technology select
 */

function renderTechnologies() {

    data = cacheTechnologies;

    var div = document.getElementsByClassName("technology")[0];
    if (div.children[0]) {
        div.children[0].remove();
    }

    var select = document.createElement("select");

    select.id = "technologyChoice";
    select.className = "styled-select light big first technology-select";
    div.appendChild(select);

    var option = document.createElement("option");
    option.innerText = "Please select one technology!"
    option.value = 0;
    select.appendChild(option);

    for (var i = 0; i < data.length; i++) {
        var option = document.createElement("option");
        option.innerText = data[i].name;
        option.value = data[i].id;
        select.appendChild(option);
    }
    loadTechnologyChoice();
}

function loadTechnologyChoice() {

    if (localStorage.hasOwnProperty("technologyChoice")) {

        var value = localStorage.getItem("technologyChoice");
        var parent = document.getElementById("technologyChoice")
        children = parent.children

        for (var i = 0; i < children.length; i++) {
            if (children[i].value === value) {

                children[i].setAttribute("selected", "true");
                renderProductlines(children[i].value);
            }
        }
    }
}

function renderProductlines(id) {

    var id = parseInt(id);

    if (id === 0) {
        removeProductline();
    } else if (!id || isNaN(id)) {
        return;
    } else {
        var data = cacheTechnologies.find(i => i.id === id);
        renderProductlineLabel()
        renderProductlineSelect(data)
        renderProductlineImage(data.device[0].image);
    }
}

function removeProductline() {
    var divLabel = document.getElementsByClassName("flowmetertypes-left")[0];

    if (divLabel.children[1]) {
        divLabel.children[1].remove();
    }

    var divSelect = document.getElementsByClassName("productline")[0];

    if (divSelect.children[0]) {
        divSelect.children[0].remove();
    }

    var divImage = document.getElementsByClassName("productline-image")[0];

    if (divImage.children[0]) {
        divImage.children[0].remove();
    }
}

function renderProductlineLabel() {
    var div = document.getElementsByClassName("flowmetertypes-left")[0];

    if (div.children[1]) {
        div.children[1].remove();
    }

    var divNew = document.createElement("div");
    divNew.className = "label second"
    divNew.innerText = "Product line:"

    div.appendChild(divNew);
}

function renderProductlineSelect(data) {

    var div = document.getElementsByClassName("productline")[0];

    if (div.children[0]) {
        div.children[0].remove();
    }

    var select = document.createElement("select");
    select.id = "productlineChoice"

    if (data.device.length === 1) {
        select.className = "styled-select light big productline-select disabled";
        select.setAttribute("disabled", "true")
    } else {
        select.className = "styled-select light big productline-select";
        select.removeAttribute("disabled")
    }

    select.name = "productline";
    select.form = "calculateform";

    div.appendChild(select);

    for (var i = 0; i < data.device.length; i++) {
        var option = document.createElement("option");
        option.innerText = data.device[i].name;
        option.value = data.device[i].image;
        select.appendChild(option);
    }
    loadProductlineChoice();
}

function loadProductlineChoice() {
    if (localStorage.hasOwnProperty("productlineChoice")) {
        var value = localStorage.getItem("productlineChoice");
        var parent = document.getElementById("productlineChoice")
        children = parent.children
        for (var j = 0; j < children.length; j++) {
            if (children[j].value === value) {
                children[j].setAttribute("selected", "true");
                renderProductlineImage(value);
            }
        }
    }
}

/*
 * Adds image depending on productline choice which is given by the id
 */

function renderProductlineImage(path) {

    var div = document.getElementsByClassName("productline-image")[0];

    if (div.children[0]) {
        div.children[0].remove();
    }

    var img = document.createElement("img");
    img.className = "rotamass first";
    img.src = path;

    div.appendChild(img);
}

/*
 * FLOWMETER TYPES END
 */

/*
 * EVENT HANDLER BEGIN
 */

$("body").on("change", "#technologyChoice", e => {
    renderProductlines($(".technology-select").val());
    localStorage.setItem(e.target.id, e.target.value);
});

$("body").on("change", "#productlineChoice", e => {
    renderProductlineImage($(".productline-select").val());
    localStorage.setItem(e.target.id, e.target.value);
});

$("body").on("click", ".fluid-input", e => {
    if (e.target.id === "radio-liquid") {
        localStorage.setItem("radio-liquid", "true");
        localStorage.setItem("radio-gas", "false");
    } else {
        localStorage.setItem("radio-gas", "true");
        localStorage.setItem("radio-liquid", "false");
    }
    getFluidsByType();
    prepareLocalStorage();
});

$("body").on("change", "#checkbox-1-1", e => {
    var checkBox = document.getElementById(e.target.id);
    if (checkBox.checked) {
      resetProcesData();
    }
    localStorage.setItem(e.target.id, checkBox.checked);
    adjustLayout(checkBox);
    onlyVerifyAll();
});

$("body").on("change", ".fluid-formula-select", e => {
    updateProcessData($(".fluid-formula-select").val());
    updateProcessDataLocaleStorage($(".fluid-formula-select").val())
});

$("body").on("change", ".fluid-name-select", e => {
    updateProcessData($(".fluid-name-select").val());
    updateProcessDataLocaleStorage($(".fluid-name-select").val())
});

$("body").on("change", "#fluidInput", e => {
    localStorage.setItem(e.target.id, e.target.value);
    verifyFluid();
});

$("body").on("change", "#tempOp", e => {
    localStorage.setItem(e.target.id, e.target.value);
    verifyTemp();
});

$("body").on("change", "#pressOp", e => {
    localStorage.setItem(e.target.id, e.target.value);
    verifyPressure();
});

$("body").on("change", "#density", e => {
    localStorage.setItem(e.target.id, e.target.value);
    verifyDens();
});

$("body").on("change", "#viscosity", e => {
    localStorage.setItem(e.target.id, e.target.value);
    verifyVisc();
});

$("body").on("change", "#radio-volume", e => {
    localStorage.setItem(e.target.id, "true")
    localStorage.setItem("radio-mass", "false")
});

$("body").on("change", "#radio-mass", e => {
    localStorage.setItem(e.target.id, "true")
    localStorage.setItem("radio-volume", "false")
});

$("#calculateform").submit(e => {
    e.preventDefault();
    verifyAll();
});

$("body").on("click", "#resetInput", e => {
  reset();
});

/*
 * EVENT HANDLER END
 */
