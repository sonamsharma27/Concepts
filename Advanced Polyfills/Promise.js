// Custom implementation of a Promise-like class
class MyPromise {
  constructor(executor) {
    //executor is the callback function passed that takes resolve and reject functions
    // Initial state is 'pending'
    this.state = "pending"; // 'fulfilled' | 'rejected'
    this.value = undefined; // Stores fulfillment value or rejection reason
    this.thenCallbacks = []; // Queue for .then callbacks
    this.catchCallbacks = []; // Queue for .catch callbacks

    // Resolve function to fulfill the promise
    const resolve = (val) => {
      if (this.state !== "pending") return; // Ignore if already settled
      this.state = "fulfilled";
      this.value = val;
      // Execute all queued .then callbacks
      this.thenCallbacks.forEach((cb) => cb(val));
    };

    // Reject function to reject the promise
    const reject = (err) => {
      if (this.state !== "pending") return; // Ignore if already settled
      this.state = "rejected";
      this.value = err;
      // Execute all queued .catch callbacks
      this.catchCallbacks.forEach((cb) => cb(err));
    };

    // Immediately execute the executor function
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err); // Catch synchronous errors
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      
      const handleThen = (val) => {
        try {
          if (typeof onFulfilled !== "function") {
            resolve(val); // passthrough if not a function
            return;
          }

          const result = onFulfilled(val);
          if (result instanceof MyPromise) {
            result.then(resolve).catch(reject);
          } else {
            resolve(result);
          }
        } catch (err) {
          reject(err);
        }
      };

      const handleCatch = (err) => {
        try {
          if (typeof onRejected !== "function") {
            reject(err); // passthrough if not a function
            return;
          }

          const result = onRejected(err);
          if (result instanceof MyPromise) {
            result.then(resolve).catch(reject);
          } else {
            resolve(result);
          }
        } catch (e) {
          reject(e);
        }
      };

      if (this.state === "fulfilled") {
        handleThen(this.value);
      } else if (this.state === "rejected") {
        handleCatch(this.value);
      } else {
        this.thenCallbacks.push(onFulfilled);
        this.catchCallbacks.push(onRejected);
      }
    });
  }

  // Registers a callback for rejection and returns a new MyPromise for chaining
  catch(onRejected) {
    return new MyPromise((resolve, reject) => {
      const handleCatch = (err) => {
        try {
          const result = onRejected(err);
          // If the callback returns a MyPromise, chain it
          if (result instanceof MyPromise) {
            result.then(resolve).catch(reject);
          } else {
            resolve(result);
          }
        } catch (e) {
          reject(e); // Catch errors in the callback
        }
      };

      if (this.state === "rejected") {
        handleCatch(this.value); // If already rejected, call immediately
      } else if (this.state === "pending") {
        this.catchCallbacks.push(handleCatch); // Otherwise, queue it
      }
    });
  }

  // Registers a callback to be called regardless of fulfillment or rejection
  finally(callback) {
  return this.then(
    (val) => {
      return MyPromise.resolve(callback()).then(() => val);
    },
    (err) => {
      return MyPromise.resolve(callback()).then(() => { throw err; });
    }
  );
}


  // Creates a resolved MyPromise
  static resolve(val) {
    return new MyPromise((resolve) => resolve(val));
  }

  // Creates a rejected MyPromise
  static reject(err) {
    return new MyPromise((_, reject) => reject(err));
  }
}
