let shoppingMap = new Map();
let shoppingCont = 0;
let categoriesArray = [];
let productsArray = [];

let indexCategory = -1;

async function readJson() {
  let response = await fetch(
    "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json"
  );
  let data = await response.json();
  return data;
}

readJson().then((categories) => {
  let categoriesHtmlNav = document.getElementById("categories");
  let categoriesHtmlMenu = document.getElementById("menu");

  let catCont = 0;
  categories.forEach((category) => {
    categoriesHtmlNav.innerHTML += `<li class="nav-item">
        <a class="nav-link" href="#navigation" onclick="changeCategory(${catCont})">${category.name}</a>
            </li>`;
    categoriesArray.push(category.name);
    catCont += 1;

    categoriesHtmlMenu.innerHTML += `<div class="card-deck">
    <div class = "row" id = "${category.name.trim()}CardDeck" >`;
    category.products.forEach((product) => {
      document.getElementById(
        category.name.trim() + "CardDeck"
      ).innerHTML += `<div class="col-3 space menuProduct">
      <div class="card h-100">
        <img class="card-img-top menuImage" src=${product.image} alt="${product.name} image">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <h6>$${product.price}</h6>
          <a class="btn btn-dark" onclick="addToCar('${product.name}');">Add to car</a>
          </div>
        </div>
      </div>`;
      productsArray.push(product);
    });
    categoriesHtmlMenu.innerHTML += `</div> </div>`;
    document.getElementById(category.name.trim() + "CardDeck").hidden = true;
  });
  document.getElementById("order").hidden = true;
  document.getElementById("menu").hidden = true;
  document.getElementById("contItems").hidden = true;

});

function changeCategory(catIndex) {
  if (indexCategory != -1) {
    document.getElementById(
      categoriesArray[indexCategory].trim() + "CardDeck"
    ).hidden = true;
  } else {
    document.getElementById("menu").hidden = false;
  }
  indexCategory = catIndex;
  document.getElementById("categorySelected").innerHTML =
    categoriesArray[indexCategory];
  document.getElementById(
    categoriesArray[indexCategory].trim() + "CardDeck"
  ).hidden = false;

  document.getElementById("order").hidden = true;
  emptyOrder();
}

function addToCar(productName) {
  if(shoppingMap.get(productName) === undefined){
    shoppingMap.set(productName, 1);
  }
  else{
    let temp = shoppingMap.get(productName);
    temp++;
    shoppingMap.set(productName, temp);
  }
    shoppingCont++;
    document.getElementById("contItems").hidden = false;
    document.getElementById("contItems").innerHTML = shoppingCont + " items";
  }

function getOrder(){
  if(shoppingCont == 0){
    return;
  }
  indexCategory = -1;
  document.getElementById("menu").hidden = true;
  document.getElementById("order").hidden = false;

  var index = 0; var total=0;
  let tableOrder = document.getElementById("car");
  shoppingMap.forEach((quantity,productName) => {
    var obj = productsArray.find((product) => product.name === productName);
    let tr = document.createElement("tr");

    let td1 = document.createElement("td");
    td1.appendChild(document.createTextNode(++index));
    tr.appendChild(td1);

    let td2 = document.createElement("td");
    td2.appendChild(document.createTextNode(quantity));
    tr.appendChild(td2);

    let td3 = document.createElement("td");
    td3.appendChild(document.createTextNode(obj.name));
    tr.appendChild(td3);

    let td4 = document.createElement("td");
    td4.appendChild(document.createTextNode(obj.price));
    tr.appendChild(td4);

    let td5 = document.createElement("td");
    td5.appendChild(document.createTextNode((obj.price * quantity).toFixed(2)));
    tr.appendChild(td5);

    tableOrder.appendChild(tr);
    total += (obj.price * quantity);
  });
  document.getElementById("totalOrder").innerHTML = `Total $${total.toFixed(2)}`;
}

function emptyOrder(){
  let filas = document.getElementById("car");
  while (filas.firstChild) {
    filas.removeChild(filas.firstChild);
  }
}

function cancelOrder(){
  shoppingMap = new Map();
  shoppingCont = 0;
  emptyOrder();
  document.getElementById("order").hidden = true;
}

function generateConsole(){
  var index = 0;
  let print = [];
  shoppingMap.forEach((cant,productName) => {
    var product = productsArray.find((object) => object.name === productName);
    let printObject = {
      item: ++index,
      quantity: cant,
      description: product.name,
      unitPrice: product.price,
    };
    print.push(printObject);
  }); 
  console.log(print);

  cancelOrder();
}