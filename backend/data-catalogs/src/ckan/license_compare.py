import re
from urllib.parse import urlparse
import pandas as pd
import numpy as np
from .string_grouper import (
    match_strings,
    match_most_similar,
    group_similar_strings,
    compute_pairwise_similarities,
    StringGrouper,
)

DATA_DIR = "/mnt/data/prefect/ckan/"
def get_license_inputs():
    with open(
            DATA_DIR + "non_default_lower.txt"
        ) as input_list:

        input_list = pd.Series(input_list.read().splitlines())
        input: pd.Series = input_list.apply(normalize_license_url_string)
        return input

def is_uri(x: str):
    try:
        result = urlparse(x)
        return all([result.scheme, result.netloc])
    except:
        return False


def normalize_license_url_string(input: str):
    if is_uri(input):
        url = urlparse(input)
        # license_sep = url.path.split("license", 1)
        try:
            path = re.match('license[s?](.*)', url.path).group[0]
        except Exception as e:
            path = url.path
        
        n = path + url.fragment
        out = n.lstrip("/").rstrip("/")
        return out
    return input

settings = {
    "ngram_size": 3,
    "min_similarity": 0.75
}

def main():
    with open(DATA_DIR + "scancode_lower.txt") as scancode, open(DATA_DIR + "opendefinition.txt") as opendefinition, open(
        DATA_DIR + "non_default_lower.txt"
    ) as input_list:
        # Create series from lines

        # Combine from multiple
        main = pd.Series(scancode.read().splitlines() + opendefinition.read().splitlines())

        input_list = pd.Series(input_list.read().splitlines())
        input = input_list.apply(normalize_license_url_string)

        # clean_regex =  r'[,-./]|\s'
        clean_regex = r''


        out = match_strings(main, input, **settings) #, regex=clean_regex)
        # print(out.columns)
        sorted = out.sort_values(by="similarity")
        print("sorted", sorted)
        out.to_csv("../data/matches_all.csv")

        first = match_most_similar(main, input, **settings) #, regex=clean_regex)
        print(first)
        first.to_csv("../data/matches_first.csv")


def show_ngrams():
    input = get_license_inputs()
    sg = StringGrouper(input, **settings)
    for example in input[:10]:
        ng = sg.n_grams(example)
        print(ng)

from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix
import sparse_dot_topn.sparse_dot_topn as ct

import time

def awesome_cossim_top(A, B, ntop, lower_bound=0):
    # force A and B as a CSR matrix.
    # If they have already been CSR, there is no overhead
    A = A.tocsr()
    B = B.tocsr()
    M, _ = A.shape
    _, N = B.shape
 
    idx_dtype = np.int32
 
    nnz_max = M*ntop
 
    indptr = np.zeros(M+1, dtype=idx_dtype)
    indices = np.zeros(nnz_max, dtype=idx_dtype)
    data = np.zeros(nnz_max, dtype=A.dtype)

    ct.sparse_dot_topn(
        M, N, np.asarray(A.indptr, dtype=idx_dtype),
        np.asarray(A.indices, dtype=idx_dtype),
        A.data,
        np.asarray(B.indptr, dtype=idx_dtype),
        np.asarray(B.indices, dtype=idx_dtype),
        B.data,
        ntop,
        lower_bound,
        indptr, indices, data)

    return csr_matrix((data,indices,indptr),shape=(M,N))

def get_matches_df(sparse_matrix, name_vector, top=100):
    non_zeros = sparse_matrix.nonzero()
    
    sparserows = non_zeros[0]
    sparsecols = non_zeros[1]
    
    if top:
        nr_matches = top
    else:
        nr_matches = sparsecols.size
    
    left_side = np.empty([nr_matches], dtype=object)
    right_side = np.empty([nr_matches], dtype=object)
    similairity = np.zeros(nr_matches)
    
    # print(nr_matches)
    for index in range(0, nr_matches):
        left_side[index] = name_vector[sparserows[index]]
        right_side[index] = name_vector[sparsecols[index]]
        similairity[index] = sparse_matrix.data[index]
    
    return pd.DataFrame({'left_side': left_side,
                          'right_side': right_side,
                           'similairity': similairity})
        


def splitter(input: str):
    return input.split("-")

def run_compare():
    licenses = get_license_inputs()
    vectorizer = TfidfVectorizer(min_df=1, analyzer=splitter)
    tf_idf_matrix = vectorizer.fit_transform(licenses)
    print(tf_idf_matrix)

    t1 = time.time()
    matches = awesome_cossim_top(tf_idf_matrix, tf_idf_matrix.transpose(), 10, 0.8)
    t = time.time()-t1
    print("SELFTIMED:", t)

    name_df = pd.DataFrame([licenses])
    matches_df = get_matches_df(matches, name_df, top=100)
    matches_df = matches_df[matches_df['similairity'] < 0.99999] # Remove all exact matches
    out = matches_df.sample(20)
    print(out)
    out.to_csv("../data/hm_matches.csv")


# run_compare()
main()