# API Disease Prediction based Symptoms with Machine Learning

Product Capstone Bangkit Academy 2022

## Tech Stack

**Mobile:** Kotlin

**Machine Learning:** Fast API, Tensorflow, Gunicorn

**Client:** React, React-dom, Axios, Bulma CSS, CKEditor 5, Lodash

**Server:** NodeJS, ExpressJS, MySQL, Sequelize, Google Cloud Storage, Multer, Joi, Jsonwebtoken, Cookie-Parser, Dotenv, Cors, Bcrypt

**Scraping App:** Python, request, ReGex, csv, GoogleTrans. & NodeJS, ExpressJs, Cheerio, Axios.

## API and Admin dashboard Features

- JWT Login with access and refresh token (http only cookie) (access token expired in 20s)

- 2 Users role, admin & users with login validation and admin user management (ban, make admin, etc)

- Role based route authorization

- Upload files to Google Cloud Storage (Max 5mb)

- CRUD diseases, diseases categories, drugs, deseases-drugs with deletion validation (won't delete data if used by other table)

- Search to database

- Form validation using JOI

- SSL connection

## API Deployment Link

https://api.capstone.matthewbd.my.id

deployed in GCP CE (N2 High CPU 2 Cores 2Gb ram) + Google Cloud Storage Bucket

## ML API Deployment Link

https://ml.matthewbd.my.id

deployed in GCP CE (N2 High CPU 2 Cores 2Gb ram)

## Admin Dashboard Deployment

https://capstone.matthewbd.my.id

deployed in GCP CE

## User API Reference

Auto check user request from JWT Token (can't change another user's data when the token doesn't match).

#### Login

```http
  POST /login
```

| Parameter  | Type     | Description  |
| :--------- | :------- | :----------- |
| `email`    | `string` | **Required** |
| `password` | `string` | **Required** |

#### notes

Already response with userdata. and if user "isactive" == 0 or banned, API will response 403.

#### Login - APP (without httponly Cookie)

```http
  POST /login-app
```

| Parameter  | Type     | Description  |
| :--------- | :------- | :----------- |
| `email`    | `string` | **Required** |
| `password` | `string` | **Required** |

#### notes

Already response with userdata. and if user "isactive" == 0 or banned, API will response 403.

#### Register

```http
  POST /register
```

| Parameter      | Type     | Description  |
| :------------- | :------- | :----------- |
| `email`        | `string` | **Required** |
| `username`     | `string` | **Required** |
| `name`         | `string` | **Required** |
| `address`      | `string` |              |
| `phonenum`     | `string` |              |
| `birthdate`    | `string` |              |
| `password`     | `string` | **Required** |
| `confpassword` | `string` | **Required** |

#### notes

user image automatically use default profile picture. Update!, check email and username that exist and joi form validation

#### Get token

```http
  GET /token
```

#### notes

Access token expired in 20s. Please read web in Acknowledgement

#### Get token

```http
  POST /token-app
```

| Parameter      | Type     | Description  |
| :------------- | :------- | :----------- |
| `refreshToken` | `string` | **Required** |

#### notes

Access token expired in 20s. Please read web in Acknowledgement

#### Logout

```http
  GET /logout
```

#### Update profile

```http
  POST /user/update
```

| Parameter   | Type     | Description  |
| :---------- | :------- | :----------- |
| `email`     | `string` | **Required** |
| `name`      | `string` | **Required** |
| `address`   | `string` |              |
| `phonenum`  | `string` |              |
| `birthdate` | `string` |              |

#### Update user password

```http
  POST /user/updatepassword
```

| Parameter      | Type     | Description  |
| :------------- | :------- | :----------- |
| `email`        | `string` | **Required** |
| `oldpassword`  | `string` | **Required** |
| `newpassword`  | `string` | **Required** |
| `confpassword` | `string` | **Required** |

#### Update profile picture

```http
  POST /user/update-profile-picture
```

| Parameter | Type     | Description  |
| :-------- | :------- | :----------- |
| `email`   | `string` | **Required** |
| `file`    | `file`   | **Required** |

#### notes

"file" use http post file upload. Max file 5Mb (.jpg, .png, .jpeg). Please read web in Acknowledgement

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

#### Post search disease

```http
  POST /diseases
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `keyword` | `string` | **Required**. Anything in diseases |

#### Post search drugs

```http
  POST /drugs
```

| Parameter | Type     | Description                     |
| :-------- | :------- | :------------------------------ |
| `keyword` | `string` | **Required**. Anything in drugs |

## Admin API Reference (Admin role required)

#### Post admin login

```http
  POST /adminlogin
```

#### Get all users

```http
  GET /users
```

#### Get ban users

```http
  GET /banuser/:email
```

#### Get unban users

```http
  GET /unbanuser/:email
```

#### Get make admin

```http
  GET /makeadmin/:email
```

#### Get make user

```http
  GET /makeuser/:email
```

## Admin CRUD API Reference (Admin role required) (also applies to other tables)

#### Get all diseases

```http
  GET /admin/diseases
```

#### Get diseases by slug

```http
  GET /admin/diseases/:slug
```

#### Post make disease

```http
  POST /admin/diseases
```

#### Patch update disease

```http
  PATCH /admin/diseases/:slug
```

#### Delete disease

```http
  DELETE /admin/diseases/:slug
```

## Acknowledgements

- [Diseases Prediction Mobile App ](https://github.com/KristiantoD/disease-prediction-app)
- [Fast API ML API ](https://github.com/danielsyahputra13/ml_capstone)
- [ML Docs ](https://ml.matthewbd.my.id/docs)
- [ML Datasets ](https://archive.ics.uci.edu/ml/datasets/Drug+Review+Dataset+%28Drugs.com%29)

- [Kotlin AccessToken and RefreshToken ](https://stackoverflow.com/questions/22450036/refreshing-oauth-token-using-retrofit-without-modifying-all-calls)
- [Kotlin File POST ](https://stackoverflow.com/questions/57490228/how-to-upload-an-image-to-a-server-using-http-request-in-kotlin)

## Deployment

Install dependency first

```bash
  npm install
```

To deploy this project run

```bash
  npm run start
```

API app will run in port 5000 & React app will run in port 3000

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`ACCESS_TOKEN_SECRET`

`REFRESH_TOKEN_SECRET`

`GCS_BUCKET`

`GCLOUD_PROJECT`

`GCLOUD_CLIENT_EMAIL`

`GCLOUD_PRIVATE_KEY`

Sequelize MySql database configuration in config/database.js

Set your frontend domain in cors configuration in index.js

If deployment have ssl, set secure mode in login cookie setting in app/controllers/Users.js
