-- Bypass FK constraints and triggers for seed data
SET session_replication_role = 'replica';

-- ============================================================
-- STAYS (15 total: 4 adventure, 4 culture, 4 disconnect, 3 celebration)
-- ============================================================

-- Use fixed UUIDs so we can reference them in collections and reviews
INSERT INTO stays (id, title, slug, description, location, price_per_night, cleaning_fee, service_fee, max_guests, type, vibe, travel_type, amenities, images) VALUES

-- ADVENTURE (4)
('a0000000-0000-0000-0000-000000000001', 'Summit Treehouse', 'summit-treehouse',
 'Perched high above the forest canopy, this treehouse offers breathtaking mountain views and thrilling rope bridges. Wake up to birdsong and watch the sunrise paint the peaks gold.',
 'Asheville, North Carolina', 18500, 5000, 2500, 2, 'treehouse', 'adventure', 'solo',
 ARRAY['wifi', 'hammock', 'stargazing-deck', 'hiking-trails', 'binoculars'],
 ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000002', 'Glacier Cabin', 'glacier-cabin',
 'A cozy log cabin at the edge of a glacial valley. Perfect for couples who love crisp mountain air and starlit nights by the fireplace.',
 'Whitefish, Montana', 22000, 6000, 3000, 4, 'cabin', 'adventure', 'duo',
 ARRAY['fireplace', 'hot-tub', 'kitchen', 'wifi', 'snowshoes', 'sauna'],
 ARRAY['https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000003', 'Rapids Glamping', 'rapids-glamping',
 'Luxury safari tents along a roaring river. Spend your days rafting class III rapids and your evenings gathered around the fire pit under the stars.',
 'Moab, Utah', 15000, 4000, 2000, 6, 'glamping', 'adventure', 'group',
 ARRAY['bbq', 'kayaks', 'outdoor-shower', 'stargazing-deck', 'bikes', 'firepit'],
 ARRAY['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000004', 'Cliff Yurt', 'cliff-yurt',
 'A spacious yurt perched on a dramatic cliff overlooking the Pacific. Fall asleep to crashing waves and wake up to whale sightings from your bed.',
 'Big Sur, California', 28000, 6500, 3500, 5, 'yurt', 'adventure', 'family',
 ARRAY['kitchen', 'wifi', 'yoga-mat', 'binoculars', 'hammock', 'outdoor-shower', 'bbq'],
 ARRAY['https://images.unsplash.com/photo-1499363536502-87642509e31b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1533575770077-052fa2c609fc?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop']),

-- CULTURE (4)
('a0000000-0000-0000-0000-000000000005', 'Soho Houseboat', 'soho-houseboat',
 'A stylish narrowboat moored in the heart of the city. Step off the deck and into galleries, markets, and world-class dining within minutes.',
 'London, England', 32000, 7000, 4000, 3, 'houseboat', 'culture', 'duo',
 ARRAY['wifi', 'kitchen', 'library', 'bikes', 'hammock'],
 ARRAY['https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1543489822-c49534f3271f?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000006', 'Kyoto Cabin', 'kyoto-cabin',
 'A minimalist wooden cabin in the bamboo forests outside Kyoto. Meditate at dawn, explore ancient temples, and soak in a private onsen.',
 'Kyoto, Japan', 25000, 5500, 3000, 1, 'cabin', 'culture', 'solo',
 ARRAY['wifi', 'yoga-mat', 'library', 'sauna', 'hot-tub'],
 ARRAY['https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000007', 'Marrakech Glamping', 'marrakech-glamping',
 'Luxurious Berber-style tents on the edge of the medina. Sip mint tea on hand-woven rugs while the call to prayer echoes through the palm grove.',
 'Marrakech, Morocco', 19500, 4500, 2500, 8, 'glamping', 'culture', 'group',
 ARRAY['wifi', 'kitchen', 'hammock', 'bbq', 'library', 'yoga-mat', 'outdoor-shower'],
 ARRAY['https://images.unsplash.com/photo-1539437829697-1b4ed5aebd19?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1548018560-c7196e1dca22?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000008', 'Tuscany Treehouse', 'tuscany-treehouse',
 'A romantic treehouse nestled among olive groves and vineyards. Take cooking classes, tour wineries, and watch sunsets over rolling Tuscan hills.',
 'Siena, Italy', 35000, 7500, 3500, 5, 'treehouse', 'culture', 'family',
 ARRAY['wifi', 'kitchen', 'bbq', 'bikes', 'hammock', 'library', 'fireplace'],
 ARRAY['https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1467803738586-46b7eb7b16a1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&h=600&fit=crop']),

-- DISCONNECT (4)
('a0000000-0000-0000-0000-000000000009', 'Forest Cabin', 'forest-cabin',
 'A rustic off-grid cabin deep in old-growth forest. No Wi-Fi, no distractions — just the sound of wind through ancient trees and a crackling woodstove.',
 'Olympic Peninsula, Washington', 12000, 3500, 1500, 2, 'cabin', 'disconnect', 'solo',
 ARRAY['fireplace', 'library', 'hammock', 'hiking-trails'],
 ARRAY['https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000010', 'Desert Yurt', 'desert-yurt',
 'A minimalist yurt surrounded by red rock formations and endless desert sky. Fall asleep under a blanket of stars visible only in the darkest places on Earth.',
 'Sedona, Arizona', 16500, 4000, 2000, 3, 'yurt', 'disconnect', 'duo',
 ARRAY['stargazing-deck', 'yoga-mat', 'outdoor-shower', 'firepit', 'hammock'],
 ARRAY['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1533632359083-0185df1be8d4?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000011', 'Island Glamping', 'island-glamping',
 'Barefoot luxury on a private island. Your safari tent sits on white sand, steps from turquoise waters. Kayak to nearby coves or simply do nothing at all.',
 'San Juan Islands, Washington', 38000, 8000, 4000, 6, 'glamping', 'disconnect', 'family',
 ARRAY['kayaks', 'outdoor-shower', 'hammock', 'bbq', 'bikes', 'stargazing-deck'],
 ARRAY['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000012', 'Lakeside Treehouse', 'lakeside-treehouse',
 'A secluded treehouse overlooking a mirror-still alpine lake. Paddle out at dawn, read by the fire at dusk, and let the silence restore your soul.',
 'Lake Placid, New York', 21000, 5500, 2500, 4, 'treehouse', 'disconnect', 'group',
 ARRAY['kayaks', 'fireplace', 'library', 'hammock', 'sauna', 'outdoor-shower'],
 ARRAY['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop']),

-- CELEBRATION (3)
('a0000000-0000-0000-0000-000000000013', 'Vineyard Houseboat', 'vineyard-houseboat',
 'A stunning houseboat docked along wine country canals. Host tastings on the sundeck, explore cellar doors by bike, and toast to life on the water.',
 'Napa Valley, California', 45000, 8000, 4000, 8, 'houseboat', 'celebration', 'group',
 ARRAY['kitchen', 'wifi', 'bikes', 'bbq', 'hot-tub', 'firepit'],
 ARRAY['https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1474073705867-a57dbf30d27f?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000014', 'Mountain Lodge Cabin', 'mountain-lodge-cabin',
 'A grand timber-frame cabin with cathedral ceilings and panoramic mountain views. Room for the whole family with a chef kitchen and game room.',
 'Jackson Hole, Wyoming', 42000, 7500, 3500, 8, 'cabin', 'celebration', 'family',
 ARRAY['fireplace', 'hot-tub', 'kitchen', 'wifi', 'sauna', 'bbq', 'library', 'bikes'],
 ARRAY['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000015', 'Garden Yurt', 'garden-yurt',
 'An enchanting yurt surrounded by lavender fields and rose gardens. Perfect for an intimate celebration with craft cocktails under fairy lights.',
 'Sonoma, California', 27500, 5500, 3000, 4, 'yurt', 'celebration', 'duo',
 ARRAY['hot-tub', 'outdoor-shower', 'hammock', 'firepit', 'yoga-mat', 'bbq'],
 ARRAY['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop']);

-- ============================================================
-- COLLECTIONS (5)
-- ============================================================
INSERT INTO collections (id, title, slug, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'Weekend Escapes', 'weekend-escapes',
 'Quick getaways perfect for a two-night reset. Close enough to reach by Friday evening, magical enough to feel worlds away.'),
('c0000000-0000-0000-0000-000000000002', 'Romantic Getaways', 'romantic-getaways',
 'Intimate retreats designed for two. Secluded spots with hot tubs, fireplaces, and views that make time stand still.'),
('c0000000-0000-0000-0000-000000000003', 'Family Adventures', 'family-adventures',
 'Spacious stays with room to explore. Kid-friendly amenities, outdoor activities, and memories waiting to be made.'),
('c0000000-0000-0000-0000-000000000004', 'Off-Grid Retreats', 'off-grid-retreats',
 'Disconnect to reconnect. These stays prioritize silence, nature, and the luxury of being unreachable.'),
('c0000000-0000-0000-0000-000000000005', 'Celebration Spots', 'celebration-spots',
 'Gather your favorite people in extraordinary places. Room for everyone, with settings worthy of the occasion.');

-- ============================================================
-- COLLECTION_STAYS (junction rows)
-- ============================================================
INSERT INTO collection_stays (collection_id, stay_id, position) VALUES
-- Weekend Escapes: Summit Treehouse, Forest Cabin, Garden Yurt
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 0),
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000009', 1),
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000015', 2),
-- Romantic Getaways: Glacier Cabin, Desert Yurt, Soho Houseboat
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 0),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000010', 1),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', 2),
-- Family Adventures: Cliff Yurt, Tuscany Treehouse, Island Glamping
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004', 0),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000008', 1),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000011', 2),
-- Off-Grid Retreats: Forest Cabin, Desert Yurt, Lakeside Treehouse
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000009', 0),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000010', 1),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000012', 2),
-- Celebration Spots: Vineyard Houseboat, Mountain Lodge Cabin, Garden Yurt
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000013', 0),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000014', 1),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000015', 2);

-- ============================================================
-- FAKE USERS for seed reviews (profiles only, no auth.users needed with replica mode)
-- ============================================================
INSERT INTO profiles (id, email, full_name) VALUES
('b0000000-0000-0000-0000-000000000001', 'alex.chen@example.com', 'Alex Chen'),
('b0000000-0000-0000-0000-000000000002', 'maria.garcia@example.com', 'Maria Garcia'),
('b0000000-0000-0000-0000-000000000003', 'sam.johnson@example.com', 'Sam Johnson'),
('b0000000-0000-0000-0000-000000000004', 'emma.wilson@example.com', 'Emma Wilson'),
('b0000000-0000-0000-0000-000000000005', 'james.taylor@example.com', 'James Taylor');

-- ============================================================
-- REVIEWS (20 across 10 stays)
-- ============================================================
INSERT INTO reviews (stay_id, user_id, rating, comment) VALUES
-- Summit Treehouse (3 reviews)
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 5, 'Absolutely magical. Waking up above the clouds was a once-in-a-lifetime experience.'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 4, 'Stunning views and very peaceful. The rope bridge was a fun touch, though a bit wobbly.'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 5, 'Best treehouse I have ever stayed in. Already planning my return trip.'),

-- Glacier Cabin (2 reviews)
('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 5, 'The hot tub under the stars was unforgettable. Cabin was spotless and incredibly warm.'),
('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 4, 'Beautiful location. The fireplace made every evening special.'),

-- Soho Houseboat (2 reviews)
('a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 4, 'Such a unique way to experience London. Loved the library nook on deck.'),
('a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 3, 'Cool concept but a bit cramped for two people. Great location though.'),

-- Kyoto Cabin (2 reviews)
('a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000003', 5, 'Pure serenity. The bamboo forest walks at dawn were the highlight of our Japan trip.'),
('a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000004', 5, 'Minimalist perfection. The private onsen was heavenly.'),

-- Forest Cabin (3 reviews)
('a0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000001', 4, 'Exactly what I needed. No wifi forced me to actually relax for once.'),
('a0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000005', 5, 'The old-growth forest is cathedral-like. Felt completely restored after three nights.'),
('a0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000003', 4, 'Cozy and rustic in the best way. Bring your own books and wine.'),

-- Desert Yurt (2 reviews)
('a0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000002', 5, 'The night sky alone is worth the trip. Never seen so many stars.'),
('a0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000004', 4, 'Beautiful and remote. The outdoor shower with red rock views was incredible.'),

-- Island Glamping (2 reviews)
('a0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001', 5, 'Paradise found. Kids loved kayaking to the neighboring islands every morning.'),
('a0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000003', 4, 'Incredible setting. Worth every penny for a family trip.'),

-- Vineyard Houseboat (2 reviews)
('a0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000005', 5, 'Hosted my birthday here — the sundeck wine tastings were a dream come true.'),
('a0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000002', 4, 'Amazing for a group celebration. The hot tub on the boat is a nice touch.'),

-- Mountain Lodge Cabin (1 review)
('a0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000004', 5, 'Our whole family fit comfortably. The game room kept the kids entertained for hours.'),

-- Garden Yurt (1 review)
('a0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000001', 4, 'The lavender fields at sunset were breathtaking. Very romantic and intimate.');

-- ============================================================
-- BLOCKED DATES (sample owner-blocked date ranges)
-- ============================================================
INSERT INTO blocked_dates (stay_id, start_date, end_date, reason) VALUES
-- Summit Treehouse: maintenance window
('a0000000-0000-0000-0000-000000000001', '2026-04-10', '2026-04-15', 'manual_block'),
-- Summit Treehouse: owner personal use
('a0000000-0000-0000-0000-000000000001', '2026-05-01', '2026-05-05', 'manual_block'),
-- Glacier Cabin: seasonal closure
('a0000000-0000-0000-0000-000000000002', '2026-04-20', '2026-04-30', 'manual_block'),
-- Forest Cabin: maintenance
('a0000000-0000-0000-0000-000000000009', '2026-04-05', '2026-04-08', 'manual_block');

-- Restore normal FK constraints and triggers
SET session_replication_role = 'origin';
