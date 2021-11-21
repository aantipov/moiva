---
title: September 2021 update
date: 2021-09-09,
summary: Actions menu in Table charts. Inner refactorings, fixes and stylistic changes.
head:
  - - meta
    - name: description
      content: Actions menu in Table charts. Inner refactorings, fixes and stylistic changes.
  - - meta
    - property: og:description
      content: Actions menu in Table charts. Inner refactorings, fixes and stylistic changes.
  - - meta
    - name: twitter:description
      content: Actions menu in Table charts. Inner refactorings, fixes and stylistic changes.
  - - meta
    - property: og:image
      content: https://moiva.io/images/moiva-head.jpg
  - - meta
    - name: twitter:image
      content: https://moiva.io/images/moiva-head.jpg
  - - meta
    - property: og:url
      content: https://moiva.io/blog/2021-09-update--actions-in-table-charts/
  - - meta
    - property: twitter:url
      content: https://moiva.io/blog/2021-09-update--actions-in-table-charts/
  - - link
    - rel: canonical
      href: https://moiva.io/blog/2021-09-update--actions-in-table-charts/
---

This is a September report on the progress of [Moiva.io](https://moiva.io/).

This month there were no major changes.

Hence, let me keep this article short and just quickly list the changes:

- made the Table look cleaner in the desktop view by removing icons from all the metrics
- removed the old Bundlephobia chart which Moiva had since its “early days” in favour of the new “Bundle size” chart which is part of the Table now.
- added actions (copy, download, share) to Table charts similar to the rest of the charts
- fixed a bug in “Npm Releases” and “Contributors” charts when a wrong quarter was shown
- added a bunch of new libraries to Catalog
- updated npm dependencies and refactored Vue components to use the new `<script setup>` syntax
- refactored Table related components to make the logic simpler and easier to maintain
- made some stylistic changes to improve UI
- last but not least, changed copy in some places to highlight the current focus of Moiva - NPM ecosystem.
