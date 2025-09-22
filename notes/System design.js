// What is REST API?
//  * REST (Representational State Transfer) is an architectural style for designing networked applications.
//  * It relies on a stateless, client-server communication model and uses standard HTTP methods.  
//  * REST APIs allow different systems to communicate over the web using standard protocols and formats like JSON or XML.

/**
 * Benefits of REST API
 * - EASE OF USE
 * - SCALABILITY
 * - FLEXIBILITY WITH DATA
 * - INTEROPERABILITY
 * - STALELESSNESS
 * - CACHEABILITY
 * - UNIFORM INTERFACE
 * - LAYERED SYSTEM
 * - SEPARATION OF CONCERNS - CLIENT-SERVER ARCHITECTURE
 * - EASE OF TESTING
 * - SECURITY
 * - VERSIONING
 * - COMMUNITY SUPPORT
 * - LANGUAGE AGNOSTIC
 * - PERFORMANCE
 * - MAINTAINABILITY
 * - SIMPLICITY
 * - STANDARDIZATION
 * - EFFICIENCY
 * - MONITORING AND ANALYTICS
 * - DOCUMENTATION
 * - ERROR HANDLING
 * - RATE LIMITING
 * - AUTHENTICATION AND AUTHORIZATION
 * - SUPPORT FOR MULTIPLE FORMATS
 * - SUPPORT FOR HYPERMEDIA
 * - SUPPORT FOR CORS (Cross-Origin Resource Sharing)
 * - SUPPORT FOR ASYNCHRONOUS COMMUNICATION
 * - SUPPORT FOR PAGINATION
 */


/**
 * Request headers :
 *   - Contain metadata sent by the client to the server.
 *   - Examples: 
 *       - Authorization: Bearer <token>
 *       - Content-Type: application/json
 *       - Accept: application/json
 *       - User-Agent: <browser or client info>
 *       - Cookie: <cookie data>
 *       - Accept-Encoding: gzip, deflate, br
 *       - Referer: <previous page URL>
 *       - X-Requested-With: XMLHttpRequest
 *       - If-None-Match: <etag>
 *       - If-Modified-Since: <date>
 * 
 * Response headers :
 *   - Contain metadata sent by the server to the client.
 *   - Examples:
 *       - Content-Type: application/json
 *       - Set-Cookie: <cookie data>
 *       - Cache-Control: no-cache
 *       - Location: <redirect URL>
 *       - Access-Control-Allow-Origin: *
 *       - Content-Length
 *       - ETag: <etag>
 *       - Expires: <date>
 *       - Last-Modified: <date>
 *       - WWW-Authenticate: Basic realm="example"
 * 
 * Status code :
 *   - Numeric codes indicating the result of the HTTP request.
 *   - Examples:
 *       - 200 OK: Request succeeded
 *       - 201 Created: Resource created
 *       - 202 Accepted: Request accepted for processing
 *       - 204 No Content: No content to return
 *       - 301 Moved Permanently: Resource moved
 *       - 302 Found: Temporary redirect
 *       - 304 Not Modified: Resource not modified
 *       - 400 Bad Request: Client error
 *       - 401 Unauthorized: Authentication required
 *       - 403 Forbidden: Access denied
 *       - 404 Not Found: Resource not found
 *       - 405 Method Not Allowed: HTTP method not supported
 *       - 409 Conflict: Resource conflict
 *       - 415 Unsupported Media Type: Invalid content type
 *       - 429 Too Many Requests: Rate limiting
 *       - 500 Internal Server Error: Server error
 *       - 502 Bad Gateway: Invalid response from upstream server
 *       - 503 Service Unavailable: Server overloaded or down
 */
