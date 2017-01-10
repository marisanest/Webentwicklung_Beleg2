var socket = io.connect("/");
socket.on("connect", () => {
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

loadFromLocalStorage();
/*
Function loads values from local Storage
*/
function loadFromLocalStorage() {
    //check how to deal with select.. and if all input are necessary
    var checkButtons = ["radio-liquid", "radio-gas", "radio-volume", "radio-mass"]
    for (var i = 0; i < checkButtons.length; i++) {
        if (localStorage.hasOwnProperty(checkButtons[i])) {
            var value = localStorage.getItem(checkButtons[i]);
            document.getElementById(checkButtons[i]).setAttribute("checked", value);
        }
    }

    var selectIds = ["technologyChoice", "procutlineChoice"]
    for (var i = 0; i < selectIds.length; i++) {
        if (localStorage.hasOwnProperty(selectIds[i])) {
            var value = localStorage.getItem(selectIds[i]);
            console.log("loadFromLocalStorage: key: " + selectIds[i] + " content: " + value);
            var parent = document.getElementById(selectIds[i])
            children = parent.children
            console.log("children " + children);
            for (var i = 0; i < children.length; i++) {
                if (children[i].id === value) {
                    children[i].setAttribute("selected", "true")
                }
            }
        }
    }
    localStorage.setItem("oldViscosity", "1");
    localStorage.setItem("oldDensity", "2")

    var inputIds = ["checkbox-1-1", "tempMin", "tempOp", "tempMax", "pressMin", "pressOp", "pressMax", "viscosity", "density", "frMin", "frOp", "frMax", "frDes"]
    for (var i = 0; i < inputIds.length; i++) {
        if (localStorage.hasOwnProperty(inputIds[i])) {
            var value = localStorage.getItem(inputIds[i]);
            console.log(inputIds[i]);
            document.getElementById(inputIds[i]).setAttribute("value", value);
        }
    }
}

/*
Functions fills Box1 productline select
*/
function renderTechnology(data) {

    var div = document.getElementsByClassName("productlineChoice")[0]
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

    select.id = "productlineChoice"
    select.name = "productline"
    select.form = "calculateform"


    for (var i = 0; i < data.device.length; i++) {
        var option = document.createElement("option")
        option.innerText = data.device[i].name
        option.value = data.device[i].image
        option.id = i
        select.appendChild(option)
    }
    renderProductline(data.device[0].image)
}

/*
function adds image in box 1 depending on technology choice
*/
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
/*
function renders all remaining select fields
*/
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

    for (var i = 0; i < data.length; i++) {
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


    for (var i = 0; i < data.length; i++) {
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

function getTechnology(id) {
    var request = new XMLHttpRequest();
    request.open("GET", "/api/technologies?id=" + id);
    request.addEventListener('load', function(event) {
        if (request.status == 200) {
            console.info(request.responseText);
        } else {
            console.error(request.statusText, request.responseText);
        }
    });
    request.send();
}

function getFluidsByType(fluidType) {
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

function verifyAll() {
    var valid = true;
    var customFluid = document.getElementById("checkbox-1-1").checked
    validTemp = verifyTemp(customFluid);
    validPressure = verifyPressure(customFluid);
    if (customFluid) {
        validVisc = verifyVisc();
        validDens = verifyDens();
    }
    if (validTemp && validPressure) {
        calculate();
    } else {
        alert("You need to enter right values.")
    }
}


function verifyTemp(customFluid) {
    var valid = true;
    var temperature = [
        "tempMin",
        "tempOp",
        "tempMax"
    ]
    if (customFluid) {
        var maxTemp = 350
        var minTemp = -200
    } else {
        var maxTemp = 1000
        var minTemp = -273.15
    }
    for (var i = 0; i < temperature.length; i++) {
        var tempEl = document.getElementById(temperature[i]);
        var temp = tempEl.value;
        //Todo: Denken Sie sich notwendige, nicht-fachliche Validierungen aus und implementieren Sie diese!
        //Mehr als isNaN()??
        if (temp > maxTemp || temp < minTemp || isNaN(temp)) {
            tempEl.setAttribute("validationError", "true");
            tempEl.setAttribute("class", "text small red")
            valid = false;
        } else {
            if (temp[i] == "tempOP") {
                tempEl.setAttribute("class", "text small operating-temperature")
            } else {
                tempEl.setAttribute("class", "text small")
            }
        }
    }
    return valid;
}

/*
absolut Maximale Viskosität: 2 mPas Minimale Viskosität: 0,01 mPas Maximale Dichte: 200 kg/m3 Minimale Dichte: 0,01 kg/m3
*/
function verifyVisc() {

    var valid = true;
    var viscosityValue = document.getElementById("viscosity").value;

    if (viscosityValue > 2 || viscosityValue < 0.01 || isNaN(temp)) {
        viscosityValue.setAttribute("validationError", "true");
        viscosityValue.setAttribute("class", "text red")
        valid = false;
    } else {
        tempEl.setAttribute("class", "text big disabled dynamic-viscosity")
    }
    return valid
}

function verifyDens() {
    var valid = true;
    var densityValue = document.getElementById("density").value;

    if (densityValue > 2 || densityValue < 0.01 || isNaN(temp)) {
        densityValue.setAttribute("validationError", "true");
        densityValue.setAttribute("class", "text red")
        valid = false;
    } else {
        tempEl.setAttribute("class", "text big disabled operating-density")
    }
    return valid
}

function verifyPressure(customFluid) {
    var valid = true;
    var pressure = [
        "pressMin",
        "pressOp",
        "pressMax"
    ]
    if (customFluid) {
        var maxPress = 200
        var minPress = 0
    } else {
        var maxPress = 500
        var minPress = 0.1
    }

    for (var i = 0; i < pressure.length; i++) {
        console.info(pressure[i])
        var pressElement = document.getElementById(pressure[i]);
        var temp = pressElement.value;
        //Todo: Denken Sie sich notwendige, nicht-fachliche Validierungen aus und implementieren Sie diese!
        //koennte sein, wenn nicht nur double vorhanden sind?!
        if (temp > maxPress || temp < minPress || isNaN(temp)) {
            pressElement.setAttribute("validationError", "true");
            pressElement.setAttribute("class", "text small red")
            valid = false;
        } else {
            pressElement.setAttribute("validationError", "false")
            if (pressure[i] == "pressOP") {
                pressElement.setAttribute("class", "text small operating-pressure")
            } else {
                pressElement.setAttribute("class", "text small")
            }
        }
        //ToDo: Die Validierung soll ausgeführt werden, wenn auf den „Calculate“-Button geklickt wird. Im Fehlerfall, soll zusätzlich zum roten Rahmen eine Meldung mit alert() ausgegeben werden, um den Benutzer mitzuteilen, dass alle Validierungsfehler behoben werden müssen, bevor die Berechnung ausgeführt werden kann.
        //Attribut und Klasse zurücksetzen!
    }
    return valid;
}

function calculate() {
    //T1, p1, must be global, as well as oldViscosity and oldDensity
    var t1 = localStorage.getItem("tempOpOld")
    var p1 = localStorage.getItem("pressOpOld")
    var t2 = document.getElementById("tempOp").value;
    var p2 = document.getElementById("pressOp").value;
    console.log("tempOpOld" + t1);
    console.log("pressOpOld" + p1);
    calculateViscosity(t1, t2);
    calculateDensity(p1, p2, t1, t2);
}

function calculateViscosity(t1, t2) {
    var oldViscosity = localStorage.getItem("viscosity")
    console.log("oldViscosity: " + oldViscosity);
    var newViscosity = oldViscosity * ((273.15 + t1) / (273.15 + t2))
    console.log("newViscosity: " + newViscosity);
    document.getElementById("viscosity").setAttribute("value", newViscosity);
    localStorage.setItem("viscosity", newViscosity)
}

function calculateDensity(p1, p2, t1, t2) {
    var oldDensity = localStorage.getItem("density")
    console.log("oldDensity: " + oldDensity);
    var newDensity = oldDensity * ((273.15 + t1) / (273.15 + t2)) * (p2 / p1)
    console.log("newDensity: " + newDensity);
    document.getElementById("density").setAttribute("value", newDensity);
    localStorage.setItem("density", newDensity)
}

function displayErrorMessage(element) {
    //Todo: Tooltips implementieren
    element.setalert("Temp is to high");
}

function adjustLayout(checkBox) {
    adjustLayoutOfViscosityAndDensity(checkBox);
    adjustLayoutOfBoxThirdMiddle(checkBox);
}

function adjustLayoutOfBoxThirdMiddle(checkBox) {
    var fluidName = document.getElementById("fluidName")
    console.log(fluidName);
    var fluidFormula = document.getElementById("fluidFormula")
    if (checkBox.checked) {
        console.log("adjustLayoutOfBoxThirdMiddle and checkbox is checked");
        if (fluidName.hasChildNodes()) {
            var children = fluidName.children;
            for (var i = 0; i < children.length; i++) {
                fluidName.removeChild(children[i])
            }
        }
        if (fluidFormula.hasChildNodes()) {
            children = fluidFormula.children;
            for (var i = 0; i < children.length; i++) {
                fluidFormula.removeChild(children[i]);
            }
        }
    } else {
        //  addChildrenToFluidDivs();
    }
}


function adjustLayoutOfViscosityAndDensity(checkBox) {
    var viscosity = document.getElementById("viscosity")
    var density = document.getElementById("density")
    if (checkBox.checked) {
        localStorage.setItem("oldViscosity", viscosity.value)
        viscosity.setAttribute("value", "")
        viscosity.setAttribute("type", "text")
        viscosity.removeAttribute("readonly")
        localStorage.setItem("oldDensity", density.value)
        density.setAttribute("value", "")
        density.setAttribute("type", "text")
        density.removeAttribute("readonly")
    } else {
        viscosity.setAttribute("readonly", "readonly")
        viscosity.setAttribute("value", localStorage.getItem("oldViscosity"))
        density.setAttribute("readonly", "readonly")
        density.setAttribute("value", localStorage.getItem("oldDensity"))
    }
}

$("body").on("change", ".technology", e => {
    getTechnology($(".technology").val());
});

$("body").on("change", ".productline.styled-select.light.big", e => {
    renderProductline($(".productline.styled-select.light.big").val());
});

$("body").on("change", ".regular-radio.first.fluid", e => {
    getFluidsByType($(".regular-radio.first.fluid").val());
});

$("#calculateform").submit(e => {
    e.preventDefault();

    console.log(e.target);
    verifyAll();
    /*  addItem(title);*/
    //alert("AddItemModal submitted");
});
/*$("body").on("click", "#calculateInput", e => {
    verifyAll();
});*/

$("body").on("change", "input", e => {
    console.info("input has been changed" + e.target.value)
    if (e.target.id == "radio-liquid") {
        localStorage.setItem(e.target.id, e.target.checked)
        localStorage.setItem("radio-gas", "false")
    } else if (e.target.id == "radio-gas") {
        localStorage.setItem(e.target.id, e.target.checked)
        localStorage.setItem("radio-liquid", "false")
    } else if (e.target.id == "radio-volume") {
        localStorage.setItem(e.target.id, e.target.checked)
        localStorage.setItem("radio-mass", "false")
    } else if (e.target.id == "radio-mass") {
        localStorage.setItem(e.target.id, e.target.checked)
        localStorage.setItem("radio-volume", "false")
    } else if (e.target.id === "tempOp") {
        var oldValue = localStorage.getItem(e.target.id)
        localStorage.setItem("tempOpOld", oldValue)
        localStorage.setItem(e.target.id, e.target.value)
    } else if (e.target.id == "pressOp") {
        var oldValue = localStorage.getItem(e.target.id)
        localStorage.setItem("pressOpOld", oldValue)
        localStorage.setItem(e.target.id, e.target.value)
    } else if (e.target.id === "checkbox-1-1") {
        var checkBox = document.getElementById(e.target.id)
        if (checkBox.checked) {
            localStorage.setItem(e.target.id, checkBox.checked)
        } else {
            localStorage.setItem(e.target.id, checkBox.checked)
        }
        adjustLayout(checkBox);
    } else {
        localStorage.setItem(e.target.id, e.target.value)
    }
    console.log(localStorage) //function aufrufen, die checked ob valError Attribut auf e.target gesetzt ist; wenn ja alert anzeigen
    if (e.target.getAttribute("validationError") == true) {
        displayErrorMessage(e.target);
    }
});

$("body").on("change", "select", e => {
    localStorage.setItem(e.target.id, e.target.value)
    console.log(localStorage);
})

$("body").on("mouseover", "input", e => {
    //  console.info("mouseover has been entered" + e.target + "end.");
    //function aufrufen, die checked ob valError Attribut auf e.target gesetzt ist; wenn ja alert anzeigen
    if (e.target.getAttribute("validationError") == true) {
        displayErrorMessage(e.target);
    }
    //  console.info("Leaving mouseover.")
});
