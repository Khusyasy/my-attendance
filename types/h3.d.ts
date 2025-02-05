declare module "h3" {
  interface H3EventContext {
    auth?: {
      id: number;
    };
  }
}

// this is important but is weird
// https://stackoverflow.com/questions/76341630/how-to-extend-the-h3event-context-type-in-nuxt-3
export default {};
