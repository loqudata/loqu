import urllib.parse
import json

with open("../data/ckan/ckan_portals.txt") as pw:
    from_portalwatch = set(map(lambda x: x.rstrip(), pw.readlines()))


with open("../data/portals.txt") as dc:
    from_datacatalogs = set(map(lambda x: urllib.parse.urlparse(x.rstrip()).netloc, dc.readlines()))


kv = {}

kv["in portalwatch, not in catalogs"] = list(from_portalwatch.difference(from_datacatalogs))
kv["in catalogs, not in portalwatch"] = list(from_datacatalogs.difference(from_portalwatch))

print(json.dumps(kv))