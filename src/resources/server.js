import ApiExecute from '../execute';
import Query from '../features/query';

const resolver = {
  info(data) {
    return data.getServerInfo;
  },
};

export default class SDKResourceServer {
  constructor(prepareQueryParams) {
    this.prepareQueryParams = prepareQueryParams;
    this.url = prepareQueryParams.url;
    this.apiKey = prepareQueryParams.apiKey;
  }

  info(options, callback) {
    const { url, apiKey } = this;
    return ApiExecute(
      `{ ${this.infoQuery(options)} }`,
      resolver.info,
      url,
      apiKey,
      callback,
    );
  }
  /**
   * Get raw query
   */
  infoQuery(options) {
    const { apiKey } = this;
    const { fields = ['version'] } = options;
    return Query('getServerInfo', options, fields);
  }
}
