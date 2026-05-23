# notes

Design patterns tell us how to structure classes and objects to solve certain problems 


## Strategy Pattern:
The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. 
Strategy pattern lets the algorithm vary independently from clients that use it.

1. Identify the aspects of your application that vary and separate
them from what stays the same.
1.1 Take what varies and “encapsulate” it so it won’t affect the rest of your code.
1.2 The result? Fewer unintended consequences from code changes and more flexibility in your systems!
1.3 Separating what changes from what stays the same

```js
2. Program to an interface, not an implementation. => allows setting behaviour dynamically
```

If your code is written to an interface, then it will work with any new classes implementing 
that interface through polymorphism
3. Favor composition over inheritance
3.1 Creating systems using composition gives you a lot more flexibility. Not only does it let you encapsulate
a family of algorithms into their own set of classes, but it also lets you change behavior at runtime as long as
the object you’re composing with implements the correct behavior interface.


Observer Pattern = Publishers + Subscribers
If you understand newspaper subscriptions, you pretty much understand the Observer Pattern, only we call 
the publisher the SUBJECT and the subscribers the OBSERVERS.

## Definition:
The Observer Pattern defines a one-to-many dependency between objects so that when one object changes state, 
all of its dependents are notified and updated automatically.

The only thing the subject knows about an observer is that it implements a certain interface
(the Observer interface). It doesn’t need to know the concrete class of the observer, what it does,
or anything else about it.

We can add new observers at any time. Because the only thing the subject 
depends on is a list of objects that implement the Observer interface, we can add new observers whenever 
we want. In fact, we can replace any observer at runtime with another observer and the subject will keep 
purring along. Likewise, we can remove observers at any time. We never need to modify the subject to add 
new types of observers. Let’s say we have a new concrete class come along that needs to be an observer. 
We don’t need to make any changes to the subject to accommodate the new class type, all we have to do is 
implement the Observer interface in the new class and register as an observer. The subject doesn’t care; 
it will deliver notifications to any object that implements the Observer interface.

We can reuse subjects or observers independently of each other. If we have another use for a subject or an observer, we can 
easily reuse them because the two aren’t tightly coupled.

Changes to either the subject or an observer will not affect the other. Because the two are loosely coupled,
 we are free to make changes to either, as long as the objects still meet their obligations to implement 
 the subject or observer interfaces.

Design Principle: Strive for loosely coupled designs between objects that interact.
Loosely coupled designs allow us to build flexible OO systems that can handle change because they minimize 
the interdependency between objects.

The Observer Pattern defines a one-to-many relationship between objects.
Don’t depend on a specific order of notification for your Observers.
Subjects, or as we also know them, Observables, update Observers using a common interface.
Observers are loosely coupled in that the Observable knows nothing about them,
other than that they implement the Observer Interface.
You can push or pull data from the Observable when using the pattern (pull is considered more “correct”).

Design Principle: Classes should be open for extension, but closed for modification.


## Decorator Pattern:
 Definition: The Decorator Pattern attaches additional responsibilities to an object dynamically. 
 Decorators provide a flexible alternative to subclassing for extending functionality.

## Factory pattern:
 A factory method handles object creation and encapsulates it in a subclass. This decouples the 
 client code in the superclass from the object creation code in the subclass.
 All factory patterns encapsulate object creation. The Factory Method Pattern encapsulates object 
 creation by letting subclasses decide what objects to create.

 Definition:  The Factory Method Pattern defines an interface for creating an object, but lets 
 subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.

 Abstract Creator gives you an interface with a method for creating objects, also known as the
“factory method.”

## The following guidelines can help you avoid OO designs that violate the Dependency Inversion Principle:
� No variable should hold a reference to a concrete class.
� No class should derive from a concrete class.
� No method should override an implemented method of any of its base classes.


why redux over context?
Context updates re-render all consumers even if only a small part of the state changes.
No built-in middleware	You handle everything manually — retries, error handling, loading states
No action tracking	No built-in way to track or debug dispatched events (like Redux DevTools)
