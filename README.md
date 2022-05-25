# API Disease Prediction based Symptoms with Machine Learning

Product Capstone Bangkit 2022

## Tech Stack

**Mobile:** Kotlin

**Client:** React

**Server:** Node, Express, MySQL, Sequelize

## TO DO

- Complete auth system

- Complete CRUD and cleanning database

- build 404 function if data not found

- Development React admin panel

## API Deployment Link

https://api.capstone.matthewbd.my.id

deployed in GCP CE

## User API Reference

#### Login

```http
  POST /login
```

| Parameter  | Type     | Description  |
| :--------- | :------- | :----------- |
| `email`    | `string` | **Required** |
| `password` | `string` | **Required** |

#### Register

```http
  POST /register
```

| Parameter      | Type     | Description  |
| :------------- | :------- | :----------- |
| `email`        | `string` | **Required** |
| `username`     | `string` | **Required** |
| `name`         | `string` | **Required** |
| `password`     | `string` | **Required** |
| `confpassword` | `string` | **Required** |

#### notes

Full user data -> email, username, name, address, phonenum, birthdate, img, password.

#### Get token

```http
  GET /token
```

#### notes

Access token expired in 20s. Please read web in Acknowledgement

#### Logout

```http
  GET /logout
```

#### Update profile (soon)

## Data API Reference (login required)

#### notes

use Authorization -> Bearer Token
(.addHeader("Authorization", "Bearer " + token))

#### Get all Diseases

```http
  GET /diseases
```

#### Get disease

```http
  GET /diseases/${slug}
```

#### Get all Disease Categories

```http
  GET /diseases-category
```

#### Get disease category

```http
  GET /diseases-category/${slug}
```

#### Get all drugs

```http
  GET /drugs
```

#### Get disease

```http
  GET /drugs/${slug}
```

#### Get disease - drug

```http
  GET /diseases-drugs/${slug}
```

#### Post search (also for find prediction result)

```http
  POST /search
```

| Parameter | Type     | Description                                  |
| :-------- | :------- | :------------------------------------------- |
| `keyword` | `string` | **Required**. Anything in diseases and drugs |

## Acknowledgements

- [Kotlin AccessToken and RefreshToken ](https://stackoverflow.com/questions/22450036/refreshing-oauth-token-using-retrofit-without-modifying-all-calls)

## Deployment

Install dependency first

```bash
  npm install
```

To deploy this project run

```bash
  npm run start
```

App will run in port 5000

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`ACCESS_TOKEN_SECRET`

`REFRESH_TOKEN_SECRET`

Sequelize database configuration in config/database.js
