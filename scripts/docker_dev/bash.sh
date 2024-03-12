#!/bin/sh

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 container_name"
    exit 1
fi

container_name=$1
docker exec -it docker $container_name /bin/bash
