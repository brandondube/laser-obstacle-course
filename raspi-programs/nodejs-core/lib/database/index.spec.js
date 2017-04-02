const path = require('path');

// test runner
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

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
  describe('#push', () => {
    it('should merge the updated data into the db', () => {
      const now = new Date();
      db.push({baz: now});
      db.store.should.have.property('baz', now);
    });
  });
  describe('#lock', () => {
    let localDB;
    before((done) => {
      localDB = db.clone(path.resolve(__dirname, 'store.lock.spec.json'));
      localDB.lock();
      done();
    });

    it('should set the canUpdate property of the instance', () => {
      expect(localDB.canUpdate).to.equal(false);
    });

    it('should cause Database.Push to throw', () => {
      expect(() => localDB.push({foo: 'bar'})).to.throw();
    });
  });
});