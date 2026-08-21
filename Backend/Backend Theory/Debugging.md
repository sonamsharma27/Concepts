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
* jmap -dump:live,format=b,file=heap.hprof 12345 -> Take a snapshot of the Java heap of process 12345, include only objects that are currently alive, store it in binary HPROF 
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


LINUX DEBUGGING COMMAND FLAGS — QUICK REFERENCE

1. lsof

-i  → Internet
      Show network-related open files/sockets

-p  → Process
      Filter by PID

Examples:
lsof -i
→ Show network connections

lsof -p 1234
→ Show all files/resources opened by PID 1234

lsof -p 1234 -i
→ Show network connections of PID 1234


2. ss

-t  → TCP
      Show TCP sockets

-u  → UDP
      Show UDP sockets

-l  → Listening
      Show listening sockets

-p  → Process
      Show PID/process using the socket

-n  → Numeric
      Don't resolve hostnames/service names
      Show IPs and port numbers directly

-a  → All
      Show all sockets

-s  → Summary
      Show socket/network statistics

-o  → Timer information
      Show socket timers


# IMPORTANT COMMANDS

ss -tulpn

→ Show TCP + UDP listening sockets
  + owning process/PID
  + numeric IPs/ports

Mnemonic:
T U L P N
TCP UDP Listening Process Numeric


ss -tanp
→ Show ALL TCP connections
  + numeric IPs/ports
  + owning process/PID

Useful for investigating:
ESTABLISHED
TIME-WAIT
CLOSE-WAIT
SYN-SENT
LISTEN


ss -s
→ Show network/socket summary


ss -to
→ Show TCP sockets + timer information


3. TOP DEBUGGING FLOW

Problem: "Which process is using port 8080?"

lsof -i :8080

        ↓

Get PID

        ↓

ps -p <PID> -o pid,ppid,%cpu,%mem,etime,cmd

        ↓

Check process network connections

lsof -p <PID> -i

        ↓

Check TCP connection states

ss -tanp


4. MENTAL MODEL

Machine
   ↓
Process
   ↓
File descriptors
   ↓
Network sockets
   ↓
Connection state
   ↓
Application

ps       → What processes are running?
lsof     → What resources/files/sockets does a process use?
ss       → What network connections/sockets exist?
jstack   → What are Java threads doing?
jcmd     → What is the JVM/GC doing?


MOST IMPORTANT TO MEMORIZE

ps aux
→ What processes are running?

lsof -i :8080
→ Who is using port 8080?

lsof -p <PID>
→ What resources does this process have open?

ss -tulpn
→ What ports are listening and which processes own them?

ss -tanp
→ What TCP connections exist and which processes own them?

ss -s
→ What's the overall network/socket state?

ps aux --sort=-%cpu | head -> Which process is consuming  max CPU?

ps aux --sort=-%mem | head -> Which process is consuming the most memory?

# Note:
netstat is deprecated in modern Linux systems, ss is used 

* fuser file_name
"Which process is currently using this file, directory, or port?"


Must memorize:

ps aux
lsof -i :8080
lsof -p <PID>
ss -tulpn
ss -tanp
ss -s

# awk
To get the first field  of the file, you can do awk '{print $1}' access.log or using "cut" with delimiter of space (-d' ') and picking the first field (-f1): cat access.log |cut -d' ' -f1. You may want to append a pipe | head or | tail as you construct the command to see how your filters are working.

awk '{print $1}' access.log|sort|uniq -c|sort -r|head -1|awk '{print $2}' > /home/admin/highestip.txt

-r is for reverse
-c is for count

# grep

Find matches for the exact *word* "Donald" in a file - words that contain "Donald," like "McDonald," won't count:

	grep -w "Donald" famousducks.txt

Find matches for "McDuck" in every file in the current directory:

	grep "McDuck" *

Find matches for "McDuck" in every file in the current directory AND every subdirectory, all the way down:

	grep -r "McDuck" *

For each match of "Howard", print out that line AND the 4 lines after it (5 lines total):

	grep -A 4 "Howard" famousducks.txt // A -> after

For each match of "Howard", print out that line AND the 4 lines before it (5 lines total):

	grep -B 4 "Howard" famousducks.txt // B -> Before

For each match of "Howard", print out that line AND the 4 lines before it AND the 4 lines after it (9 lines total):

	grep -C 4 "Howard" famousducks.txt

Instead of printing out the matching lines themselves, print out the filenames that match your search:

	grep -l "Daffy" * // l -> list

Just get the number of matches:

	grep -c "Daffy" *

Show line numbers along with the matching lines:

	grep -n "Daffy" famousducks.txt
