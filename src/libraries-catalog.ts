const libraries = [
  // Frontend Frameworks 
  ['react', 'Frontend Frameworks', 'null', 'null'],
  ['vue', 'Frontend Frameworks', 'null', 'null'],
  ['@angular/core', 'Frontend Frameworks', 'angular', 'null'],
  ['svelte', 'Frontend Frameworks', 'null', 'null'],
  ['ember-source', 'Frontend Frameworks', 'Ember', 'null'],
  ['alpinejs', 'Frontend Frameworks', 'null', 'null'],
  ['inferno', 'Frontend Frameworks', 'null', 'null'],
  ['preact', 'Frontend Frameworks', 'null', 'null'],
  ['hyperapp', 'Frontend Frameworks', 'null', 'null'],
  ['riot', 'Frontend Frameworks', 'null', 'null'],
  ['angular', 'Frontend Frameworks', 'AngularJS', 'null'],
  ['backbone.marionette', 'Frontend Frameworks', 'null', 'null'],
  ['knockout', 'Frontend Frameworks', 'null', 'null'],
  ['solid-js', 'Frontend Frameworks', 'solid', 'null'],

  // NodeJS Frameworks 
  ['express', 'NodeJS Frameworks', 'null', 'null'],
  ['@nestjs/core', 'NodeJS Frameworks', 'NestJS', 'null'],
  ['koa', 'NodeJS Frameworks', 'null', 'null'],
  ['fastify', 'NodeJS Frameworks', 'null', 'null'],
  ['@hapi/hapi', 'NodeJS Frameworks', 'Hapi', 'null'],
  ['sails', 'NodeJS Frameworks', 'null', 'null'],
  ['restify', 'NodeJS Frameworks', 'null', 'null'],
  ['@feathersjs/feathers', 'NodeJS Frameworks', 'Feathers', 'null'],
  ['loopback', 'NodeJS Frameworks', 'LoopBack 3', 'null'],
  ['@loopback/core', 'NodeJS Frameworks', 'LoopBack 4', 'null'],
];

interface CatalogLibraryT {
  name: string;
  category: string;
  seoAlias: string | null;
  framework: string | null;
}

export const catalogLibsByName = libraries.reduce(
  (acc, [name, category, seoAlias, framework]) => {
    acc[name] = { name, category, seoAlias, framework };
    return acc;
  },
  {} as Record<string, CatalogLibraryT>
);

export const libsNamesByCategory = libraries.reduce(
  (acc, [libName, category]) => {
    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(libName);

    return acc;
  },
  {} as Record<string, string[]>
);
