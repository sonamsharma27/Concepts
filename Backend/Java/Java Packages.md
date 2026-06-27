=========================================================
JAVA PACKAGES & IMPORTS CHEATSHEET
=========================================================

---------------------------------------------------------
1. PACKAGE
---------------------------------------------------------

Folder Structure:

src/

    model/
        User.java

    service/
        BookingService.java

User.java

package model;

public class User {

}

BookingService.java

package service;

import model.User;

public class BookingService {

}

---------------------------------------------------------
2. PACKAGE NAME MUST MATCH DIRECTORY
---------------------------------------------------------

Directory:

parkinglot/

    model/

        Vehicle.java

Vehicle.java

package parkinglot.model;

public class Vehicle {

}

---------------------------------------------------------
3. IMPORTING A CLASS
---------------------------------------------------------

import parkinglot.model.Vehicle;

public class ParkingService {

    Vehicle vehicle;

}

Equivalent to C++:

#include "Vehicle.h"

---------------------------------------------------------
4. IMPORTING MULTIPLE CLASSES
---------------------------------------------------------

Instead of

import model.User;
import model.Vehicle;
import model.Booking;

Use

import model.*;

Imports all PUBLIC classes
inside model package.

---------------------------------------------------------
5. USING CLASS WITHOUT IMPORT
---------------------------------------------------------

Fully Qualified Name

parkinglot.model.Vehicle vehicle =
    new parkinglot.model.Vehicle();

Useful when two packages
have same class name.

---------------------------------------------------------
6. PUBLIC CLASS
---------------------------------------------------------

package model;

public class User {

}

Accessible from
every package.

---------------------------------------------------------
7. PACKAGE-PRIVATE CLASS
---------------------------------------------------------

package model;

class User {

}

No "public"

Accessible ONLY inside
model package.

Cannot import from
other packages.

---------------------------------------------------------
8. ACCESS MODIFIERS
---------------------------------------------------------

Modifier        Same Package    Other Package
---------------------------------------------------------
public              Yes             Yes

protected           Yes      Yes (only subclass)

default             Yes             No

private             No              No

---------------------------------------------------------
9. IMPORT STATIC
---------------------------------------------------------

package util;

public class MathUtil {

    public static int square(int x) {

        return x * x;
    }

}

Usage

import static util.MathUtil.square;

square(5);

Normally

MathUtil.square(5);

---------------------------------------------------------
10. PACKAGE HIERARCHY
---------------------------------------------------------

Folder

parkinglot/

    model/

        Vehicle.java

        Ticket.java

    service/

        ParkingService.java

    repository/

        ParkingRepository.java

    strategy/

        ParkingStrategy.java

    factory/

        VehicleFactory.java

    enums/

        VehicleType.java

    exception/

        ParkingFullException.java

    util/

        IdGenerator.java

---------------------------------------------------------
11. TYPICAL PACKAGE DECLARATIONS
---------------------------------------------------------

Vehicle.java

package parkinglot.model;

---------------------------------------------------------

ParkingService.java

package parkinglot.service;

import parkinglot.model.Vehicle;

---------------------------------------------------------

ParkingRepository.java

package parkinglot.repository;

import parkinglot.model.Vehicle;

---------------------------------------------------------

VehicleFactory.java

package parkinglot.factory;

import parkinglot.model.Vehicle;

---------------------------------------------------------

ParkingStrategy.java

package parkinglot.strategy;

---------------------------------------------------------

VehicleType.java

package parkinglot.enums;

---------------------------------------------------------

ParkingFullException.java

package parkinglot.exception;

---------------------------------------------------------
12. IMPORTING FROM DIFFERENT PACKAGE
---------------------------------------------------------

package parkinglot.service;

import parkinglot.model.User;
import parkinglot.model.Booking;
import parkinglot.enums.BookingStatus;

public class BookingService {

}

---------------------------------------------------------
13. SAME PACKAGE
---------------------------------------------------------

package model;

public class User {

}

package model;

public class Booking {

}

No import required.

Classes inside same package
can directly use each other.

---------------------------------------------------------
14. TWO CLASSES WITH SAME NAME
---------------------------------------------------------

model.User

admin.User

Cannot

import model.User;
import admin.User;

Instead

import model.User;

admin.User adminUser =
    new admin.User();

---------------------------------------------------------
15. COMMON PACKAGE STRUCTURE FOR LLD
---------------------------------------------------------

project/

│

├── model/
│      User
│      Booking
│      Seat
│      Movie
│

├── service/
│      BookingService
│      PaymentService
│

├── repository/
│      UserRepository
│      BookingRepository
│

├── strategy/
│      PaymentStrategy
│      PricingStrategy
│

├── factory/
│      PaymentFactory
│

├── enums/
│      BookingStatus
│      SeatStatus
│

├── exception/
│      BookingException
│

├── util/
│      IdGenerator
│      DateUtil
│

├── dto/
│      BookingRequest
│      BookingResponse
│

├── controller/
│      BookingController
│

└── Main.java

---------------------------------------------------------
16. WHAT GOES WHERE?
---------------------------------------------------------

model/

Business Objects

User
Seat
Booking
Vehicle

---------------------------------------------------------

service/

Business Logic

BookingService
SearchService
PaymentService

---------------------------------------------------------

repository/

Data Storage

UserRepository
BookingRepository

---------------------------------------------------------

strategy/

Interchangeable Algorithms

PaymentStrategy
ParkingStrategy

---------------------------------------------------------

factory/

Object Creation

PaymentFactory
VehicleFactory

---------------------------------------------------------

enums/

Statuses

BookingStatus
SeatStatus

---------------------------------------------------------

exception/

Custom Exceptions

SeatUnavailableException

---------------------------------------------------------

util/

Helper Classes

IdGenerator
ValidationUtil

---------------------------------------------------------

dto/

API Objects

BookingRequest
BookingResponse

---------------------------------------------------------

controller/

Entry Point

BookingController

---------------------------------------------------------
17. INTERVIEW TIP
---------------------------------------------------------

In LLD interviews, you usually DO NOT create
actual packages/files.

Instead say:

"In production, I'd place these classes as:

model/
service/
repository/
strategy/
factory/
enums/
exception/

For simplicity, I'll keep them in one file."

This is considered good practice.

=========================================================
```


=========================================================
PACKAGE DESIGN CHEATSHEET (LLD)
=========================================================

Rule 1: Group by Responsibility (High Cohesion)

✔ model/
    User
    Booking
    Seat

✔ service/
    BookingService
    PaymentService

✔ repository/
    UserRepository
    BookingRepository

✔ strategy/
    PaymentStrategy
    PricingStrategy

✔ factory/
    PaymentFactory

✔ enums/
    BookingStatus

✔ exception/
    BookingException

---------------------------------------------------------

Rule 2: Classes in the same package should have ONE common purpose.

Ask:
"Why do these classes belong together?"

NOT:
"Where should I put this file?"

---------------------------------------------------------

Rule 3: Prefer High Cohesion, Low Coupling

High Cohesion:
Classes in same package work closely together.

Low Coupling:
Packages depend on each other as little as possible.

---------------------------------------------------------

Rule 4: Two Common Package Structures

1. Layer-based (Recommended for LLD Interviews)

model/
service/
repository/
strategy/
factory/
enums/
exception/
util/

✔ Easy to explain
✔ Used in interviews
✔ Good for small/medium projects

---------------------------------------------------------

2. Feature-based (Production)

booking/
    Booking.java
    BookingService.java
    BookingRepository.java

payment/
    Payment.java
    PaymentService.java

user/
    User.java
    UserService.java

✔ Better for large codebases
✔ Easier team ownership
✔ Better modularity

---------------------------------------------------------

Interview Tip

For LLD interviews:

Use Layer-based packaging.

If asked how you'd organize a production system,
mention Feature-based packaging for better scalability.