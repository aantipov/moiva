# Moiva.io

## Goals
[Moiva.io](https://moiva.io/)'s goals:
- become the best tool to evaluate Any software project
- become the best tool to find alternatives to Any software project
- become the best tool to compare software projects

## The Library concept
For evaluation, comparison, discovery and reference [Moiva.io](https://moiva.io/) uses a concept of Library.

I came up with that concept when I wanted to make Moiva.io useful for any GitHub project, not just Npm packages.

My goal was to make it possible to compare Npm packages and Github repos interchangeably.

It lead me to invention of a new abstraction level - Library.

The Library concept can be simplistically described as the following interface:
```ts
interface Library {
  repo: string; // a reference to a GitHub repositry
  npm?: string; // a reference to an Npm package
  isNpmAByProduct?: boolean;
  category: string; // used in suggestions and SEO
  alias?: string; // used in suggestions and SEO
}
```

The Library concept has the following important properties:
- every Library should have a reference to a GihHub repository.
- a GihHub repository can have multiple Libraries referenced to it.
- a Library can have additionally a reference to an Npm package.
- an Npm package can have only one Library referenced to it.
- a Library with a defined Npm package should have a boolean `isNpmAByProduct` flag, denoting if an npm package is the main "product" of the GitHub repository, or it's just one of its by-products. 
A GitHub repository can have only one "main" npm package and multiple "by-products".
- a Library should have a Category defined.
- a Library optionally has an `Alias` prop defined which is used to show up in suggestions and also for SEO purposes.

## Identification
The combination of `repo`, `npm` and `isNpmAByProduct` uniquely identifies a Library.

If a repository has an Npm package as its main product, then it's required for the Library to have that Npm package specified as `npm` property and have `isNpmAByProduct` flag set to `true`.

In other words, it's forbidden to have a Library with missing `npm` when the repository has a "main" npm package.
 
## URL Reference
Every Library at [Moiva.io](https://moiva.io/) is uniquely referenced via URL.

Libraries with `npm` property defined should be referenced using the name of their Npm package in the `npm` query parameter, for example `?npm=vue`

Libraries without `npm` property should be referenced via a repository owner and repository name in the `github` query parameter, foe example `?github=facebook/react`

## Aliases
A Library can have an optional `alias` property defined.

Aliases are used to better represent the Library name in the Suggestions list and also in the page's Title and Description.

If `alias` is not defined, then the repository's name is used.

Repositories' names and aliases should be unique. If there are two repositories with the same name, at least one of them should have an `alias` defined.

## Suggestions
TODO

## SEO
TODO
