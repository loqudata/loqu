import json


DATADIR = "../data/socrata-api/"

r = json.load(open(DATADIR + "rows.json"))
nr = r["meta"]["view"]

meta = json.load(open(DATADIR + "meta.json"))

main = json.load(open(DATADIR + "main.json"))

rowkeys = set(nr.keys())
metakeys = set(meta.keys())
mainkeys = set(main.keys())


print("In rows, not in meta", rowkeys.difference(metakeys))
print("In met, not in rows", metakeys.difference(rowkeys))


print("In rows, not in main", rowkeys.difference(mainkeys))
print("In main, not in rows", mainkeys.difference(rowkeys))