# Smog Check App

## [First Time Setup Guide](#first-time-setup-guide)

### [1. Install Docker if it is not installed](#1-install-docker-if-it-is-not-installed)

- Follow the linked guide to install [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/)
- Docker requires that [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install) is installed as well
- Once installed, check that it is available using the command `docker -v`

### [2. Create a file named `.env` in this directory](#2-create-a-file-named-env-in-this-directory)

- Follow the `example.env` file to fill in necessary information, making sure to follow to the env syntax

### [3. Create a Docker Volume named `smog-data` for the database](#3-create-a-docker-volume-named-smog-data-for-the-database)

- A Docker Volume is used to persist data inside the container, so that when it is shutdown the data stays
- This volume will be used to persist the information in the postgres database
- To create the volume, use the terminal and type the command `docker volume create --name smog-data`
- The name refers to the name of the volume specified in `compose.yaml`

### [4. Setup the database](#4-setup-the-database)

- Initially, the database will be empty, so data from the old database will have to be transferred
    1. To dump data from `ACCDB` to an `sql` dump, download and use [Access to PostgreSQL](https://www.bullzip.com/products/a2p/info.php)
    2. In the tool, make sure the database name is set to what was set in the `.env` file, such as `smogdb`
    3. Dump the desired data into a `sql` dump, for example `dump.sql`
    3. Run the database using command `docker compose up -d smog-db`
        - If it is the first time, Docker will install the image first
    4. Once it is running, import the dump to the database using `source .env; docker exec -i smog-db psql -U $POSTGRES_USER $POSTGRES_DB_NAME < dump.sql`
        - If the `.env` file was configured correctly, the sections marked with a dollar sign (ex: `$POSTGRES_USER`) will be auto filled by the provided env file from the `source .env` command
        - This process may take a long time depending on the size of the dump, so do not exit midway
        - You know it will be done when you can see the console prompt again
- Repeat with any other databases you might want to import

### [5. Start the services using Docker Compose](#5-start-the-services-using-docker-compose)

- Docker Compose can handle running multiple services at once, such as a database, server, and client
- The configuration is defined in the file named `compose.yaml`
- To start the all services, run `docker compose up -d --force-recreate` to run detached or `docker compose up --force-recreate`
    - `--force-recreate` will stop already running instances of the service and recreate them
    - This is optional
- Required images will be installed and built, which can take some time
- Once they are up, the running containers will be listed in the console

### [6. Connect to the app on any browser](#6-connect-to-the-app-on-any-browser)

- If the web app is running, it will be running on the local host address with the given port, for example `3000`
- To connect to it, go to http://localhost:3000 or http://127.0.0.1:3000

## [Shutting Down](#shutting-down)

- To stop all services, run the command `docker compose down`

## [Starting Up in the Future](#starting-up-in-the-future)

- To start all services again, run the command `docker compose up -d` to run detached or `docker compose up`

## [Server API Details](#server-details)

- The `smog-api` server creates a directory called `temp` in this directory, which is shared with the host machine and the docker service
- It will contain generated invoices and other saved files from the server

## [Development](#development)

This repository is a monorepo, with packages `webapp` for the app and `backend` for the server. It was developed using NodeJS 20+. If you want to work on the project, make sure NodeJS and NPM are installed.

- To download project dependencies, run `npm install` in the root directory


