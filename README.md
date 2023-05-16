# Cat Shop

# Task 7
# Authorization

# Links to Product Service API
GET:
https://6h7c8p3orb.execute-api.us-east-1.amazonaws.com/dev/products
https://6h7c8p3orb.execute-api.us-east-1.amazonaws.com/dev/products/{id}
POST:
https://6h7c8p3orb.execute-api.us-east-1.amazonaws.com/dev/products

# FE PR link
https://github.com/anastasiya-antonenko/shop-angular-cloudfront

# Swagger
https://38qdz564qk.execute-api.us-east-1.amazonaws.com/swagger

# Deploy
https://d2eqrbxs5gge55.cloudfront.net/

# Tasks were completed:
  Evaluation criteria :
* authorization-service is added to the repo, has correct basicAuthorizer lambda and correct serverless.yaml file
* Import Service serverless.yaml file has authorizer configuration for the importProductsFile lambda. 
    Request to the importProductsFile lambda should work only with correct authorization_token being decoded and checked by
    basicAuthorizer lambda. Response should be in 403 HTTP status if access is denied for this user (invalid authorization_token) 
    and in 401 HTTP status if Authorization header is not provided.
* Client application is updated to send "Authorization: Basic authorization_token" header on import. 
    Client should get authorization_token value from browser localStorage
  Additional (optional) tasks:
* +30 - Client application should display alerts for the responses in 401 and 403 HTTP statuses.
