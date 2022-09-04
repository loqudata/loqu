## Problem

Open datasets published in open data portals contain valuable information for the general public. Yet it’s too difficult to find and access the right data. Also it is published in non-standardized structures, so it's difficult to understand and use the data, and this also prevents people from merging it with other datasets to find new insights. And finally, some companies clean, repackage and sell these datasets to their customers, but their solutions aren't available to most people.

1. There are many issues with searching for data. General search engines or “dataset search engines” are either too broad or have limitations that result in poor quality results, like lacking the ability to facet by dataset properties.

2. There's a lack of structure and understanding of published open data. Most datasets have field names that are cryptic so users must rely on text documents to understand what they mean. And all these fields are unique to the data publisher, so users can't easily merge or visualize multiple datasets.

3. Users need to use multiple different tools to find, download, visualize, and make a decision to use the open data. Some data portals have introduced new features for visualization, but these vary based on the software used, have limited capabilities to combine datasets in charts and graphs, and often don't support geographic visualizations.

## Solution

Loqu is an open (open source, open data, and free to use) platform that aggregates dataset metadata from data portals and other statistical data providers, and allows users to search, explore, and visualize those datasets in a single tool. We address the problems above as follows:

1. We have **powerful faceted search** based on **detailed metadata**. We aggregate metadata directly from open data portal APIs, so it's up to date and contains important information like update frequency, publisher, columns, and data types.

2. Loqu **understands** the semantic meaning of **dataset fields**. We create a knowledge graph of datasets, publishers, dataset fields, and concepts through automatic linking methods and by allowing users to contribute updates/links. We re-use standardized schemas for these concepts (e.g. geographic locations or types of economic activity) but present a simple interface for users. This graph will help us improve the search experience and allow us to build features to better combine and visualize data.

3. Loqu includes search and visualization features in **one web app**, which we hope will be **more convenient** for all people to use and understand data.

Some other projects have applied semantic web ideas to open data, but have now shut down. We hope to keep Loqu available for a while, so we only store metadata to limit costs.

## Features

The platform will allow users to:

- use search datasets, publishers, and visualizations (e.g. and search by properties like license, date published, etc)
- explore datasets based on linked entities. For example, a user could search for a county in the US, and then view the datasets that are linked to that entity, such as data on unemployment or crime. Or they could navigate to the concept for small farms and find all the datasets about them.
- create charts or geographic visualizations using a graphical user interface
- share and re-use visualizations for different datasets
- add metadata to datasets like links to entities, semantic annotation of table fields, or additional descriptions
- easily export to spreadsheets or other tools
- use an open API (Application Programming Interface) to access all the features of the platform

## Current Status

This is a beta version of the product. It may have bugs or incomplete features. Also, we are currently still adding many datasets.

We appreciate you checking it out! If you have feedback, please leave an issue at [Github](https://github.com/loqudata/docs/issues), or send an email to feedback@loqudata.org.

## Vision

We can imagine Loqu as a “Wikipedia for datasets,” where users contribute new data portals, enrich dataset metadata, and share visualizations, and a community of developers add new features and data pipelines. We aim to increase the accessibility and ease of use of public data and hope to have positive impacts on research, civic engagement, advocacy, education, and journalism. Also, we just want to be a fun tool and place for people who are curious!
