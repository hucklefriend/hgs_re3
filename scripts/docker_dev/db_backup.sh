#!/bin/sh

# Set variables
container_name="hgs_db"
username="hgs"
database_name="hgs_re3"
date=$(date +%Y%m%d)
backup_filename="backup_${date}.sql"

# Execute the mysqldump command
docker-compose -f ../docker/dev/docker-compose.yml exec -T $container_name mysqldump -u"$username" -p $database_name > $backup_filename
