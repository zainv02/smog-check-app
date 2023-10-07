
source .env

var_ip="localhost"
var_port=${POSTGRES_PORT:-5432}
var_address=${var_ip}:${var_port}

echo -e "\n### waiting for connection to ${var_address} and postgres server... \n"

# https://stackoverflow.com/questions/27599839/how-to-wait-for-an-open-port-with-netcat
timeout 10 bash -c 'until printf "" 2>>/dev/null >>/dev/tcp/$0/$1; do sleep 1; done' ${var_ip} ${var_port}

# https://stackoverflow.com/questions/46516584/docker-check-if-postgres-is-ready
timeout 10 bash -c 'until docker exec $0 pg_isready; do sleep 1; done' ${POSTGRES_CONTAINER_NAME}


var_db="${POSTGRES_DB_NAME:-${POSTGRES_USER}}"
var_dump="databases/dump.sql"

echo -e "\n### dumping database [${var_db}] to [${var_dump}] \n"

echo -e "docker exec -i \"${POSTGRES_CONTAINER_NAME}\" pg_dump -U \"${POSTGRES_USER}\" \"${var_db}\" > ${var_dump}"
docker exec -i "${POSTGRES_CONTAINER_NAME}" pg_dump -U "${POSTGRES_USER}" "${var_db}" > ${var_dump}

echo -e "\n### stopping docker services \n"

docker compose down

echo -e "\n### stopped docker services \n"