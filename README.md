# Moiva.io

## A concept of a Library
For evaluation, comparison, discovery and reference Moiva.io uses a concept of Library.
I came up with that concept when I wanted to make Moiva.io useful for any GitHub project, not just NPM packages.
My goal was to make it possible to compare Npm packages and Github repos interchangeably.
It lead me to invention of a new abstraction level - Library.

The Library concept can be simplistically described as the following interface:
```ts
interface Library {
  repo: string; // a reference to a GitHub repositry
  npm?: string; // a reference to an npm package
  isNpmAByProduct?: boolean;
  category: string; // used in suggestions and SEO
  alias?: string; // used in suggestions and SEO
}
```

The Library concept has the following important properties:
- every Library should have a reference to a GihHub repository;
- a GihHub repository can have multiple Libraries referenced to it;
- a Library can have additionally a reference to an Npm package;
- an Npm package can have only one Library referenced to it;
- a Library with a defined Npm package should have a boolean `isNpmAByProduct` flag, denoting if an npm package is the main "product" of the GitHub repository, or it's just one of its by-products. 
A GitHub repository can have only one "main" npm package and multiple "by-products".
- a Library should have a Category defined;

### Identification
The combination of `repo`, `npm` and `isNpmAByProduct` uniquely identifies a Library.
If a repository has an npm package as its main product, then that it's required for the Library to have that npm package specified as `npm` property and have `isNpmAByProduct` flag set to true.
In other words, it's forbidden to have a Library with missing `npm` when the repository has a "main" npm package.
 
### URL Reference
Every Library at Moiva.io is uniquely referenced via URL.
Libraries with `npm` defined should be referenced using the name of their Npm package in the `npm` query parameter, for example `?npm=vue`
Libraries without `npm` property should be referenced via a repository owner and repository name in the `github` query parameter, foe example `?github=facebook/react`

### Suggestions
TODO

### SEO
TODO
