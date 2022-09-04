import json

api = json.load(open("../data/ckan/apiv3_status_responses.json"))

html = json.load(open("../data/ckan/html_responses_contains_ckan.json"))

import urllib.parse

api_urls = set(map(lambda x: urllib.parse.urlparse(x["site_url"]).netloc, api))
html_urls = set(map(lambda x: urllib.parse.urlparse(x["url"]).netloc, html))

kv = {}

kv["in html, not in API"] = list(html_urls.difference(api_urls))
kv["in api, not in html"] = list(api_urls.difference(html_urls))

print(json.dumps(kv))