Promise.myAll = function (arr) {
  return new Promise((resolve, reject) => {
    let res = [];
    let resolved = 0;
    const total = arr.length;

    if (total === 0) return resolve([]);

    for (let i = 0; i < total; i++) {
      /*
            only promises have .then method
            So on using Promise.resolve(), if any of the items in the array is not a promise, it will be converted to a resolved promise
            Promise.resolve() is used to convert non-promise values to a resolved promise
            In case of a promise, Promise.resolve() will return the same promise
            */
      Promise.resolve(arr[i])
        .then((value) => {
          res[i] = value;
          resolved++;
          if (resolved === total) {
            resolve(res);
          }
        })
        .catch(reject); // Short-circuits on first rejection
    }
  });
};

Promise.myRace = function (arr) {
  return new Promise((resolve, reject) => {
    for (let p of arr) {
      Promise.resolve(p).then(resolve).catch(reject);
    }
  });
};

Promise.myAny = function (promises) {
  return new Promise((resolve, reject) => {
    let errors = [];
    let rejectedCount = 0;
    let total = promises.length;

    if (total === 0) {
      // Same as native behavior
      return reject(new AggregateError([], "All promises were rejected"));
    }
    /**If you just called reject(...) without return, the function might continue running, which could lead
     * to unexpected behavior or multiple attempts to resolve/reject the same promise.
     */

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then(resolve)
        .catch((err) => {
          errors[index] = err;
          rejectedCount++;
          if (rejectedCount === total) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
    });
  });
};

Promise.myAllSettled = function (promises) {
  return Promise.all(
    promises.map((p) =>
      Promise.resolve(p)
        .then((value) => ({ status: "fulfilled", value }))
        .catch((reason) => ({ status: "rejected", reason }))
    )
  );
};

Promise.myAllSettled = function (promises) {
  return new Promise((resolve) => {
    const results = [];
    let settledCount = 0;

    if (promises.length === 0) {
      return resolve([]);
    }

    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((value) => {
          results[i] = { status: "fulfilled", value };
        })
        .catch((reason) => {
          results[i] = { status: "rejected", reason };
        })
        .finally(() => {
          settledCount++;
          if (settledCount === promises.length) {
            resolve(results);
          }
        });
    });
  });
};

//.finally should return a new promise in the same state (fulfilled/rejected) as the original, after the callback (sync or async).
Promise.prototype.finally = function (callback) {
  return this.then(
    (value) => Promise.resolve(callback()).then(() => value),
    (reason) =>
      Promise.resolve(callback()).then(() => {
        throw reason;
      })
  );
};


