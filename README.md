# check-dom-elements

This package is used for testing purpose. You can use the *tests* that are
already created and mentioned in **[Examples](#examples)** section OR create
a test as per your requirement otherwise open an [Issue](https://github.com/samiahmedsiddiqui/check-dom-elements/issues)
and write down your test requirements and we will try to create that test
on your behalf.

When the site is on VPN so this is where it plays an important role. You can
simply connect your system/machine with VPN and run this package locally.

It can also crawl the website that are secured with HTTP Authentication.

## Install

To get started, clone the repository and run the following commands in sequential order.

```bash
# Option 1: clone by SSH
  $ git clone --recursive git@github.com:samiahmedsiddiqui/check-dom-elements.git

# Option 2: clone by HTTPS
  $ git clone --recursive https://github.com/samiahmedsiddiqui/check-dom-elements.git

# Navigate to the repo dir
$ cd check-dom-elements

# Install packages as listed in package.json
$ npm install
```

## Examples

### To get list of script(s)

```bash
# Update test/list-of-used-scripts.js with your sitemap URL or list of URL(s).
npm run test:used-scripts
```

### To get list of Page URL(s) with wrong rel

```bash
# Update test/list-of-target-blank-with-wrong-attributes.js with your sitemap URL or list of URL(s).
npm run test:target-blank-with-wrong-attributes
```

**NOTE:** This test returns the result of page URL(s) where anchor contains `target="_blank"` with wrong rel.

## Parameters

| Attributes |  Type  | Required | Default |                                                       Description                                                      |
|:----------:|:------:|:--------:|:-------:|:----------------------------------------------------------------------------------------------------------------------:|
|  sitemaps  |  Array |    Yes   |         | Sitemap(s) URL(s) where the actual site URL(s) needs to be fetched for DOM testing.                                    |
|    urls    |  Array |    Yes   |         | URL(s) for which DOM testing needs to be performed.                                                                    |
|    test    | String |    Yes   |         | Name of the test that needs to be run. If you are running tests that are listed in README then keep the name as it is. |
|   options  | Object |    No    |   `{}`  | Define options like HTTP Auth credentials if the site is locked or headers etc.                                        |

**NOTE:** `sitemaps` and/or `urls` is required. You can define both parameters
as well to fetch URL(s) from sitemap and the URL(s) that are not listed in the
sitemap, you can provide them separately.
