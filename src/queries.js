import Query from 'graphql-query-builder';

const Queries = {};

const generateQuery = (name, args, fields) => {
  Object.keys(args).forEach((key) => { if (!args[key]) delete args[key]; });
  const queryContent = new Query(name, args).find(fields);
  return `{
    ${queryContent}
  }`;
};

Queries.Nodes = {
  Get: (args, fields = ['id']) => generateQuery('getNodeById', args, fields),
  GetByRegion: (args, fields = ['id']) => generateQuery('getNodesByRegion', args, fields),
  GetByBound: (args, fields = ['id']) => generateQuery('getNodesByBound', args, fields),
  Nearest: (args, fields = ['id']) => generateQuery('getNearestNodesByPoint', args, fields),
  Cluster: (args, fields = ['id']) => generateQuery('getNodesCluster', args, fields),
};

Queries.Apps = {
  Get: (args, fields = ['id']) => {
    const queryContent = new Query('getAppById', args).find(fields);
    return `{
      ${queryContent}
    }`;
  },
};

Queries.Server = {
  Info: `
    query q {
      getServerInfo {
        version
      }
    }
  `,
};
export default Queries;
