-- Sample Social Posts for 4 Worlds Ecosystem
-- Run this after you have at least one user account created

-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with your actual user ID
-- To get your user ID:
-- 1. Go to Supabase → Table Editor → users
-- 2. Find your user by email
-- 3. Copy the 'id' value
-- 4. Replace 'YOUR_USER_ID_HERE' below with that ID

-- Or use this query to see your user ID:
-- SELECT id, email FROM users;

-- ============================================
-- General Posts (No specific world)
-- ============================================

INSERT INTO posts (user_id, content, world, likes, comments) VALUES
(
  '3485e578-cdea-4ad4-bd2c-72b8b9440ade',
  'Just discovered this amazing marketplace! Loving the variety of products across all four worlds. 🎉',
  NULL,
  ARRAY[]::UUID[],
  ARRAY[]::UUID[]
),
(
  '3485e578-cdea-4ad4-bd2c-72b8b9440ade',
  'Quick tip: Don''t forget to bookmark guides you find helpful! I''ve saved so many great resources already.',
  NULL,
  ARRAY[]::UUID[],
  ARRAY[]::UUID[]
);

-- ============================================
-- Home Haven Posts
-- ============================================

INSERT INTO posts (user_id, content, world, likes, comments) VALUES
(
  '3485e578-cdea-4ad4-bd2c-72b8b9440ade',
  'Just finished the 30-Day Decluttering Challenge from Home Haven! My living room has never looked better. Highly recommend the Minimalist Kitchen Organizer Set too! 🏠✨',
  'Home Haven',
  ARRAY[]::UUID[],
  ARRAY[]::UUID[]
),
(
  '3485e578-cdea-4ad4-bd2c-72b8b9440ade',
  'Pro tip for Home Haven enthusiasts: Start with one room at a time. I tried to organize everything at once and got overwhelmed. Small steps = big wins! 📦',
  'Home Haven',
  ARRAY[]::UUID[],
  ARRAY[]::UUID[]
);

-- ============================================
-- Tools Realm Posts
-- ============================================

INSERT INTO posts (user_id, content, world, likes, comments) VALUES
(
  '3485e578-cdea-4ad4-bd2c-72b8b9440ade',
  'The API Documentation Generator Pro is a game-changer! Cut my documentation time in half. Worth every penny for developers. 🛠️💻',
  'Tools Realm',
  ARRAY[]::UUID[],
  ARRAY[]::UUID[]
),
(
  '3485e578-cdea-4ad4-bd2c-72b8b9440ade',
  'Just read the Microservices Architecture guide. Mind blown 🤯. If you''re building scalable apps, this is a must-read. The code examples are super practical.',
  'Tools Realm',
  ARRAY[]::UUID[],
  ARRAY[]::UUID[]
);

-- ============================================
-- Lifestyle Oasis Posts
-- ============================================

INSERT INTO posts (user_id, content, world, likes, comments) VALUES
(
  '3485e578-cdea-4ad4-bd2c-72b8b9440ade',
  'Day 7 of the 21-Day Meditation Journey and I''m already feeling more centered and calm. Mornings have become so peaceful 🧘‍♀️🌿',
  'Lifestyle Oasis',
  ARRAY[]::UUID[],
  ARRAY[]::UUID[]
),
(
  '3485e578-cdea-4ad4-bd2c-72b8b9440ade',
  'The Plant-Based Meal Prep Guide has completely transformed my eating habits! Down 10lbs and feeling amazing. The recipes are delicious too! 🥗💚',
  'Lifestyle Oasis',
  ARRAY[]::UUID[],
  ARRAY[]::UUID[]
);

-- ============================================
-- Creative Nexus Posts
-- ============================================

INSERT INTO posts (user_id, content, world, likes, comments) VALUES
(
  '3485e578-cdea-4ad4-bd2c-72b8b9440ade',
  'The Abstract Digital Art Pack Vol 1 is INCREDIBLE! Using these textures in all my designs now. The quality is top-notch 🎨✨',
  'Creative Nexus',
  ARRAY[]::UUID[],
  ARRAY[]::UUID[]
),
(
  '3485e578-cdea-4ad4-bd2c-72b8b9440ade',
  'Just finished the Color Theory guide and my artwork has improved SO much. Understanding color harmony vs just picking colors randomly makes a huge difference! 🌈🎨',
  'Creative Nexus',
  ARRAY[]::UUID[],
  ARRAY[]::UUID[]
);

-- ============================================
-- Verify Posts Were Created
-- ============================================

-- Run this to check:
SELECT 
  world, 
  COUNT(*) as post_count 
FROM posts 
GROUP BY world 
ORDER BY world;

-- Should show:
-- NULL (General): 2 posts
-- Home Haven: 2 posts
-- Tools Realm: 2 posts
-- Lifestyle Oasis: 2 posts
-- Creative Nexus: 2 posts
-- Total: 10 posts
