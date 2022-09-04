# NUM_WORKERS
for i in {1..$NUM_WORKERS}
    dask-worker tcp://0.0.0.0:8786 & 

# Just use
dask-worker --nprocs auto <scheduler_endpoint>