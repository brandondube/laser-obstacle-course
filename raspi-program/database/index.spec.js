const path = require('path');

// test runner
const chai = require('chai');
const expect = chai.expect;
// const should = chai.should();

// the module being tested
const Database = require('./index');

describe('Database', () => {
  let db;
  before((done) => {
    db = new Database(path.resolve(__dirname, 'store.spec.json'));
    done();
  });
  describe('#clone', () => {
    it('should load a new database identical to the old one', () => {
      expect(() => db.clone(path.resolve(__dirname, 'store-clone.spec.json')).to.equal(db));
    });
  });
  describe('#lock', () => {
    before(() => {
      db.lock();
    });

    it('should set the canUpdate property of instance', () => {
      expect(db.canUpdate).to.equal(false);
    });
    it('should cause Database.Push to throw', () => {
      expect(() => db.push({foo: 'bar'})).to.throw();
    });
  });
});