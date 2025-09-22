const busBooking = {
  tripDetails: {
    origin: "Jammu",
    destination: "Manali",
    date: "2025-01-15",
    bus: {
      type: "Sleeper",
      seatsAvailable: 30,
      decks: {
        upperDeck: {
          rows: 5,
          seatsPerRow: 4,
        },
        lowerDeck: {
          rows: 4,
          seatsPerRow: 4,
        },
      },
    },
  },
  payment: {
    method: "Credit Card",
    transactionId: "TXN123456",
    totalAmount: 2400,
    status: "Confirmed",
  },
};

const busBooking2 = {
  tripDetails: {
    origin: "Jammu",
    destination: "Manali",
    date: "2025-01-15",
    bus: {
      type: "Sleeper",
      seatsAvailable: 30,
      decks: {
        upperDeck: {
          rows: 5,
          seatsPerRow: 4,
        },
        lowerDeck: {
          rows: 4,
          seatsPerRow: 4,
        },
      },
    },
  },
  passengers: [
    {
      name: "Amit Kumar",
      age: 28,
      seatNumber: "U3-2",
      ticketPrice: 1200,
    },
    {
      name: "Neha Sharma",
      age: 25,
      seatNumber: "L2-1",
      ticketPrice: 1200,
    },
  ],
  payment: {
    method: "Credit Card",
    transactionId: "TXN123456",
    totalAmount: 2400,
    status: "Confirmed",
  },
};


//Notes:
//*******************************************************************//
//for...in loop is ued for iterating through keys of obj
// for(const key in obj)

//for...of loop is used for arrays
//for (const [key, value] of Object.entries(obj))
//*******************************************************************//


const flattenObj = (obj, prefix='', res={}) => {
    if(!obj || typeof obj!== 'object'){
        res[prefix] = obj;
        return res;
    }
    if(prefix.length>0){
        prefix+='_';
    }
    for(const [key,val] of Object.entries(obj)){
        flattenObj(val,prefix+key,res);
    }
    return res;
}


Array.prototype.myFlatten = function flatten(inputArray = this, resultArray = []) {
  for (let elem of inputArray) {
    if (Array.isArray(elem)) {
      flatten(elem, resultArray);
    } else resultArray.push(elem);
  }
  return resultArray;
};
