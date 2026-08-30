# Ques: Why would I choose an abstract class here?

Because File and Directory have actual shared state and shared implementation.

We have:

abstract class FileSystemNode {
    private String name;
    private Directory parent;
    private Instant createdAt;
    private Instant modifiedAt;

    // common behavior
}

Both File and Directory genuinely are filesystem nodes and need the same data.

If we used an interface:

interface FileSystemNode {
    String getName();
    Directory getParent();
    Instant getCreatedAt();
    Instant getModifiedAt();
}

then we'd have to put the fields somewhere else.

For example:

class File implements FileSystemNode {
    private String name;
    private Directory parent;
    private Instant createdAt;
    private Instant modifiedAt;
}

and again:

class Directory implements FileSystemNode {
    private String name;
    private Directory parent;
    private Instant createdAt;
    private Instant modifiedAt;
}

We've duplicated the state.

That's the main reason I'd choose an abstract class here.

# Points to remember :
* If state/ behavour is shared then go for abstract class
* If not, eg: if impl of getParent can differ in subclasses, then go for interface
