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
    var select = document.createElement("select");

    select.setAttribute("id", "technologyChoice")
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

$("body").on("change", ".technology-select", e => {
    renderProductlines($(".technology-select").val());
});

$("body").on("change", ".productline-select", e => {
    renderProductlineImage($(".productline-select").val());
});
