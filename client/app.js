var socket = io.connect("/");

socket.on("connect", () => {
    ////console.log("Successfully connected to socket.io server.");
})

socket.on("fluidsRequested", data => {
    cacheFluids = data;
    initProcessData();
});

revertCheckbox = false;

getFluidsByType();
//localStorage.clear();

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

/*
 * function renders all remaining select fields
 */
function initProcessData() {
    prepareLocalStorage();
    renderProcessData();
}

function prepareLocalStorage() {
    var initialised = (localStorage.hasOwnProperty("radio-gas") && localStorage.hasOwnProperty("radio-liquid"))
    console.log("inside prepareLocalStorage" + localStorage.getItem("radio-gas"))
    console.log("inside prepareLocalStorage" + "cacheFluids = " + cacheFluids[0].aggregateType)
    var reset = (localStorage.getItem("radio-gas") != ((cacheFluids[0].aggregateType === "gas").toString()))
    console.log("inside prepareLocalStorage" + "RESET = " + reset)
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
    console.log("entered resetLocalStorage; id: " + cacheFluids[0].id + "aggregateType: " + cacheFluids[0].aggregateType);
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
 * Function loads values from local Storage
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
}

function renderOperatingPressure(data) {
    var input = document.getElementById("pressOp")
    input.value = data[0].operatingPressure;
    if (!revertCheckbox) {
        loadInputValue(input);
    }
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
 * AJAX METHODS BEGIN
 */

function getFluidsByType() {
    var fluidType = loadFluidtypeChoice()
    var request = new XMLHttpRequest();
    request.open("GET", "/api/fluids?fluidType=" + fluidType);
    request.addEventListener('load', function(event) {
        if (request.status == 200) {
            ////console.info(request.responseText);
        } else {
            ////console.error(request.statusText, request.responseText);
        }
    });
    request.send();
}

/*
 * AJAX FUNCTIONS END
 */

/*
 * ADJUST LAYOUT FUNCTIONS IF CUSTOM FLUID BEGIN
 */

function adjustLayout(checkBox) {
    if (checkBox.checked) {
        adjustLayoutOfBoxThird(checkBox);
        adjustLayoutOfBoxFourth(checkBox);
        adjustLayoutOfViscosityAndDensity(checkBox);
    } else {
        getFluidsByType();
        revertCheckbox = true;
    }
}


function adjustLayoutOfBoxThird(checkBox) {

    var fluidName = document.getElementById("fluidName")
    var fluidFormula = document.getElementById("fluidFormula")
    var fluidLabel = document.getElementById("fluid-labels")

    //  if (checkBox.checked) {

    if (fluidName.children[0]) {
        fluidName.children[0].remove();
    }

    var input = document.createElement("input")
    input.id = "fluidInput"
    input.type = "text"
    input.className = "text biggest"

    fluidName.appendChild(input)

    //Todo: Muss der alte "customFluid" Input-Wert wieder geladen werden, wenn Checkbox nochmal gechecked wurde? sonst nur else-Inhalt stehen lassen
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

    /*    } else {
            var data = cacheFluids;
            renderFluidName(data);
            renderFluidFormula(data);
            renderFluidLabel();
        }*/
}

function adjustLayoutOfBoxFourth(checkBox) {
    var tempOp = document.getElementById("tempOp");
    var pressOp = document.getElementById("pressOp");
    //  if (checkBox.checked) {
    pressOp.value = "";
    tempOp.value = "";
    /*    } else {
            var data = cacheFluids;
            pressOp.value = data[0].operatingPressure;
            tempOp.value = data[0].operatingTemperature;
        }*/
}

function adjustLayoutOfViscosityAndDensity(checkBox) {
    var viscosity = document.getElementById("viscosity")
    var density = document.getElementById("density")

    //  if (checkBox.checked) {
    localStorage.setItem("oldViscosity", viscosity.value)
    viscosity.value = "";
    viscosity.setAttribute("type", "text")
    viscosity.removeAttribute("readonly")
    viscosity.removeAttribute("class", "text big disabled dynamic-viscosity")
    viscosity.setAttribute("class", "text big dynamic-viscosity")
    localStorage.setItem("oldDensity", density.value)
    density.value = "";
    density.setAttribute("type", "text")
    density.removeAttribute("readonly")
    density.removeAttribute("class", "text big disabled operating-density")
    density.setAttribute("class", "text big operating-density")
    /*    } else {
            var data = cacheFluids;
            viscosity.setAttribute("readonly", "readonly")
            viscosity.value = data[0].dynamicViscosity;
            viscosity.setAttribute("value", localStorage.getItem("oldViscosity"))
            viscosity.removeAttribute("class", "text big  dynamic-viscosity")
            viscosity.setAttribute("class", "text big disabled dynamic-viscosity")
            density.setAttribute("readonly", "readonly")
            density.value = data[0].operatingDensity;
            density.removeAttribute("class", "text big operating-density")
            density.setAttribute("class", "text big disabled operating-density")
        }*/
}
/*
 * ADJUST LAYOUT FUNCTIONS IF CUSTOM FLUID END
 */

/*
 * VERIFICATION FUNCTIONS BEGIN
 */
function verifyAll() {

    validFluid = verifyFluid();
    validTemp = verifyTemp();
    validPressure = verifyPressure();
    validVisc = verifyVisc();
    validDens = verifyDens();

    if (validFluid && validTemp && validPressure && validVisc && validDens) {
        calculate();
    } else {
        alert("You need to enter correct values.")
    }
}

function verifyFluid() {

    var customFluid = document.getElementById("checkbox-1-1").checked;
    var valid = true;

    if (customFluid) {

        var fluidElement = document.getElementById("fluidInput");
        var patt = new RegExp("[a-zA-Z0-9]+");
        valid = patt.test(fluidElement.value);

        if (!valid) {
            fluidElement.setAttribute("class", "text biggest red")
            fluidElement.setAttribute("validationError", "true");
            fluidElement.setAttribute("data-toggle", "tooltip");
            fluidElement.setAttribute("title", "Es muss ein Fluid eingegben werden, das mindestens aus einem Buchstaben oder einer Zahl besteht!");
        } else {
            fluidElement.setAttribute("class", "text biggest")
            fluidElement.setAttribute("validationError", "false");
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

    var valid = (tempElement.value <= maxTemp && tempElement.value >= minTemp && !isNaN(tempElement.value))

    if (!valid) {
        tempElement.setAttribute("validationError", "true");
        tempElement.setAttribute("class", "text small red operating-temperature")
        tempElement.setAttribute("data-toggle", "tooltip");
        if (customFluid) {
            tempElement.setAttribute("title", "Es muss eine Temperatur eingegben werden, die zwischen -200°C und 350°C liegt!");
        } else {
            tempElement.setAttribute("title", "Es muss eine Temperatur eingegben werden, die zwischen -273.15°C und 1000°C liegt!");
        }
    } else {
        tempElement.setAttribute("validationError", "false");
        tempElement.setAttribute("class", "text small operating-temperature")
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

    var valid = (pressElement.value <= maxPress && pressElement.value >= minPress && !isNaN(pressElement.value))

    if (!valid) {
        pressElement.setAttribute("validationError", "true");
        pressElement.setAttribute("class", "text small red operating-pressure")
        pressElement.setAttribute("data-toggle", "tooltip");
        if (customFluid) {
            pressElement.setAttribute("title", "Es muss ein Druck eingegben werden, der zwischen 0 bar und 200 bar liegt!");
        } else {
            pressElement.setAttribute("title", "Es muss ein Druck eingegben werden, der zwischen 0.1 bar und 500 bar liegt!");
        }
    } else {
        pressElement.setAttribute("validationError", "false")
        pressElement.setAttribute("class", "text small operating-pressure")
    }

    return valid;
}

function verifyVisc() {

    var customFluid = document.getElementById("checkbox-1-1").checked;
    var valid = true;

    if (customFluid) {

        var viscosityElement = document.getElementById("viscosity");
        valid = (viscosityElement.value <= 2 && viscosityElement.value >= 0.01 && !isNaN(viscosityElement.value))

        if (!valid) {
            viscosityElement.setAttribute("validationError", "true");
            viscosityElement.setAttribute("class", "text big red dynamic-viscosity")
            viscosityElement.setAttribute("data-toggle", "tooltip");
            viscosityElement.setAttribute("title", "Es muss eine Viscosität eingegben werden, die zwischen 0.01 mPas und 2 mPas liegt!");
        } else {
            viscosityElement.setAttribute("validationError", "false");
            viscosityElement.setAttribute("class", "text big dynamic-viscosity")
        }
    }

    return valid
}

function verifyDens() {

    var customFluid = document.getElementById("checkbox-1-1").checked;
    var valid = true;

    if (customFluid) {

        var densityElement = document.getElementById("density");

        valid = (densityElement.value <= 200 && densityElement.value >= 0.01 && !isNaN(densityElement.value))

        if (!valid) {
            densityElement.setAttribute("validationError", "true");
            densityElement.setAttribute("class", "text big red  operating-density")
            densityElement.setAttribute("data-toggle", "tooltip");
            densityElement.setAttribute("title", "Es muss eine Dichte eingegben werden, die zwischen 0.01 kg/l und 2 kg/l liegt!");
        } else {
            densityElement.setAttribute("validationError", "false");
            densityElement.setAttribute("class", "text big operating-density")
        }
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
    localStorage.setItem("tempOpOld", p2);
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
    var children = div.children

    for (var i = 0; i < children.length; i++) {
        children[i].removeAttribute("selected")
        if (children[i].value === id.toString()) {
            children[i].setAttribute("selected", "true");
        }
    }
}

function updateFluidFormula(id) {

    var div = document.getElementsByClassName("fluid-formula-select")[0];
    var children = div.children

    for (var i = 0; i < children.length; i++) {
        children[i].removeAttribute("selected")
        if (children[i].value === id.toString()) {
            children[i].setAttribute("selected", "true");
        }
    }
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
    //PROBLEM?
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

/*
 * GUI AND STORAGE UPDATE FUNCTIONS END
 */

/*
 * EVENT HANDLER BEGIN
 */

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


$("body").on("change", ".fluid-formula-select", e => {
    updateProcessData($(".fluid-formula-select").val());
    updateProcessDataLocaleStorage($(".fluid-formula-select").val())
});

$("body").on("change", ".fluid-name-select", e => {
    updateProcessData($(".fluid-name-select").val());
    updateProcessDataLocaleStorage($(".fluid-name-select").val())
});


$("#calculateform").submit(e => {
    e.preventDefault();
    verifyAll();
});

$("body").on("change", "#radio-volume", e => {
    localStorage.setItem(e.target.id, "true")
    localStorage.setItem("radio-mass", "false")
});

$("body").on("change", "#radio-mass", e => {
    localStorage.setItem(e.target.id, "true")
    localStorage.setItem("radio-volume", "false")
});

$("body").on("change", "#tempOp", e => {
    if (verifyTemp()) {
        localStorage.setItem(e.target.id, e.target.value)
        console.log("Saving in local storage: " + e.target.id + " and value: " + e.target.value);
    }
});

$("body").on("change", "#pressOp", e => {
    if (verifyPressure()) {
        localStorage.setItem(e.target.id, e.target.value)
        console.log("Saving in local storage: " + e.target.id + " and value: " + e.target.value);
    }
});

$("body").on("change", "#density", e => {
    if (verifyDens()) {
        localStorage.setItem(e.target.id, e.target.value)
        console.log("Saving in local storage: " + e.target.id + " and value: " + e.target.value);
    }
});

$("body").on("change", "#viscosity", e => {
    if (verifyVisc()) {
        localStorage.setItem(e.target.id, e.target.value)
        console.log("Saving in local storage: " + e.target.id + " and value: " + e.target.value);
    }
});

$("body").on("change", "#checkbox-1-1", e => {
    var checkBox = document.getElementById(e.target.id)
    localStorage.setItem(e.target.id, checkBox.checked)
    adjustLayout(checkBox);
});

$("body").on("change", "#fluidInput", e => {
    if (verifyFluid()) {
        localStorage.setItem(e.target.id, e.target.value)
    }
});


$("body").on("mouseover", "input", e => {
    console.log("Enters mouseover not change.");
    //function aufrufen, die checked ob valError Attribut auf e.target gesetzt ist; wenn ja alert anzeigen
    if (e.target.getAttribute("validationError") == true) {
        displayErrorMessage(e.target);
    }
});

/*
 * EVENT HANDLER END
 */

// APP.js

var socket = io.connect("/");
socket.on("connect", () => {
    //console.log("Successfully connected to socket.io server.");
})

socket.on("technologiesRequested", data => {
    cacheTechnologies = data;
    renderTechnologies();
});

getTechnologies();

/*
Functions fills Box1 technology select
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
    console.log("loadTechnologyChoice entered with localStorage: ");
    console.log(localStorage);
    if (localStorage.hasOwnProperty("technologyChoice")) {
        console.log("in loadTechnologyChoice localStorage.hasOwnProperty(technologyChoice) == true");
        var value = localStorage.getItem("technologyChoice");
        var parent = document.getElementById("technologyChoice")
        children = parent.children

        for (var i = 0; i < children.length; i++) {
            if (children[i].value === value) {
                console.log("and now children[i].value " + children[i].value + " equals " + value);
                children[i].setAttribute("selected", "true");
                renderProductlines(children[i].value);
            }
        }
    }
}
/*
function adds image in box 1 depending on technology choice which is given by the id
*/
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
    } else {
        select.className = "styled-select light big productline-select";
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


function getTechnologies() {
    var request = new XMLHttpRequest();
    request.open("GET", "/api/technologies");
    request.addEventListener('load', function(event) {
        if (request.status == 200) {
            //console.info(request.responseText);
        } else {
            //console.error(request.statusText, request.responseText);
        }
    });
    request.send();
}


$("body").on("change", "#technologyChoice", e => {
    renderProductlines($(".technology-select").val());
    localStorage.setItem(e.target.id, e.target.value);
    console.log(localStorage);
});

$("body").on("change", "#productlineChoice", e => {
    renderProductlineImage($(".productline-select").val());
    localStorage.setItem(e.target.id, e.target.value);
    console.log(localStorage);
});
