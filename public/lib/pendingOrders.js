const orderTemplate = document.querySelector('#order-template');
const dishTemplate = document.querySelector('#dish-template');
const ordersGrid = document.querySelector('[data-orders-grid]');

const orders = fetch("/orders/customerOrders")
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      document.write(`Error ${res.status}`);
      throw new Error(`Error ${res.status}`);
    }
  })
  .catch((err) => console.error(err));

orders.then((orders) => {
  if (orders.length === 0) {
    const msgBox = document.querySelector('[data-message-no-orders]');
    return msgBox.innerText = "You have no pending orders.";
}
    
    orders.forEach((order) => {
      // generate new order element
      const orderElement = document.importNode(orderTemplate.content, true);

      const appointTimeElement = orderElement.querySelector('[data-appoint-time]');
      appointTimeElement.innerText = ' Appointed Time: ' + order.appointTime;
      
      let totalPrice = 0;

      const dishes = order.dishes.reduce((acc, dish) => {
        // generate new dish element
        const dishElement = document.importNode(dishTemplate.content, true);
        
        dishElement.querySelector('[data-dish-name]').innerText = dish.dishName;
        dishElement.querySelector('[data-dish-qty]').innerText = 'x' + dish.qty;
        dishElement.querySelector('[data-dish-price]').innerText = '$' + dish.price;

        totalPrice += dish.price;

        return [...acc, dishElement];
      }, []);

      // append dishes table rows to the table body
      orderElement.querySelector('tbody').append(...dishes);

      // append total price
      orderElement.querySelector('[data-total-price]').innerText = '$' + totalPrice;

      // append order element to the orders grid
      ordersGrid.append(orderElement);
    });
});
