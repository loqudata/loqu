from bs4 import BeautifulSoup

import json

html = open("/home/alex/Downloads/Open Data Portal Watch.html").read()

soup = BeautifulSoup(html, "html.parser")

domains = soup.select(".content>.header>.searchable", class_="searchable")

content_divs = [span.parent.parent for span in domains]


def select_data(item):
    typ = item.select(".meta >.searchable")[0].text
    domain = item.select(".header>.searchable")[0].text
    datasets = item.select(".statistics>.statistic")[0]
    if datasets:
        datasets = datasets.contents[1].text.rstrip().lstrip()
    # .find("div", _class="value")
    # .find_all("div", _class="ui mini statistics")
    # [0]
    # .contents[0].contents[0].text
    return {"domain": domain, "type": typ, "datasets": datasets}

print(json.dumps(list(map(select_data,content_divs))))