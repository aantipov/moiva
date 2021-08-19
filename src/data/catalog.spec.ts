import {
  catalogLibraries,
  tags,
  genericTags,
  frameworksTags,
  CatalogLibraryT,
} from './index';

// @ts-ignore
describe('Catalog libraries', () => {
  it('libs have the same fields', () => {
    catalogLibraries.forEach((lib) => {
      const props = Object.entries(lib);
      const propsNames = props.map((p) => p[0]);
      expect(propsNames.length).toBe(8);
      expect(propsNames).toContain('id');
      expect(propsNames).toContain('category');
      expect(propsNames).toContain('repoId');
      expect(propsNames).toContain('npm');
      expect(propsNames).toContain('isNpmCoreArtifact');
      expect(propsNames).toContain('alias');
      expect(propsNames).toContain('tags');
      expect(propsNames).toContain('framework');
    });
  });

  it('Contain No duplicates', () => {
    const duplicates = getDuplicates(catalogLibraries);
    expect(duplicates).toEqual([]);
  });

  it('Uses correct frameworks', () => {
    const frameworks = [
      ...new Set(catalogLibraries.map(({ framework }) => framework)),
    ];
    const allowedFrameworks = [null, ...frameworksTags];

    frameworks.forEach(expect(allowedFrameworks).toContain);
  });

  it('all repos lowercase', () => {
    catalogLibraries
      .map((lib) => lib.repoId)
      .forEach((repoId) => expect(repoId).toBe(repoId.toLowerCase()));
  });

  it('uses only specified tags', () => {
    const libsTags = catalogLibraries.map((lib) => lib.tags).flat();
    const libsTagsDedup = [...new Set(libsTags)];
    libsTagsDedup.forEach(expect(tags).toContain);
  });

  it('all defined tags are used', () => {
    const libsTags = catalogLibraries.map((lib) => lib.tags).flat();
    const libsTagsDedup = [...new Set(libsTags)];
    tags.forEach(expect(libsTagsDedup).toContain);
  });

  it('no duplicate tag', () => {
    const tagsDeduped: string[] = [];
    const tagsDuplicates: string[] = [];
    tags.forEach((tag) => {
      if (tagsDeduped.includes(tag)) {
        tagsDuplicates.push(tag);
      } else {
        tagsDeduped.push(tag);
      }
    });
    expect(tagsDuplicates).toEqual([]);
  });

  it('each lib has at least one substantial tag', () => {
    const nonSubstantialTags = [...frameworksTags, ...genericTags];

    catalogLibraries.forEach((lib) => {
      if (lib.tags.length) {
        expect(nonSubstantialTags).not.toEqual(
          expect.arrayContaining(lib.tags)
        );
      }
    });
  });

  it.todo('sitemap is generated for each entry');
});

function getDuplicates(libs: CatalogLibraryT[]) {
  const libsNpmNames = libs
    .map(({ npm }) => npm)
    .filter((npm) => !!npm) as string[];
  const libsReposIds = libs
    .filter(({ npm }) => !npm)
    .map(({ repoId }) => repoId);
  const libsAliases = libs.map(({ alias }) => alias);
  const duplicates = [];

  duplicates.push(
    ...getDuplicatesGeneric(libsNpmNames),
    ...getDuplicatesGeneric(libsReposIds),
    ...getDuplicatesGeneric(libsAliases)
  );

  return duplicates;
}

function getDuplicatesGeneric(items: string[]) {
  const duplicates: string[] = [];

  if (new Set(items).size < items.length) {
    const itemsMap = {} as Record<string, boolean>;

    items.forEach((item) => {
      if (itemsMap[item]) {
        duplicates.push(item);
        return;
      }
      itemsMap[item] = true;
    });
  }

  return duplicates;
}
