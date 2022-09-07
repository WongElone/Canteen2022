const MyMenu = {
  todayMenus(spaceId, menus) {
    const menusContainers = [];

    for (let menu of menus) {
      const menuContainer = document.createElement("div");
      menusContainers.push(menuContainer);
      document.querySelector(spaceId).appendChild(menuContainer);
      menuContainer.classList.add("MenuContainer");

      const menuName = document.createElement("span");
      menuName.classList.add("MenuName");
      menuName.innerText = menu.name;
      menuContainer.appendChild(menuName);

      // create dishes table skeleton
      const table = document.createElement("table");
      menuContainer.appendChild(table);

      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");
      table.append(thead, tbody);

      const headRow = document.createElement("tr");
      thead.appendChild(headRow);

      const headRowName = document.createElement("th");
      headRow.appendChild(headRowName);
      headRowName.innerText = "Dish Name";
      headRowName.classList.add('DishNameHeader')

      const headRowPrice = document.createElement("th");
      headRow.appendChild(headRowPrice);
      headRowPrice.innerText = "Price (HKD)";
      headRowPrice.classList.add('DishPriceHeader')

      // Add dishes
      menu.dishes.forEach((dish) => {
        const tr = document.createElement("tr");
        tbody.appendChild(tr);
        tr.classList.add("dish");

        const name = document.createElement("td");
        tr.appendChild(name);
        name.innerText = dish.name;
        name.classList.add("dish_name");

        const price = document.createElement("td");
        tr.appendChild(price);
        price.innerText = "$" + dish.price;
        price.classList.add('DishPriceData');
      });
    }

    return menusContainers;
  },
};

const MyOrder = {
  renderOrders(spaceId, orders) {
    const ordersContainers = [];

    orders.forEach((order) => {
      const orderContainer = document.createElement('article');
      ordersContainers.push(orderContainer);
      document.querySelector(spaceId).appendChild(orderContainer);
      orderContainer.classList.add('OrderContainer');

      const timeBox = document.createElement('div');
      orderContainer.appendChild(timeBox);
      timeBox.innerText = ' Appointed Time: ' + order.appointTime;
      timeBox.classList.add('AppointTime');
      
      const table = document.createElement('table');
      orderContainer.appendChild(table);
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');
      table.append(thead, tbody);

      const headers = document.createElement('tr');
      thead.appendChild(headers);
      const headerDish = document.createElement('th');
      const headerQty = document.createElement('th');
      headerDish.innerText = 'Dish';
      headerQty.innerText = 'Quantity';
      headers.append(headerDish, headerQty);

      const rows = order.dishes.reduce((acc, dish) => {
        const row = document.createElement('tr');
        const dishName = document.createElement('td');
        const qty = document.createElement('td');

        dishName.innerText = dish.dishName;
        qty.innerText = dish.qty;

        row.append(dishName, qty);

        return [...acc, row];
      }, []);

      tbody.append(...rows);
    });

    return ordersContainers;
  }
};
