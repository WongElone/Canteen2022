const menuOrderTemplate = document.querySelector("#menu--order-template");
const dishTemplate = document.querySelector("#dish-template");
const menusGrid = document.querySelector("[data-menus-grid]");

const LOCAL_STORAGE_ORDER_MENUS_KEY = "order.menus";
let orderMenus =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDER_MENUS_KEY)) || [];

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
    const titleMsg = document.querySelector("[data-title-msg]");
    return (titleMsg.innerText =
      "Our Menus for today have not been posted yet, please visit again later!");
  }
  orderMenus = data;
  save();
  renderMenu();
});

function save() {
  localStorage.setItem(
    LOCAL_STORAGE_ORDER_MENUS_KEY,
    JSON.stringify(orderMenus)
  );
}

function renderMenu() {
  orderMenus.forEach((menu) => {
    // generate new menu element
    const menuElement = document.importNode(menuOrderTemplate.content, true);

    // fill in the content of menu element
    const menuName = menuElement.querySelector("[data-menu-name]");
    menuName.innerText = menu.name;

    // fill in dishes content
    const dishes = menu.dishes.map((dish) => {
      // generate new dish element
      const dishElement = document.importNode(dishTemplate.content, true);

      dishElement.querySelector("[data-dish-name]").innerText = dish.name;
      dishElement.querySelector("[data-dish-price]").innerText =
        "$" + dish.price;

      return dishElement;
    });

    // append dishes table rows to the table body
    menuElement.querySelector("tbody").append(...dishes);

    // append menu element to the menus grid
    menusGrid.append(menuElement);
  });
}
