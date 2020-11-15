export default [
  {
    name: 'vue',
    github: { name: 'vue', owner: 'vuejs' },
    npm: {
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
    },
  },
  {
    name: 'react',
    github: { name: 'react', owner: 'facebook' },
    npm: {
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
    },
  },
] as AppConfigT[];

export interface AppConfigT {
  name: string;
  github: {
    name: string;
    owner: string;
  };
  npm: {
    backgroundColor: string;
    borderColor: string;
  };
}
