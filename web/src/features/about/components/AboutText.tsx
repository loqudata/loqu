import { Stack } from "@chakra-ui/react";
import React from "react";

export const AboutText = () => {
  return (
    <Stack className="typography" >
      <h2 id="problem">Problem</h2>
      <p>
        Open datasets published in open data portals contain valuable
        information for the general public. Yet it's too difficult to find and
        access the right data. Also it is published in non-standardized
        structures, so it's difficult to understand and use the data, and this
        also prevents people from merging it with other datasets to find new
        insights. And finally, some companies clean, repackage and sell these
        datasets to their customers, but their solutions aren't available to
        most people.
      </p>
      <ol type="1" style={{marginInlineStart: "1rem"}}>
        <li>
          <p>
            There are many issues with searching for data. General search
            engines or “dataset search engines” are either too broad or have
            limitations that result in poor quality results, like lacking the
            ability to facet by dataset properties.
          </p>
        </li>
        <li>
          <p>
            There's a lack of structure and understanding of published open
            data. Most datasets have field names that are cryptic so users must
            rely on text documents to understand what they mean. And all these
            fields are unique to the data publisher, so users can't easily merge
            or visualize multiple datasets.
          </p>
        </li>
        <li>
          <p>
            Users need to use multiple different tools to find, download,
            visualize, and make a decision to use the open data. Some data
            portals have introduced new features for visualization, but these
            vary based on the software used, have limited capabilities to
            combine datasets in charts and graphs, and often don't support
            geographic visualizations.
          </p>
        </li>
      </ol>
      <h2 id="solution">Solution</h2>
      <p>
        Loqu is an open (open source, open data, and free to use) platform that
        aggregates dataset metadata from data portals and other statistical data
        providers, and allows users to search, explore, and visualize those
        datasets in a single tool. We address the problems above as follows:
      </p>
      <ol type="1" style={{marginInlineStart: "1rem"}}>
        <li>
          <p>
            We have <strong>powerful faceted search</strong> based on{" "}
            <strong>detailed metadata</strong>. We aggregate metadata directly
            from open data portal APIs, so it's up to date and contains
            important information like update frequency, publisher, columns, and
            data types.
          </p>
        </li>
        <li>
          <p>
            Loqu <strong>understands</strong> the semantic meaning of{" "}
            <strong>dataset fields</strong>. We create a knowledge graph of
            datasets, publishers, dataset fields, and concepts through automatic
            linking methods and by allowing users to contribute updates/links.
            We re-use standardized schemas for these concepts (e.g. geographic
            locations or types of economic activity) but present a simple
            interface for users. This graph will help us improve the search
            experience and allow us to build features to better combine and
            visualize data.
          </p>
        </li>
        <li>
          <p>
            Loqu includes search and visualization features in{" "}
            <strong>one web app</strong>, which we hope will be{" "}
            <strong>more convenient</strong> for all people to use and
            understand data.
          </p>
        </li>
      </ol>
      <p>
        Some other projects have applied semantic web ideas to open data, but
        have now shut down. We hope to keep Loqu available for a while, so we
        only store metadata to limit costs.
      </p>
      <h2 id="features">Features</h2>
      <p>The platform will allow users to:</p>
      <ul style={{marginInlineStart: "1rem"}}>
        <li>
          use search datasets, publishers, and visualizations (e.g. and search
          by properties like license, date published, etc)
        </li>
        <li>
          explore datasets based on linked entities. For example, a user could
          search for a county in the US, and then view the datasets that are
          linked to that entity, such as data on unemployment or crime. Or they
          could navigate to the concept for small farms and find all the
          datasets about them.
        </li>
        <li>
          create charts or geographic visualizations using a graphical user
          interface
        </li>
        <li>share and re-use visualizations for different datasets</li>
        <li>
          add metadata to datasets like links to entities, semantic annotation
          of table fields, or additional descriptions
        </li>
        <li>easily export to spreadsheets or other tools</li>
        <li>
          use an open API (Application Programming Interface) to access all the
          features of the platform
        </li>
      </ul>
      <h2 id="current-status">Current Status</h2>
      <p>
        This is a beta version of the product. It may have bugs or incomplete
        features. Also, we are currently still adding many datasets.
      </p>
      <p>
        We appreciate you checking it out! If you have feedback, please leave an
        issue at <a href="https://github.com/loqudata/docs/issues">Github</a>,
        or send an email to feedback@loqudata.org.
      </p>
      <h2 id="vision">Vision</h2>
      <p>
        We can imagine Loqu as a “Wikipedia for datasets,” where users
        contribute new data portals, enrich dataset metadata, and share
        visualizations, and a community of developers add new features and data
        pipelines. We aim to increase the accessibility and ease of use of
        public data and hope to have positive impacts on research, civic
        engagement, advocacy, education, and journalism. Also, we just want to
        be a fun tool and place for people who are curious!
      </p>
    </Stack>
  );
};
