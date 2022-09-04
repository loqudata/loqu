#!/bin/bash
isql=isql-v
for dir in $(ls /staging); do
    echo "Registering $dir"
    $isql 1111 dba dba exec="ld_dir('/staging/$dir', '*.nt', 'https://loqudata.org/default');"
done

# To view load list:
# select * from DB.DBA.load_list;

# Core / 2.5 ~= 6
$isql 1111 dba dba exec="rdf_loader_run();" & 
$isql 1111 dba dba exec="rdf_loader_run();" & 
$isql 1111 dba dba exec="rdf_loader_run();" & 
$isql 1111 dba dba exec="rdf_loader_run();" & 
$isql 1111 dba dba exec="rdf_loader_run();" & 
$isql 1111 dba dba exec="rdf_loader_run();" & 
# $isql 1111 dba dba exec="rdf_loader_run();" &  
