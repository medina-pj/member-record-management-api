# README

### What is this repository for?

- REST API for supporter-resgistration-app repository
- This system can manage/view the members of certain organization

### How do I get set up?

- Create mongodb database and copy the mongodb uri (https://account.mongodb.com/account/login)
- Create S3 Bucket and copy the S3 Credentials (https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-node-examples.html)
- Create env file with your own jwt private key and mongodb uri you created. Copy format from .env.example
- Install dependencies `yarn install`
- Start Application `yarn run dev`
