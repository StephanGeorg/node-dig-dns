import { GraphQLClient } from 'graphql-request';

export default function (query, resolver, url, apiKey, cb) {
  const client = new GraphQLClient(url, {
    headers: {
      'x-apikey': apiKey,
    },
  });
  const requestPromise = client.request(query);
  if (cb) {
    requestPromise
      .then((data) => {
        cb(null, resolver ? resolver(data) : data);
      })
      .catch((errors) => {
        cb(errors, null);
      });
    return false;
  }
  return new Promise((resolve, reject) => {
    requestPromise
      .then((data) => {
        resolve(resolver(data));
      })
      .catch(reject);
  });
}
