### Wake me up
Wake me up is a collaborative interface to make audio sample aquisition and validation.
Datas are collected anonymously, and can be used to feed audio corpus, and train language models.

### Download & Setup project

```
cd your/project/folder
git clone git@github.com:linto-ai/linto-wakemeup.git
cd wake-me-up/webserver && npm i
cd ../vue_app && npm i
```

### Setup environment variables

#### 1/ Front-end settings
Once you've downloaded the source code, go to your **wake-me-up/vue_app** folder and setup environment variables to make it work with your development and/or production environment.
There are 2 files to update :
- wake-me-up/vue_app/**.env.development**
```
VUE_APP_URL=http://localhost:3003
```
Set *VUE_APP_URL* to make it match with your **development** environment

- wake-me-up/vue_app/**.env.production**
```
VUE_APP_URL=https://wakemeup.linto.ai
```
Set *VUE_APP_URL* to make it match with your **production** environment

#### 2/ Back-end settings
You will have to create the **.env** file that will be used to setup the the interface configuration.
Make a copy of the **.envdefault** file to create your **.env** file

```
cd wake-me-up/webmserver
cp .envdefault .env
```

Once you have created your **.env** file, set the environment variables to match with your working environment.

```
# Webserver
NODE_ENV=production // (production || development)
HTTP_PORT=3003

# Mongodbsettings
BDD_TYPE=mongodb
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
MONGODB_DBNAME=MONGODB_DBNAME
MONGODB_REQUIRE_LOGIN=true
MONGODB_USER=MONGODB_USER
MOGODB_PSWD=MOGODB_PSWD

# Redis
REDIS_PORT=6379
REDIS_HOST=localhost

# SMTP
SMTP_HOST=SMTP_HOST
SMTP_PORT=SMTP_PORT
SMTP_SECURE=true
SMTP_REQUIRE_TLS=true
SMTP_AUTH=SMTP_AUTH
SMTP_PSWD=SMTP_PSWD
CONTACT_EMAIL=CONTACT_EMAIL
NO_REPLY_EMAIL=NO_REPLY_EMAIL

# Project URL
VUE_APP_URL=http://localhost:3003
```

### Building static files
#### Development mode
```
cd wake-me-up/vue_app
npm run buil-dev
```

#### Production mode
```
cd wake-me-up/vue_app
npm run buil-app
```

### Start the server
#### Development mode
```
cd wake-me-up/webserver
npm run start-dev
```

#### Production mode
```
cd wake-me-up/webserver
npm run start
```

Your application should be running on the port you've setted up (exemple: http://localhost:3003)

### Lauch application with docker
If you want to run your application with the Docker image, follow the previous instructions.
Instead of setting up the **/webserver/.env** file, you will have to setup the **/.docker_env** file.
```
cd wake-me-up
```

Edit the **/.docker_env** file. (cf. "2/ Back-end settings")

Once you've setted up the *.docker_env* file, lauch the project with the following command
```
cd wake-me-up
docker-compose up --build
```
Your application should be running on the port you've setted up
