declare module 'google-trends-api' {
  type AsyncFn = (subString: string) => Promise<boolean>;

  export default {
    interestOverTime: AsyncFn,
  };
}
