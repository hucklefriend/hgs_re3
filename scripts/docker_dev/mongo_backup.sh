#!/bin/sh

# Set variables
container_name="hgs_mongo"
username="hgs"
database_name="hgs_re3"
date=$(date +%Y%m%d)
backup_filename="mongo_backup_${date}"

# Execute the mongodump command
docker-compose -f ../docker/dev/docker-compose.yml exec -T $container_name mongodump -u "$username" -p -d $database_name -o $backup_filename
