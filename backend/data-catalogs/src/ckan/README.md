# CKAN Downloader

Downloads the following items from a CKAN endpoint:

- datasets, resources
- organizations
- licenses

Can also get info about
- number of total datasets
- CKAN version


## License Matching

Use SPDX or this license database which is much more extensive: https://scancode-licensedb.aboutcode.org/

It seems to also have a good classification of licenses, useful for filtering by permissions

Probably use N-Gram, TF-IDF, cosine similarity for imperfect/fuzzy/approximate string matching.

Resources:
Example permuting a dictionary, shows improvement over other methods: https://www.researchgate.net/profile/Tomasz-Boinski/publication/299692626_Improvement_of_Imperfect_String_Matching_Based_on_Asymmetric_n-Grams/links/57ee33b908ae280dd0abeb04/Improvement-of-Imperfect-String-Matching-Based-on-Asymmetric-n-Grams.pdf?origin=publication_detail
Fast with Pandas: https://bergvca.github.io/2017/10/14/super-fast-string-matching.html
Good impl? https://github.com/ianozsvald/string_distance_metrics/blob/master/string_distance_measures.py


Ok, impl of the blog post, nice API: https://github.com/Bergvca/string_grouper

Larger scale (a bit crazy?)
https://medium.com/@rantav/large-scale-matrix-multiplication-with-pyspark-or-how-to-match-two-large-datasets-of-company-1be4b1b2871e
https://medium.com/bcggamma/an-ensemble-approach-to-large-scale-fuzzy-name-matching-b3e3fa124e3c

## More license stuff

Just filter out records where the ID is a URL, we'll handle that manually/write functions to normalize each type.

StringGrouper `match_most_similar` on the ID.
Then splitting the ID by `-`, filter out number elements like `2` or `1.4`,  and then permute those elements to change order.
Then match by `title` to license titles.

Can do the matching later, for now just load into PG.