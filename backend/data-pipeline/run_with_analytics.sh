#!/bin/bash

set -euxo

echo "Running with plausible analytics"


docker-compose -f docker-compose.yml -f plausible/docker-compose.yml -f plausible/geoip/docker-compose.geoip.yml up