declare module 'swagger-jsdoc' {
  export interface Options {
    definition: Record<string, any>;
    apis?: string[];
  }
  function swaggerJSDoc(options: Options): object;
  export default swaggerJSDoc;
}
