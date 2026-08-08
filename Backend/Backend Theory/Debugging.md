#  A GC Root is basically an object/reference from which the JVM starts determining what is still reachable.

* Common examples include:
  - active thread stacks
  - static fields
  - JNI references
  - certain JVM-internal references

# Jstack, Jmap and Jcmd

* jstack → "What are all my threads doing right now?"
* jstack <PID> > thread-dump.txt
* Heap dump → "What objects are occupying my memory right now?"
* jmap -dump:live,format=b,file=heap.hprof 12345 -> Take a snapshot of the Java heap of process 12345,      include only objects that are currently alive, store it in binary HPROF 
format, and save it as heap.hprof.

* jmap is primarily focused on memory/heap inspection.

jmap
 │
 ├── Heap information
 ├── Object histogram
 └── Heap dump

* jcmd is a general-purpose JVM diagnostic command interface.

jcmd
 │
 ├── Thread diagnostics
 ├── Heap diagnostics
 ├── GC diagnostics
 ├── JVM configuration
 ├── VM information
 ├── Class information
 └── Other JVM diagnostics

 * jcmd <PID> GC.heap_info -> This gives you a summary of the JVM heap right now. -> How much memory are we using?
 * jcmd <PID> GC.heap_dump /tmp/heap.hprof -> Take a snapshot of the objects currently in the JVM heap and save it here.
 * jcmd <PID> GC.class_histogram -> What types of objects are consuming memory?

                     JVM
                     │
          ┌──────────┴──────────┐
          │                     │
       THREADS                 HEAP
          │                     │
       jstack                  jcmd
          │                     │
          │             ┌───────┼────────┐
          │             │       │        │
          │          heap_info histogram dump
          │             │       │        │
          ↓             ↓       ↓        ↓
      What are       How much  What     Deep
      threads        memory?   objects? analysis
      doing?
          │                              │
          ↓                              ↓
      deadlocks                       MAT
      blocked                         │
      stuck                           ↓
      locks                       memory leak
      thread pools

