function f_var() {
  for (var i = 1; i <= 5; i++) {
    setTimeout(function fun() {
      console.log(i);
    }, i * 1000);
  }
}
// f_var();
// output -> 6 because a closure is created for each fun and each closure points to the same copy of i
// var has global scope which leads to only one copy

function f_let() {
  for (let i = 1; i <= 5; i++) {
    setTimeout(() => {
      console.log(i);
    }, i * 1000);
  }
}

// f_let();
// output -> 1,2,3,4,5 because a closure is created and each closure points to the different copy of i
// let has block scope which leads to new copy of i for every iteration and closure remember this copy

function f() {
  for (var i = 1; i <= 5; i++) {
    function close(val) {
      setTimeout(() => {
        console.log(val);
      }, val * 1000);
    }
    close(i);
  }
}

f();
// output -> 1,2,3,4,5 because when i is passed to close , a new execution context is created and 
// a new copy of i is created
