/*
================================================================================================
INSTAGRAM FRONTEND SYSTEM DESIGN - INTERVIEW GUIDE
================================================================================================

Step 0: Clarifying Requirements (5 min)
----------------------------------------

Interviewer:
"Before we start, can you clarify the scope of Instagram we are designing from the frontend perspective?"

Expected Answer / Guidance:

Core features to cover:
• Feed (scrollable posts with images, videos, captions, likes, comments)
• Stories (full-screen ephemeral content)
• User profile page (grid of posts, followers/following)
• Likes, comments, follow/unfollow interactions
• Notifications (basic push/real-time)
• Search and explore
• Uploading posts and stories

Constraints:
• Web/desktop first, but responsive/mobile friendly
• High performance (images/videos, infinite scroll)
• Fast initial load, smooth scrolling

================================================================================================
Step 1: High-Level Frontend Architecture (10 min)
================================================

Interviewer:
"How would you structure the frontend for Instagram?"

Answer:

1. Framework/Stack:
    • React (component-based, reusable)
    • State management:
      - Zustand / Redux for global state (user, feed, notifications)
      - Local component state for ephemeral UI like likes animation
    • Styling: CSS Modules / Tailwind / SCSS for modular styles
    • Build: Webpack / Vite for bundling

2. Component Structure:
    App
    ├── Navbar (Search, Notifications, Profile menu)
    ├── FeedPage
    │   ├── FeedList (infinite scroll)
    │   ├── FeedItem (image/video post, likes, comments, share)
    │   └── StoriesBar (horizontal scroll, story thumbnails)
    ├── ProfilePage
    │   ├── ProfileHeader (username, bio, follow button)
    │   └── PostsGrid (images/videos)
    ├── SearchPage
    │   ├── SearchInput
    │   └── SearchResults (users/posts)
    └── PostModal (for post detail view)

3. Data Fetching:
    • React Query / SWR for caching, deduplication, and background refetch
    • Infinite scroll: fetch posts in pages (cursor-based pagination)
    • Prefetching: load next page when user scrolls near bottom

Follow-up:
"How would you handle real-time updates for likes, comments, or new posts?"

Answer:
• WebSockets / SSE for events like likes/comments from server → client, 
  from client → server use HTTP
• Optimistic UI updates for likes (update UI immediately, sync with backend)
• Push notification badge updated via WebSocket or periodic polling (fallback)

================================================================================================
Step 2: Feed Design & Performance (10 min)
==========================================

Interviewer:
"How would you implement the feed with smooth infinite scrolling and minimal memory usage?"

Answer:

Virtualization / Windowing:
• Use libraries like react-window or react-virtualized
• Only render posts in viewport + buffer above/below

Lazy Loading Images & Videos:
• loading="lazy" for images
• IntersectionObserver for video autoplay when in viewport

Placeholder UI / Skeletons:
• Show skeletons while fetching data to improve perceived performance

Batching State Updates:
• Avoid re-rendering the entire feed when a single post updates

Prefetch Next Posts:
• Fetch next N posts before user scrolls near bottom

Follow-up:
"How would you optimize video posts for mobile and desktop?"

Answer:
• Adaptive video quality (based on viewport size + network speed)
• Use <video> with preload="metadata"
• Pause videos outside viewport
• Use HLS or DASH streaming

================================================================================================
Step 3: Stories (10 min)
========================

Interviewer:
"How would you implement Stories in React?"

Answer:
• StoriesBar component: horizontal scroll of story thumbnails
• StoryModal: full-screen view, autoplay with timer
• Preloading: fetch next stories in advance
• Navigation: swipe / click to next story

Optimizations:
• Only keep current + next + previous stories in memory
• Use requestAnimationFrame for timer animations instead of setInterval

Follow-up:
"How would you handle media-heavy stories without crashing the browser?"

Answer:
• Limit concurrent media preloads (e.g., 2-3 stories at a time)
• Release previous media from memory (URL.revokeObjectURL if using blobs)
• Compress images/videos before displaying

================================================================================================
Step 4: Profile Page & Grid Layout (5 min)
==========================================

Interviewer:
"How would you render a grid of posts efficiently?"

Answer:
• CSS Grid for layout (grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)))
• Lazy load images
• Virtualize large grids if there are thousands of posts
• Use optimized image formats (WebP/AVIF)

================================================================================================
Step 5: Post Interactions (Likes, Comments) (5 min)
===================================================

Interviewer:
"How would you implement likes and comments efficiently in the frontend?"

Answer:
• Likes: optimistic UI update + debounce server request
• Comments: fetch top 3 comments initially, fetch full list on demand
• State management: maintain local cache of likes/comments to reduce repeated fetches
• Real-time: WebSocket/SSE events for live updates

Follow-up:
"How would you prevent performance bottlenecks if hundreds of likes happen quickly?"

Answer:
• Batch updates on the frontend
• Debounce server updates
• Use React state immutably to avoid unnecessary re-renders

================================================================================================
Step 6: Search & Explore (5 min)
================================

Interviewer:
"How would you design the search experience?"

Answer:
• Input box with debounced API call
• Autocomplete suggestions: top users/posts
• Infinite scroll for results
• Highlight search terms in results
• Cache recent queries for instant results

================================================================================================
Step 7: Uploading Posts / Stories (5 min)
=========================================

Interviewer:
"How would you handle file uploads in frontend efficiently?"

Answer:
• Use <input type="file" /> or drag-and-drop
• Preview images/videos using FileReader API
• Chunk large files if needed
• Show upload progress
• Optimistically update feed (e.g., post appears as "uploading")

Follow-up:
"How would you handle large images and videos on the client-side?"

Answer:
• Resize/compress images before upload
• Transcode video to target format
• Use Web Workers for heavy computation

================================================================================================
Step 8: Notifications (5 min)
=============================

Interviewer:
"How would you handle notifications on frontend?"

Answer:
• WebSocket/SSE to receive new notifications
• Maintain local cache in Zustand/Redux
• Show badge counts
• Lazy load notification content
• Paginate old notifications

================================================================================================
Step 9: Performance & Optimization (5 min)
==========================================

Interviewer:
"How would you optimize the frontend for Instagram at scale?"

Answer:
• Code splitting & lazy loading: React lazy + Suspense
• Service workers for offline caching
• CDN for images/videos
• Memoization: React.memo, useMemo, useCallback
• Reduce bundle size: tree-shaking, remove unused libraries
• SSR / hydration: faster first contentful paint
• Analytics: monitor slow components with React Profiler

================================================================================================
Step 10: Handling Edge Cases (5 min)
====================================

Interviewer:
"How would you handle poor network conditions?"

Answer:
• Offline mode: show cached posts using IndexedDB
• Retry failed requests
• Low-resolution placeholder images
• Graceful degradation for videos/stories

================================================================================================
✅ END OF INTERVIEW SUMMARY
==========================

Frontend System Design Key Points Covered:
• Component structure, state management, data fetching
• Feed virtualization, infinite scroll, lazy loading
• Stories modal and memory optimization
• Profile page grid layout
• Likes, comments, optimistic updates, real-time events
• Search, notifications, and uploads
• Performance optimization (SSR, memoization, CDN, service worker)
• Handling offline/poor network

================================================================================================
WEBSOCKETS vs HTTP - WHEN TO USE WHAT
=====================================

Action                      | Client → Server      | Server → Client (Real-time)   | Notes
--------------------------- | -------------------- | ----------------------------- | -----------------------------------------------------------------------
Like a post                 | HTTP POST            | WebSocket (optional)          | HTTP ensures durability; WebSocket used to update other users instantly
Comment on a post           | HTTP POST            | WebSocket (optional)          | Same as likes; real-time updates for viewers
Direct Message (DM)         | WebSocket            | WebSocket                     | Fully real-time, bidirectional communication
Live comment / reaction     | WebSocket            | WebSocket                     | Real-time updates for all viewers
Story upload notification   | HTTP + optional push | WebSocket / Push notification | WebSocket may notify new story; media fetched via HTTP
Typing indicator in DM      | WebSocket            | WebSocket                     | Requires instant updates, ideal for WebSockets
Online presence / last seen | WebSocket            | WebSocket                     | Frequent, real-time state updates
Post feed updates           | HTTP GET / Polling   | SSE or WebSocket (optional)   | Polling is common; WebSocket/SSE can push new feed notifications

WebSockets Use Cases in Instagram:
• Direct Messages (DMs): Real-time message delivery
• Live Comments or Reactions: Instant updates during live content
• Story Views and Notifications: Immediate notification delivery
• Online Presence / Typing Indicators: Real-time status updates

Implementation on Frontend:
• Open WebSocket connection after authentication
• Receive messages as JSON payloads
• Use custom hook (e.g., useWebSocket) for React integration
• Handle disconnection and reconnection logic for mobile networks

================================================================================================
📌 INSTAGRAM APIs - FRONTEND SYSTEM DESIGN CHEAT SHEET
=====================================================

🔹 Authentication & User
-----------------------
Action                         | Method | Endpoint (example)
Signup (email/mobile)          | POST   | /api/auth/signup
Login (with OTP/password)      | POST   | /api/auth/login
Refresh session/token          | POST   | /api/auth/refresh
Get current user profile       | GET    | /api/users/me
Update profile                 | PUT    | /api/users/{id}

🔹 Feed / Posts
---------------
Action                         | Method | Endpoint (example)
Fetch feed (paginated)         | GET    | /api/feed?page=1
Fetch single post              | GET    | /api/posts/{id}
Create new post (image/video)  | POST   | /api/posts
Like a post                    | POST   | /api/posts/{id}/like
Unlike a post                  | DELETE | /api/posts/{id}/like
Comment on a post              | POST   | /api/posts/{id}/comments
Fetch comments (paginated)     | GET    | /api/posts/{id}/comments?page=1
Save/Bookmark post             | POST   | /api/posts/{id}/save

🔹 Stories
----------
Action                         | Method | Endpoint (example)
Upload a story                 | POST   | /api/stories
Get stories of connections     | GET    | /api/stories
View a story (mark seen)       | POST   | /api/stories/{id}/view
Fetch viewers of a story       | GET    | /api/stories/{id}/viewers
Delete story                   | DELETE | /api/stories/{id}

🔹 Direct Messages (DMs)
-----------------------
Action                         | Method | Endpoint (example)
Fetch conversations list       | GET    | /api/dms/conversations
Fetch messages in conversation | GET    | /api/dms/{conversationId}/messages
Send a message                 | WS/POST| /api/dms/send
Mark messages as read          | POST   | /api/dms/{conversationId}/read
Typing indicator               | WS     | event: typing
Online presence updates        | WS     | event: presence

🔹 Notifications
---------------
Action                         | Method | Endpoint (example)
Fetch notifications            | GET    | /api/notifications
Mark notification as read      | POST   | /api/notifications/{id}/read
Real-time push notifications   | WS/SSE | event: notification

🔹 Explore / Search
------------------
Action                         | Method | Endpoint (example)
Fetch explore feed             | GET    | /api/explore
Search users                   | GET    | /api/search/users?q={query}
Search hashtags                | GET    | /api/search/hashtags?q={query}

🔹 Reels (short videos)
-----------------------
Action                         | Method | Endpoint (example)
Upload reel                    | POST   | /api/reels
Fetch reels feed               | GET    | /api/reels
Like/Comment on reel           | POST   | /api/reels/{id}/like
View reel (analytics)          | POST   | /api/reels/{id}/view

🔹 Analytics / Insights
-----------------------
Action                         | Method | Endpoint (example)
Post insights (likes, views)   | GET    | /api/insights/post/{id}
Story insights                 | GET    | /api/insights/story/{id}
Reel insights                  | GET    | /api/insights/reel/{id}

================================================================================================
📌 Instagram Entities (Frontend POV)
===================================

🔹 User-related Entities

User: id, username, fullName, profilePic, bio, followersCount, followingCount, isVerified, isOnline

Profile (extended user info): userId, posts[], stories[], reels[], highlights[]

🔹 Post-related Entities

Post: id, author (User), caption, media (image/video), createdAt, location, taggedUsers[]

Like: userId, postId, timestamp

Comment: id, postId, userId, text, createdAt, replies[]

SavedPost: userId, postId

🔹 Story-related Entities

Story: id, author (User), mediaUrl, createdAt, expiresAt, viewersCount

StoryView: storyId, viewer (User), timestamp, reaction?

Highlight: id, title, coverImage, stories[]

🔹 Direct Messages (DMs)

Conversation:
id, participants [Users], lastMessage, unreadCount, isGroupChat

Message:
id, conversationId, sender (User), text/media, createdAt, status (sent, delivered, read)

TypingIndicator:
conversationId, userId, isTyping

Presence:
userId, isOnline, lastSeen

🔹 Notifications

Notification:
id, type (like, comment, follow, message, storyView), actor (User), target (Post/Story/User), createdAt, isRead

🔹 Explore / Search

ExploreItem:
id, type (post/reel/story), media, author (User), stats (likes, views)

Hashtag:
id, name, postsCount

🔹 Reels

Reel:
id, author (User), videoUrl, caption, musicTrack, likesCount, commentsCount, createdAt

ReelView:
reelId, viewerId, timestamp

🔹 Analytics / Insights

PostInsights:
postId, impressions, reach, likes, comments, shares, saves

StoryInsights:
storyId, impressions, reach, exits, replies

ReelInsights:
reelId, plays, likes, comments, shares



Component Arch:

<App>
  <AuthProvider/>        // Context for auth state, tokens
  <ThemeProvider/>       // Theme & dark/light mode
  <Router>
    <Home>
      <Header>
        <Logo/>
        <SearchBar/>
        <NavItems/>
      </Header>
      <StoriesBar>
        <StoryItem/>
        <StoryUploader/>
      </StoriesBar>
      <Feed>
        <PostCard>
          <PostHeader/>       // Username, avatar, options
          <PostMedia/>        // Image/Video carousel
          <PostActions/>      // Like, Comment, Share
          <PostLikes/>        // Like count, avatars
          <PostCaption/>      // Username + caption text
          <PostComments/>     // Comment preview
          <AddCommentBox/>    // Input for new comment
        </PostCard>
      </Feed>
      <Suggestions>
        <SuggestionItem/>
      </Suggestions>
    </Home>

    <Explore>
      <SearchBar/>
      <ExploreGrid>
        <ExploreItem/>
      </ExploreGrid>
    </Explore>

    <Reels>
      <ReelCard>
        <ReelVideo/>
        <ReelActions/>      // Like, Comment, Share
        <ReelCaption/>
        <ReelComments/>
      </ReelCard>
    </Reels>

    <DirectMessages>
      <DMList>
        <DMThreadItem/>
      </DMList>
      <ChatWindow>
        <ChatHeader/>
        <ChatMessages>
          <MessageBubble/>
        </ChatMessages>
        <ChatInput/>
      </ChatWindow>
    </DirectMessages>

    <Profile>
      <ProfileHeader>
        <ProfilePic/>
        <ProfileStats/>
        <FollowButton/>
      </ProfileHeader>
      <ProfileTabs>
        <PostsGrid/>
        <ReelsGrid/>
        <TaggedGrid/>
      </ProfileTabs>
    </Profile>

    <Notifications>
      <NotificationItem/>
    </Notifications>

    <Settings>
      <AccountSettings/>
      <PrivacySettings/>
    </Settings>
  </Router>
</App>

*/
