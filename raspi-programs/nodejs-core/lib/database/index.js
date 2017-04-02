const fs = require('fs');

function Database(path) {
  // initialize properties
  this.canUpdate = true;
  this.updates = 0;
  this.diskPath = path,
  this.lastDiskAccess = new Date(),
  this.store = {};

  // read the database from disk
  this.restoreFromDisk();
}

// push data into the database
Database.prototype.push = function push(data) {
  // update the store object with the new data
  if (!this.canUpdate) { throw new DatabaseAccessError(); }
  this.store = Object.assign({}, this.store, data);

  // if it has been more than 10 minutes, save to disk
  var now = new Date();
  var lda = this.lastDiskAccess;
  const hoursMatch = now.getHours() === lda.getHours();
  const tenMinutesPast = now.getMinutes() - 10 >= lda.getMinutes();
  if (hoursMatch && tenMinutesPast) {
    this.writeToDisk();
  }
  return this;
};

// get a copy of the data
Database.prototype.pull = function pull() {
  return this.store;
}

// write the database to the disk.  This method is auto-called by the push
// method if it has been more than 10 minutes since push was last called
Database.prototype.writeToDisk = function writeToDisk() {
  const { diskPath, store, canUpdate } = this;
  if (!canUpdate) { throw new DatabaseAccessError(); }
  fs.writeFile(diskPath, JSON.stringify(store), err => {
    if (err) {
      return console.log(err);
    }
    this.push({lastDiskAccess: new Date()});
  });
};

Database.prototype.clone = function clone(newPath) {
  // clone a database to a new location on disk
  // this has to be synchronous to nicely expose the new db in the return
  fs.writeFileSync(newPath, JSON.stringify(this.store), 'utf8');
  return new Database(newPath);
};


Database.prototype.restoreFromDisk = function restoreFromDisk() {
  fs.readFile(this.diskPath, 'utf8', (err, str) => {
    if (err || typeof(str) === 'undefined') {
      // if there's an error, make an empty database.
      this.store = {};
      return;
    }
    // otherwise, parse the database from disk.
    this.store = JSON.parse(str);
  });
}

Database.prototype.lock = function lock() {
  // write the database to disk and destroy the object
  this.writeToDisk();
  this.canUpdate = false;
}

function DatabaseAccessError() {
  return {
    name: 'DatabaseAccessError',
    message: 'database is locked, access is denied.',
  };
}

module.exports = Database;
