#!/bin/bash
export PREFECT__LOGGING__LEVEL="INFO"
export PREFECT__LOGGING__FORMAT="%(levelname)s - %(name)s | %(message)s"

python -m flows.convert