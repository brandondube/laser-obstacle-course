const fs = require('fs');

// a database contains a
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

Database.prototype.clone = function clone(newPath) {
  // clone a database to a new location on disk
  console.log(newPath);
  fs.writeFile(newPath, JSON.stringify(this.store), function(err) {
    if (err) {
      return Error('unable to write new database to disk');
    }
    return new Database(newPath);
  });
};

Database.prototype.lock = function lock() {
  // write the database to disk and destroy the object
  this.writeToDisk();
  this.canUpdate = false;
}

// push data into the database
Database.prototype.push = function push(data) {
  // update the store object with the new data

  if (!this.canUpdate) { throw new DatabaseAccessError(); }
  this.store = Object.assign({}, this.store, reshape(data));

  // if it has been more than 10 minutes, save to disk
  var now = new Date();
  var lda = this.lastDiskAccess;
  const hoursMatch = now.getHours() === lda.getHours();
  const tenMinutesPast = now.getMinutes() - 10 >= lda.getMinutes();
  if (hoursMatch && tenMinutesPast) {
    this.writeToDisk();
  }
};

// write the database to the disk.  This method is auto-called by the push
// method if it has been more than 10 minutes since push was last called
Database.prototype.writeToDisk = function writeToDisk() {
  const { diskPath, store, canUpdate } = this;
  if (!canUpdate) { throw new DatabaseAccessError(); }
  fs.writeFile(diskPath, JSON.stringify(store), function(err) {
    if (err) {
      return console.log(err);
    }
    this.push({lastDiskAccess: new Date()});
  });
}

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

function DatabaseAccessError() {
  return {
    name: 'DatabaseAccessError',
    message: 'database is locked, access is denied.',
  };
}

function reshape(data) {
  let returnVar = {};
  for (var property in data) {
    if (data.hasOwnProperty(property)) {
      returnVar[property] = data[property];
      // do something to filter/rehape the object
    }
  }
  return returnVar;
}

module.exports = Database;
