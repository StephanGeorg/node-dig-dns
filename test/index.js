import chai from 'chai';
import dig from '../src/index';

const expect = chai.expect;

describe('Query DNS Server', () => {
  it('Query ANY for google.com and parse output to JSON', (done) => {
    dig(['google.com', 'ANY'])
      .then((result) => {
        // console.log(result);
        expect(result).to.be.an('object')
          .and.to.have.property('question')
          .and.to.be.an('array');
        expect(result).to.have.property('answer')
          .and.to.be.an('array');
        expect(result).to.have.property('time')
          .and.to.be.an('number');
        expect(result).to.have.property('server')
          .and.to.be.an('string');
        expect(result).to.have.property('datetime')
          .and.to.be.an('string');
        expect(result).to.have.property('size')
          .and.to.be.an('number');
        done();
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  });

  it('Query A for google.com and return raw result', (done) => {
    dig(['google.com', 'ANY'], { raw: true })
      .then((result) => {
        // console.log(result);
        expect(result).to.be.a('string');
        done();
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  });
});
