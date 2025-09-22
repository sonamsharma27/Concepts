const buttonClickHandler = (e) => {
  console.log("Handler called", e.target.value);
};

Function.prototype.getThrottleFunction = function () {
  let wasCalled = false;
  let context = this;
  return function (...args) {
    console.log("Function called");
    if (!wasCalled) {
      wasCalled = true;
      setTimeout(() => {
        wasCalled = !wasCalled;
      }, 1000);
      context.apply(context, args);
    }
  };
};

//better approach
const returnThrotlledFunction = (fn, delay) => {
  let wasCalled = false;
  return function (...args) {
    console.log("Function called");
    if (!wasCalled) {
      fn.apply(this, args);
      wasCalled = true;
      setTimeout(() => {
        wasCalled = false;
      }, delay);
    }
  };
};

// const throttledFunction = buttonClickHandler.getThrottleFunction();
const throttledFunction = returnThrotlledFunction(buttonClickHandler, 1000);

const inputChangeHandler = (e) => {
  console.log(e.target.value);
};

const returnDebouncedFunction = (fn, delay) => {
  let timer;
  return function (...args) {
    console.log("Wrapper");
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

const debouncedHandler = returnDebouncedFunction(inputChangeHandler, 300);

//debouncing use useeffect
useEffect(() => {
  let timer;
  timer = setTimeout(() => {
    callApi;
  }, 300);
  return () => clearTimeout(timer); //cleartimeout during unmounting
}, [input]);


useEffect(() => {
  // debouncing
  const timeout = setTimeout(fetchSearchData, 300);
  return () => clearTimeout(timeout);
}, [inputVal]);
