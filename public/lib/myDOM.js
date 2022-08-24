var MyMenu = {
  menusContainers: 1,

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

    this.menusContainers = menusContainers;
  },
};
