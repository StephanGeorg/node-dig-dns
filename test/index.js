import chai from 'chai';
import dig from '../src/index';

const expect = chai.expect;

describe('Query DNS Server', (done) => {
  it('Query ANY for google.com and parse output to JSON', (done) => {
    dig(['google.com', 'ANY'])
      .then((result) => {
        console.log(result);
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
    dig(['google.com', 'A'], { raw: true })
      .then((result) => {
        // console.log(result);
        expect(result).to.be.a('string');
        done();
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  });

  it('Query MX for google.com and return result', (done) => {
    dig(['google.com', 'MX'])
      .then((result) => {
        console.log(result);
        // expect(result).to.be.a('string');
        done();
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  });

  it('Query Reverse for 78.46.108.184 and return result', (done) => {
    dig(['-x', '78.46.108.184'])
      .then((result) => {
        // console.log(result);
        // expect(result).to.be.a('string');
        done();
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  });

  it('Query ANY for google.com w/ manually settet dig command.', (done) => {
    dig(['google.com', 'ANY'], { dig: '/usr/bin/dig' })
      .then((result) => {
        // console.log(result);
        expect(result).to.be.an('object');
        done();
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  });

  it('DIG an unreachable host and throw exception', (done) => {
    // https://serverfault.com/questions/776049/how-to-simulate-dns-server-response-timeout#answer-776191
    dig(['example.com', '@72.66.115.13']).then((result) => {
      expect(result).to.be.empty();
      done(false);
    }).catch((err) => {
      // console.error(err);
      expect(err.message).to.be.an('string');
      done();
    });
  }).timeout(20000);
});
