import Query from 'graphql-query-builder';

export default function (name, args, fields) {
  const argsClone = Object.assign({}, args);
  Object.keys(argsClone).forEach((key) => {
    if (!argsClone[key]) delete argsClone[key];
  });
  return new Query(name, argsClone).find(fields);
}
