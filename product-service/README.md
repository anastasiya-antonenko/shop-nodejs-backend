# Cat Shop

# Task 4
# Integration with NoSQL Database

# Links to Product Service API
GET:
https://afgfgse3n7.execute-api.us-east-1.amazonaws.com/dev/products
https://afgfgse3n7.execute-api.us-east-1.amazonaws.com/dev/products/{id}
POST:
https://afgfgse3n7.execute-api.us-east-1.amazonaws.com/dev/products

# FE PR link
https://github.com/anastasiya-antonenko/shop-angular-cloudfront

# Swagger
https://38qdz564qk.execute-api.us-east-1.amazonaws.com/swagger

# Deploy 
https://d1gjzqq39e70nl.cloudfront.net/

# Tasks were completed:
Evaluation criteria :
* Task 4.1 is implemented
* Task 4.2 is implemented lambda links are provided and returns data
* Task 4.3 is implemented lambda links are provided and products is stored in DB
* Your own Frontend application is integrated with Product Service (/products API) and products from Product Service are represented on Frontend. 
Link to a working Frontend application is provided for cross-check reviewer.
Additional (optional) tasks
* +6 - POST /products lambda functions returns error 400 status code if product data is invalid
* +6 - All lambdas return error 500 status code on any error (DB connection, any unhandled error in code)
* +6 - All lambdas do console.log for each incoming requests and their arguments
* +6 - Transaction based creation of product
