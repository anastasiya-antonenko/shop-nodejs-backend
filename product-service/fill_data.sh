aws dynamodb put-item \
    --table-name products  \
    --item \
        '{"id": {"S": "3"}, "title": {"S": "Cat 3"}, "description": {"S": "Description for cat 3"}, "price": {"N": "200"}}'

aws dynamodb put-item \
    --table-name stocks  \
    --item \
        '{"product_id": {"S": "2"}, "count": {"N": "1"}}'
