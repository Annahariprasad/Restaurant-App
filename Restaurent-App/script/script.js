var tables = {
    'table-1': {
        cost : 0, items : 0, orders : {}
    },
    'table-2' : {
        cost : 0, items : 0, orders : {}
    },
    'table-3' : {
        cost : 0, items : 0, orders : {}
    },
    'table-4' : {
        cost : 0, items : 0, orders : {}
    },
    'table-5' : {
        cost : 0, items : 0, orders : {}
    },
    'table-6' : {
        cost : 0, items : 0, orders : {}
    }
}

const menu = {
    'item-1' : { 
        name : 'Baby Corn 65',
        cost : 170,
        course : 'starter'
    },

    'item-2' : { 
        name : 'Veg Manchuria',
        cost : 150,
        course : 'starter'
    },

    'item-3' : { 
        name : 'Panner Manchuria',
        cost : 180,
        course : 'starter'
    },

    'item-4' : { 
        name : 'Butter Naan',
        cost : 25,
        course : 'main'
    },

    'item-5' : { 
        name : 'Egg Biryani',
        cost : 210,
        course : 'main'
    },

    'item-6' : { 
        name : 'Kaju Curry',
        cost : 180,
        course : 'main'
    },

    'item-7' : { 
        name : 'Plain Naan',
        cost : 20,
        course : 'main'
    },

    'item-8' : { 
        name : 'Gulab Jamum(2 pcs)',
        cost : 70,
        course : 'dessert'
    },

    'item-9' : { 
        name : 'Fruit Cream',
        cost : 80,
        course : 'dessert'
    },

    'item-10' : { 
        name : 'Kesar Pista',
        cost : 100,
        course : 'dessert'
    }
}


const table_list = document.querySelector(".table_list");
const menu_list = document.querySelector(".menu_list");

function page_load() {
    //loadStorage.clear();
    if(localStorage.getItem("tables") == null){
        localStorage.setItem("tables",JSON.stringify(tables));
    }
    if(localStorage.getItem("menu") == null){
        localStorage.setItem("menu",JSON.stringify(menu));
    }
    loadTables();
    loadMenu();
}

function loadTables(){
    let i=1;
    table_list.innerHTML = "";
    tables_data = JSON.parse(localStorage.getItem("tables"));
    //console.log("<---- Tables List ---->");
    //console.log(tables);
    while (tables_data["table-" + i] != undefined) {
      let { cost, items } = tables_data["table-" + i];
      let tableElement = createTableItem(i, cost, items);
      table_list.innerHTML += tableElement;
      i = i + 1;
    }
}

function createTableItem(i, cost, items){
    let tableItemElement = ` 
        <div class="table" id="table-${i}" ondrop="drop(event,'table-${i}')"  ondragover="allowDrop(event)" onclick="openModal('table-${i}')">
            <h2>Table-${i}</h2>
            <p>Rs. <span id="t${i}_amount">${cost}</span> | Total items: <span id="t${i}_items">${items}</span></p>
        </div>`;
        
    return tableItemElement;
}

function loadMenu(){
    menu_list.innerHTML = "";
    let i = 1;
    console.log("<---- Menu List ---->");
    console.log(menu);
    while (menu["item-" + i] != undefined) {
      let { name, cost, course } = menu["item-" + i];
      let menuItemElement = createMenuItem(i, name, cost, course);
      menu_list.innerHTML += menuItemElement;
      i = i + 1;
    }
}


function createMenuItem(i, name, cost, course) {
    let menuItemElement = `
    <div class="item" id="item-${i}" draggable="true" ondragstart="drag(event)">
        <h2>${name}</h2>
        <p>
            <span id="item${i}_price">${cost}.00</span>,
            <span id="course">${course}</span>
        </p>
    </div>`;

    return menuItemElement;
  }

function search_table() {

    let searchKey = table_search.value;
    searchKey = searchKey.toLowerCase();
    
    //console.log(searchKey);

    if (searchKey == "") {
      loadTables();
      return;
    }

    let number = searchKey.split("-")[1];
    
    //console.log(number);

    if (number != undefined && number[1] != "") {

      let table_no = parseInt(number);
  
      tables = JSON.parse(localStorage.getItem("tables"));
  
      if (tables["table-" + table_no] == undefined) {
          return;
      }

      let {cost, items} = tables["table-" + table_no];
  
      let tableElement = createTableItem(table_no, cost, items);

      table_list.innerHTML = tableElement;

    }
  }

  function search_item() {

    let searchKey = item_search.value;
    searchKey = searchKey.toLowerCase();

    if (searchKey == "") {
      loadMenu();
    }

    if (searchKey.length <= 1) return;

    let menuId = document.querySelector(".menu_list");
    menuId.innerHTML = " ";

    let i = 1;

    while (menu["item-" + i] != undefined) {

      let {name, cost, course} = menu["item-" + i];

      let lowerCaseName = name.toLowerCase();

      if (lowerCaseName.includes(searchKey)) {

        let menuElement = createMenuItem(i, name, cost, course);
        menuId.innerHTML += menuElement;

      } else if (course.includes(searchKey)) {

        let menuElement = createMenuItem(i, name, cost, course);
        menuId.innerHTML += menuElement;

      }

      i = i + 1;
    }
  }

function drag(event) {
    event.dataTransfer.setData("id", event.target.id);
}

function allowDrop(ev){
    ev.preventDefault();
}

function drop(event,tableName){
    event.preventDefault();
    addItemToTable(tableName, event.dataTransfer.getData("id"));
}

function addItemToTable(tableName, menuItemName) {
  console.log(tableName);
  console.log(menuItemName);
  let tables = JSON.parse(localStorage.getItem("tables"));
  console.log(tables);
  let currentOrder = menu[menuItemName];
  if (tables[tableName]["orders"][menuItemName] == undefined) {
    tables[tableName]["orders"][menuItemName] = 1;
    //tables[tableName]["items"] += 1;
  } else {
    tables[tableName]["orders"][menuItemName] += 1;
  }
  tables[tableName].cost += parseInt(currentOrder.cost);

  tables[tableName]["items"] += 1;

  localStorage.setItem("tables", JSON.stringify(tables));
  loadTables();
  search_table();
}

//Model Thing

var tableInfoId = document.getElementById("table-info-items");

function openModal(tableName) {
  modal.style.display = "block";

  document.getElementById("modal-table-name").innerHTML = `<h2> ${tableName.toUpperCase()} | Order Details</h2>`;
  tableInfoId.innerHTML = `<tr>
    <td>S.No</td>
    <td>Item Name</td>
    <td>Cost</td>
    <td>Quantity</td>
    <td>Delete</td>
</tr>`;
  createRows(tableName);
}

function closeModal(){
    modal.style.display = "none";
}
  
function createRows(tableName) {
    let i = 0;
    let tables = JSON.parse(localStorage.getItem("tables"));
    let { cost, orders: currentOrders } = tables[tableName];
    console.log(cost);
    console.log(currentOrders)
    for (let [item, quantity] of Object.entries(currentOrders)) {
        i++;
        console.log(item)
        tableInfoId.innerHTML += `<tr>
        <td>${i}</td>
        <td>${menu[item].name}</td>
        <td>${menu[item].cost} </td>
        <td>
        <button onclick="reduceItem('${tableName}','${item}')" class="change">-</button>
        ${quantity}
        <button onclick="increaseItem('${tableName}','${item}')" class="change">+</button>
        </td>
        <td>
        <button onclick="deleteItem('${tableName}','${item}')">
        Delete
        </button>
        </td>   
    </tr>`;
    }

    let footer = document.getElementById("modal-footer");
    footer.innerHTML = "";
    let generateBillButton = document.getElementById("generate-bill");
    generateBillButton.innerHTML = "";
    if (cost != 0) {
        footer.innerHTML = `<h2>Total Cost : ${cost}</h2>`;
        generateBillButton.innerHTML = `<button onclick="generatePdf('${tableName}')" id="button-close">
            Close session(Generate Bill)</button>`;
        }
}

function reduceItem(tableName, item) {
    let tables = JSON.parse(localStorage.getItem("tables"));
    let currentTable = tables[tableName];
    if (currentTable["orders"][item] == 1) {
        console.log("Cannot delete 1 item");
        return;
    }
    let itemCost = menu[item]["cost"];
    currentTable["orders"][item] = currentTable["orders"][item] - 1;
    currentTable["cost"] = currentTable["cost"] - itemCost;
    currentTable["items"] -= 1;
    tables[tableName] = currentTable;
    localStorage.setItem("tables", JSON.stringify(tables));
    loadTables();
    openModal(tableName);
}

function increaseItem(tableName, item) {
    let tables = JSON.parse(localStorage.getItem("tables"));
    let currentTable = tables[tableName];
    let itemCost = menu[item]["cost"];
    currentTable["orders"][item] = currentTable["orders"][item] + 1;
    currentTable["cost"] = parseInt(currentTable["cost"]) + itemCost;
    currentTable["items"] += 1;
    tables[tableName] = currentTable;
    localStorage.setItem("tables", JSON.stringify(tables));
    loadTables();
    openModal(tableName);
}

function deleteItem(tableName, item) {
    let tables = JSON.parse(localStorage.getItem("tables"));
    let currentTable = tables[tableName];
    let itemCount = currentTable["orders"][item];
    let itemCost = menu[item]["cost"];
    delete currentTable["orders"][item];
    currentTable["cost"] = parseInt(currentTable["cost"]) - itemCount * itemCost;
    currentTable["items"] -= itemCount;
    tables[tableName] = currentTable;
    localStorage.setItem("tables", JSON.stringify(tables));
    loadTables();
    openModal(tableName);
}


function generatePdf(tableName) {
    const element = document.getElementById('table-info-items');
    var opt = {
      margin: 1,
      filename: 'Bill.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
    closeModal();
    loadTables();  
}
