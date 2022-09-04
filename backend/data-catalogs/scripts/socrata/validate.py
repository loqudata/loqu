import itertools
import json
from deepdiff import DeepDiff

# https://pretagteam.com/question/python-find-duplicates-in-list-and-group-them-by-key
d = json.load(open("/mnt/data/prefect/explicit/socrata_out2.json"))
limit = 1000
new_data = [
    [a, list(b)]
    for a, b in itertools.groupby(
        sorted(d[0:limit], key=lambda x: x["id"]), key=lambda x: x["id"]
    )
]

# DeepDiff(x[1][0], x[1][1])
new_data = list(map(lambda x: len(x[1]), filter(lambda x: (len(x[1]) > 1), new_data)))
print(json.dumps(new_data,indent=4))

# result: a bunch of empty dicts, which means there are a bunch of perfect duplicates, at least between first and second
# then result is 2s, so no more than 2 probably
