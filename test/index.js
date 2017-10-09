import chai from 'chai';
import dig from '../src/index';

const expect = chai.expect;

describe('Query DNS Server', () => {
  it('Query ANY for google.com', (done) => {
    dig(['google.com', 'ANY'])
      .then((result) => {
        // console.log(result);
        expect(result).to.be.an('object')
          .and.to.have.property('answer')
          .and.to.be.an('array');
        done();
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  });
});
