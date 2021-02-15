# [Moiva.io](https://moiva.io/)

A universal tool to Evaluate, Discover alternatives and Compare Software projects.
Currently supports Github and NPM. More to come.

![Screenshot of Moiva.io with charts](./screenshot.png)

## Goals
[Moiva.io](https://moiva.io/)'s goals:
- become the best tool to <ins>*Evaluate*</ins> software
- become the best tool to <ins>*Discover alternatives*</ins>
- become the best tool to <ins>*Compare*</ins> software

## The Library concept
A Library concept constitutes the core of Moiva.io's functionality.

It allows Moiva to be *universal* and provide search and data for different software libraries from different data sources. 

Currently Moiva supports Github and NPM. 

And its possible to add a support, for example, for [Maven](https://mvnrepository.com/) for Java projects, [Packagist](https://packagist.org/) for PHP and [PIP](https://pypi.org/) for Python.

The Library concept can be simplistically described as the following interface:
```ts
interface Library {
  repo: string; // a reference to a GitHub repositry
  npm?: string; // a reference to an Npm package
  isNpmCoreArtifact?: boolean; // indicates if the npm package is a core artifact of the GihHub repository
  category: string; // used in suggestions and SEO
  alias?: string; // used in suggestions and SEO
}
```

### The Library characteristics
The Library concept has the following important properties:
- a library should have a reference to a GihHub repository with the source code for the library.
- a library may have a reference to an Npm package.
- multiple libraries can reference to the same GihHub repository (think of a monorepo with multiple npm packages as artifacts)
- multiple libraries can NOT reference to the same Npm package. Only one library per Npm package is allowed.
- a library with a reference to an Npm package should have a boolean `isNpmCoreArtifact` flag denoting if the npm package is the main artifact of the GitHub repository, or it's just one of its by-products. 
- multiple libraries referencing to the same GitHub repository can not have the `isNpmCoreArtifact` flag set to `true` at same time. The idea is that a GitHub repository can have only one library as its main artifact, but multiple libraries as its "by-products".
- a library referencing to a GitHub repository with an Npm package as its main artifact should have a reference to that package defined and `isNpmCoreArtifact` flag set to true.
- a library should have a Category defined. A library can belong to only one category.
- a library may have a Framework property defined. The idea is to help distinguish framework specific libraries. It's used in suggestions mechanism.
- a library may have an Alias defined which is used to show up in suggestions and also serves for SEO purposes - shows up in Google Search results.

### Identification
The combination of `repo` and `npm` properties uniquely identifies a library.

### URL Reference
Every Library at [Moiva.io](https://moiva.io/) is uniquely referenced via URL.

Libraries with the `npm` property defined should be referenced by the name of their Npm package in the `npm` query parameter, for example `?npm=vue`

Libraries without the `npm` property should be referenced using the repository owner and repository name in the `github` query parameter, foe example `?github=facebook/react`

### Aliases
A Library can have an optional `alias` property defined.

Aliases are used to better represent the Library name in the Suggestions list and also in the page's Title and Description.

If `alias` is not defined, then the repository's name is used.

Repositories' names and aliases should be unique. If there are two repositories with the same name, at least one of them should have an `alias` defined.

### Suggestions
TODO

### SEO
TODO
