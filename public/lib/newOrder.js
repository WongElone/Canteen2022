const menuContainerTemplate = document.querySelector(
  "#menu-container-template"
);
const foodTemplate = document.querySelector("#food-template");
const sectionMenus = document.querySelector("#section-menus");
const sectionForm = document.querySelector("#section-form");
const appointTimeElement = document.querySelector("#appoint-time");
const appointTimeValidateMsg = document.querySelector('[data-appoint-time-validate-msg]');
const submitValidateMsg = document.querySelector('[data-submit-validate-msg]');

let menus = [];

const LOCAL_STORAGE_NEWORDER_KEY = "canteen.newOrder";
let newOrder =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_NEWORDER_KEY)) || {};

let totalQty = Object.keys(newOrder).reduce((acc, menuId) => {
  const qties = Object.keys(newOrder[menuId]).reduce((acc, foodName) => {
    const qty = newOrder[menuId][foodName];
    return qty != undefined ? acc + qty : acc;
  }, 0);
  return acc + qties;
}, 0);

const MAX_TOTAL_QTY = 50;

// fetch menus from server
const data = fetch("/menus/today")
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      document.write(`Error ${res.status}`);
      throw new Error(`Error ${res.status}`);
    }
  })
  .catch((err) => console.error(err));

data.then((data) => {
  if (data.length === 0) {
    const h1 = document.querySelector("h1");
    const titleMsg = document.createElement('h3');
    titleMsg.innerText =
      "Our Menus for today have not been posted yet, please visit again later!";
    
    return h1.after(titleMsg);
  }

  menus = data;
  save();
  renderMenus();
  resetAppointTime();
});

sectionMenus.addEventListener("click", function (e) {
  if (!e.target.classList.contains("food__btn")) return;

  const foodElement = e.target.closest(".food");

  const foodQtyStr = foodElement.querySelector("[data-food-qty-str]");

  const qty = parseInt(foodQtyStr.innerText);

  if (e.target.classList.contains("food__btn--add")) {
    foodQtyStr.innerText = qty + 1;
    totalQty++;
  } else if (e.target.classList.contains("food__btn--minus")) {
    foodQtyStr.innerText = qty - 1;
    totalQty--;
  }

  const menuContainer = foodElement.closest("[data-menu-container]");
  const menuId = menuContainer.querySelector("[data-menu-id]").value;

  updateOrder(
    menuId,
    foodElement.querySelector("[data-food-name]").innerText,
    parseInt(foodQtyStr.innerText)
  );

  const menu = menus.find((menu) => menu._id === menuId);
  renderFoods(menu, menuContainer);
});

sectionForm.addEventListener("submit", (e) => {
  if (!validateAppointTime()) return e.preventDefault();

  const dishnamesXqtys = Array.from(
    document.querySelectorAll("[data-food]")
  ).reduce((acc, food) => {
    const name = food.querySelector("[data-food-name]").innerText;
    const qty = parseInt(food.querySelector("[data-food-qty-str]").innerText);
    if (qty > 0) acc[name] = acc[name] ? acc[name] + qty : qty;
    return acc;
  }, {});

  if (Object.keys(dishnamesXqtys).length === 0) {
    submitValidateMsg.innerText = "You current have no food selected."
    return e.preventDefault();
  }

  document.querySelector("#input-order").value = JSON.stringify(dishnamesXqtys);

  localStorage.removeItem(LOCAL_STORAGE_NEWORDER_KEY);
});

function validateAppointTime() {
  const currHKTime = new Date()
    .toLocaleString("en-UK", { timeZone: "Asia/Singapore" })
    .slice(12, 17);
  const hour = parseInt(currHKTime.slice(0, 2));
  const minute = parseInt(currHKTime.slice(3, 5));

  if (hour >= 21) {
    appointTimeElement.disabled = true;
    appointTimeValidateMsg.innerText = "Sorry, service hour is over.";
    return false;
  } else {
    const appointHour = parseInt(appointTimeElement.value.slice(0, 2));
    const appointMin = parseInt(appointTimeElement.value.slice(3, 5));

    // if appoint time is less than one hour ahead
    if (
      appointHour <= hour ||
      (appointHour === (hour + 1) && appointMin < minute)
    ) {
      appointTimeValidateMsg.innerText = 'Appointed time must be at least one hour ahead of current time.';
      resetAppointTime();
      return false;
    } else if (appointHour < 10) {
      appointTimeValidateMsg.innerText = 'Appointed time cannot be earlier than 10:00 AM';
      return false;
    } else if (appointHour >= 22) {
      appointTimeValidateMsg.innerText = 'Appointed time cannot be after 9:59 PM';
      return false;
    }
  }
  return true;
}

function resetAppointTime() {
  const currHKTime = new Date()
    .toLocaleString("en-UK", { timeZone: "Asia/Singapore" })
    .slice(12, 17);
  const hour = parseInt(currHKTime.slice(0, 2));

  if (hour >= 21) {
    appointTimeElement.disabled = true;
    appointTimeValidateMsg.innerText = "Sorry, service hour is over.";
  } else if (hour < 9) {
    // appointTimeElement.setAttribute("min", "10:00");
    appointTimeElement.value = "10:00";
  } else {
    const anHourLater = (hour + 1).toString() + currHKTime.slice(2, 5);
    // appointTimeElement.setAttribute("min", anHourLater);
    appointTimeElement.value = anHourLater;
  }
}

function renderMenus() {
  clearChildren(sectionMenus);

  menus.forEach((menu) => {
    // generate new menu container
    const menuContainer = document.importNode(
      menuContainerTemplate.content,
      true
    );

    // fill in the content of menu container
    const menuName = menuContainer.querySelector("[data-menu-name]");
    menuName.innerText = menu.name;
    const menuId = menuContainer.querySelector("[data-menu-id]");
    menuId.value = menu._id;

    renderFoods(menu, menuContainer);

    // append menu container to the menus grid
    sectionMenus.append(menuContainer);
  });
}

function renderFoods(menu, menuContainer) {
  const foodsContainer = menuContainer.querySelector("[data-foods-container]");

  clearChildren(foodsContainer);

  // fill in foods content
  const foodsElements = menu.dishes.map((dish) => {
    // generate new food element
    const foodElement = document.importNode(foodTemplate.content, true);

    foodElement.querySelector("[data-food-name]").innerText = dish.name;
    foodElement.querySelector("[data-food-price]").innerText = "$" + dish.price;

    const foodQtyStr = foodElement.querySelector("[data-food-qty-str]");

    if (
      !(
        newOrder[menu._id] == undefined ||
        newOrder[menu._id][dish.name] == undefined
      )
    ) {
      foodQtyStr.innerText = newOrder[menu._id][dish.name];
    }

    if (foodQtyStr.innerText === "0") {
      foodElement.querySelector(".food__btn--minus").disabled = true;
    }

    if (totalQty >= MAX_TOTAL_QTY || foodQtyStr.innerText === "10") {
      foodElement.querySelector(".food__btn--add").disabled = true;
    }

    return foodElement;
  });

  // append foods elements to foods container in menu container
  foodsContainer.append(...foodsElements);
}

function updateOrder(menuId, foodName, foodQty) {
  if (!newOrder[menuId]) newOrder[menuId] = {};
  newOrder[menuId][foodName] = foodQty;

  save();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_NEWORDER_KEY, JSON.stringify(newOrder));
}

function clearChildren(node) {
  while (node.lastElementChild) {
    node.removeChild(node.lastElementChild);
  }
}
