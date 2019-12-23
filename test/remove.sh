#!/bin/bash
docker rm $(docker ps -a --filter name=imgcmp | awk 'NR>1 {print $1}')