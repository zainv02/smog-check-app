# Quick Start
To start the database server:
`npm run start-db`
To stop the database server:
`npm run stop-db`
### To do:
- add checks to the bash scripts that exit if it can't connect
- add checks to the stop script that doesn't dump if there is an error (if possible)
- allow for dumping multiple databases defined by an array


# Docker postgresql

### Install Docker
Install the docker CLI. On windows, install docker desktop. Make sure that docker compose is with it.
- Also recommended is the Docker VSCode extension

## Docker Compose Method

With a `compose.yaml` file, you can run:
`docker compose -f compose.yaml up --detach` or just `docker compose up --detach`
- `-f compose.yaml` chooses the setup file for the services. By default it will choose any compose file in the directory
- `up` is the compose command to start the containers
- `--detach` detaches the container from the terminal so that you can still type in the terminal

The compose creates a local folder 

To check the containers running:
`docker container ls`

To shut down and remove containers:
`docker compose down`

## Docker Run Method

### Setup postgres image
With docker installed, pull the latest official postgres image
`docker pull postgres`

To run a postgres container:
`docker run --name <container-name> -e POSTGRES_PASSWORD="123" -d -p 8080:5432 postgres`
- `--name <container-name>` is the name of the container, which can be anything
- `-e POSTGRES_PASSWORD="123"` is the secret password which can be anything in quotes
- `-d, --detach` detaches the container from the terminal so that you can still type in the terminal
- `-p, --publish 8080:5432` maps the host port (the machine running the container) `8080` to the container port (inside the container) `5432` by default. The host port can be any port, even the same port, such as `5432:5432`
- `postgres` the last parameter is the image name, which is `postgres`, the official image pulled from docker

To check the containers running:
`docker container ls`

To stop the container and remove it:
`docker stop <container-name>`
`docker rm <container-name>`

## Using the container

### Connecting to the database
You can use `psql` to connect to the database. The address is the host machine address + the mapped container port.
`psql -h localhost -p 8080 -U postgres`
- `-h localhost` is the ip address/host
- `-p 8080` is the opened port
- `-U postgres` is the user to connect as, postgres being the default
Upon connecting, it will prompt you to enter a password, which you set when using `docker run`.
If prompted for a user password, enter the POSTGRESS_PASSWORD.

### Accessing the container terminal
`docker exec -it <container-name> bash`

### Downloading a database to dump
[Ref](https://davejansen.com/how-to-dump-and-restore-a-postgresql-database-from-a-docker-container/)
`docker exec -i <container-name> bash -c "POSTGRES_PASSWORD="123" pg_dump --username postgres <db-name>" > /path/dump.sql`

### Restoring a database from dump
[Ref](https://davejansen.com/how-to-dump-and-restore-a-postgresql-database-from-a-docker-container/)
`docker exec -i <container-name> bash -c "POSTGRES_PASSWORD="123" psql --username postgres <db-name>" < /path/dump.sql`

### Querying from the terminal using psql
`docker exec -i <container-name> psql -U postgres <db-name> -c "<query>"`
- ex: `docker exec -i postgres-db psql -U postgres smogdb -c "\dt"`
- ex: `docker exec -i postgres-db psql -U postgres smogdb -c 'SELECT * FROM "automobiles" WHERE true LIMIT 1'`
OR use psql directly and connect to the database `psql -h <address> -p <port> -U postgres `
- ex: `psql -h localhost -p 8080 -U postgres -c 'SELECT * FROM "automobiles" WHERE true LIMIT 3'`
OR if you want to include password in the command, connect using the URL `psql postgresql://<username>:<password>@<address>:<port>/<db-name> -c '...'`
- ex: `psql postgresql://postgres:123@localhost:8080/smogdb -c 'SELECT * FROM "automobiles" WHERE true LIMIT 3'`

## Docker volume management
In `compose.yaml`, if no volume settings are configured, a default local volume will be created at each run, which takes up space quickly.
In order to persist data, such as database data on the server without having to dump databases, volumes need to be defined or created.
Ideally, add the volume settings to the `compose.yaml`.

### Various volume utility
To see all the volumes:
`docker volume ls`

### Removing volumes
To remove volumes:
`docker volume rm <volume-name>`

To remove all volumes:
`docker volume prune`