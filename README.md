# Recipe app

In this example there are endpoints to:

    - register user
    - log in user
    - create recipe
    - list and search for recipe
    - list and search for users

There is also an OpenApi definition that is used for validation and type generation.
There is also a postman collection that can be used to call the endpoints.

## Run

Create env file with the following config

```
DB_USER=<db_username>
DB_PASSWORD=<db_password>
DB_HOST=<db_host>
```

### Docker

```
docker compose up
```

### Build, test and run

```
yarn install
yarn build
yarn test
yarn start
```

