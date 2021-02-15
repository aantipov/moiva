# [Moiva.io](https://moiva.io/)

A universal tool to Evaluate, Discover alternatives and Compare Software projects.

Currently supports Github and NPM. More to come.

![Screenshot of Moiva.io with charts](./readme-files/screenshot.png)

## Goals
[Moiva.io](https://moiva.io/)'s ambitious goals:
- become the best tool to <ins>*Evaluate*</ins> software
- become the best tool to <ins>*Discover alternatives*</ins>
- become the best tool to <ins>*Compare*</ins> software

## The Library concept
A concept of a Library constitutes the core of Moiva.io's functionality, it's an entity Moiva operates with.

It allows Moiva to be a *Universal* and *Agile* tool which provides search functionality, suggestions and statistical data for different kinds of software libraries. 

Currently Moiva supports Github repositories and NPM packages. 

It's relatively easy to add support, for example, for [Maven](https://mvnrepository.com/) (Java projects), [Packagist](https://packagist.org/) (PHP) and [PIP](https://pypi.org/) (Python).

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

### Characteristics
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

### Examples
Bellow are examples illustrating the relationship between repostory, npm package and Moiva library.
1. Repository doesn't have any related npm package
![image illustrating relationship between a repostory and Moiva library](./readme-files/no-npm.png)

2. Repository have npm packages as artifacts, but no package as a core artifact.
![image illustrating relationship between a repostory and Moiva library](./readme-files/npm.png)

3. Repository has npm packages. One of the packages is a repostory core artifact.
![image illustrating relationship between a repostory and Moiva library](./readme-files/npm-core-artifact.png)

4. Repository can't have multiple core artifacts.
![image illustrating relationship between a repostory and Moiva library](./readme-files/no-multiple-core-artifacts.png)

### Identification
The combination of `repo` and `npm` properties uniquely identifies a library.


### URL Reference
Every Library at [Moiva.io](https://moiva.io/) is uniquely referenced via URL.

Libraries with the `npm` property defined should be referenced by the name of their Npm package in the `npm` query parameter, for example, `?npm=vue`

Libraries without the `npm` property should be referenced using the repository's owner and name in the `github` query parameter, for example, `?github=facebook/react`


### Aliases
A Library can have an optional `alias` property defined.

Aliases are used to better represent the Library name in the Suggestions list and also in the page's Title and Description.

If `alias` is not defined, then the repository's name is used.

Repositories' names and aliases should be unique. If there are two repositories with the same name, at least one of them should have an `alias` defined.

## Contribution
1. If you want a specific library (a GitHub repo or an Npm package) to appear in the suggestion list and also appear in Google Search results, it should be added to [Moiva Catalog](https://github.com/aantipov/moiva-catalog).
Feel free to open a PR or issue there.

2. If you noticed an issue at Moiva.io or have a suggestion/idea how to make it better, please open an issue in this repository.
