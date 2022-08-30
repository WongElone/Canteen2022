# Canteen 2022
### Link: [Canteen2022](https://canteen2022.herokuapp.com/) 

Canteen staff account:  
• username: staff  
• password: staff123456  
*The website allows creating customer accounts, but not staff accounts.  

### Description:
A coding practice of building a website. The backend is being built with Express.js and MongoDB, and the frontend is being built with JS, HTML, CSS, and EJS.

The website is about posting menus by the staff of the canteen for customers to view, and allows customers to order dishes for takeaway.

### Features for staff account
• View pending orders, completed orders, and abandoned orders.  
• Change status of orders (pending → completed / abandoned).  
• Remove completed / abandoned menus.  
• View, create, and remove menus.  
• View, create, and remove dishes.  
• View customers' info.  

### Features for customer account
• View today menus and order dishes with an appointed time .  
• View their own pending orders.  

### Details:
• The time of the system applies Hong Kong local time (UTC +8).  
• The canteen does not accept any orders of an appointed time before 10:00 and after 22:00.  
• The minimum gap between the time an order is submitted and the appointed time must be at least an hour.  
• If an order is not completed on the day it is requested, the order will be classified as an abandoned order.  
