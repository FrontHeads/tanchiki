import bodyParser from 'body-parser';

export const jsonBodyParserMiddleware = () => {
  return bodyParser.json();
};
