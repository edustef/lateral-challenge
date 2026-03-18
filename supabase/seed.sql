-- Bypass FK constraints and triggers for seed data
SET session_replication_role = 'replica';

-- ============================================================
-- STAYS (45 total: 12 adventure, 12 culture, 12 disconnect, 9 celebration)
-- ============================================================

-- Use fixed UUIDs so we can reference them in collections and reviews
INSERT INTO stays (id, title, slug, description, location, country, price_per_night, cleaning_fee, service_fee, max_guests, type, vibe, travel_type, amenities, images) VALUES

-- ADVENTURE (12)
('a0000000-0000-0000-0000-000000000001', 'Summit Treehouse', 'summit-treehouse',
 'Perched high above the forest canopy, this treehouse offers breathtaking mountain views and thrilling rope bridges. Wake up to birdsong and watch the sunrise paint the peaks gold.',
 'Asheville, North Carolina', 'US', 18500, 5000, 2500, 2, 'treehouse', 'adventure', 'solo',
 ARRAY['wifi', 'hammock', 'stargazing-deck', 'hiking-trails', 'binoculars'],
 ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000002', 'Glacier Cabin', 'glacier-cabin',
 'A cozy log cabin at the edge of a glacial valley. Perfect for couples who love crisp mountain air and starlit nights by the fireplace.',
 'Whitefish, Montana', 'US', 22000, 6000, 3000, 4, 'cabin', 'adventure', 'duo',
 ARRAY['fireplace', 'hot-tub', 'kitchen', 'wifi', 'snowshoes', 'sauna'],
 ARRAY['https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000003', 'Rapids Glamping', 'rapids-glamping',
 'Luxury safari tents along a roaring river. Spend your days rafting class III rapids and your evenings gathered around the fire pit under the stars.',
 'Moab, Utah', 'US', 15000, 4000, 2000, 6, 'glamping', 'adventure', 'group',
 ARRAY['bbq', 'kayaks', 'outdoor-shower', 'stargazing-deck', 'bikes', 'firepit'],
 ARRAY['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000004', 'Cliff Yurt', 'cliff-yurt',
 'A spacious yurt perched on a dramatic cliff overlooking the Pacific. Fall asleep to crashing waves and wake up to whale sightings from your bed.',
 'Big Sur, California', 'US', 28000, 6500, 3500, 5, 'yurt', 'adventure', 'family',
 ARRAY['kitchen', 'wifi', 'yoga-mat', 'binoculars', 'hammock', 'outdoor-shower', 'bbq'],
 ARRAY['https://images.unsplash.com/photo-1499363536502-87642509e31b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1533575770077-052fa2c609fc?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000016', 'Volcano Glamping', 'volcano-glamping',
 'Sleep in a luxury tent on the slopes of an active volcano. Hike lava fields by day and soak in geothermal hot springs as the earth rumbles beneath you.',
 'Hilo, Hawaii', 'US', 34000, 7000, 3500, 4, 'glamping', 'adventure', 'duo',
 ARRAY['hot-tub', 'hiking-trails', 'outdoor-shower', 'stargazing-deck', 'yoga-mat'],
 ARRAY['https://images.unsplash.com/photo-1547234935-80c7145ec969?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000017', 'Canyon Houseboat', 'canyon-houseboat',
 'A rugged houseboat docked in a dramatic red rock canyon. Kayak through slot canyons, cliff jump into turquoise water, and sleep under a ribbon of stars.',
 'Page, Arizona', 'US', 26000, 5500, 3000, 6, 'houseboat', 'adventure', 'group',
 ARRAY['kayaks', 'bbq', 'wifi', 'stargazing-deck', 'bikes'],
 ARRAY['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000018', 'Alpine Treehouse', 'alpine-treehouse',
 'A daring treehouse built into the side of an alpine cliff. Reach it by suspension bridge and enjoy panoramic views of snow-capped peaks from the canopy.',
 'Interlaken, Switzerland', 'CH', 41000, 8000, 4000, 2, 'treehouse', 'adventure', 'solo',
 ARRAY['wifi', 'binoculars', 'hammock', 'hiking-trails', 'yoga-mat'],
 ARRAY['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000019', 'Rainforest Cabin', 'rainforest-cabin',
 'A stilted cabin deep in tropical rainforest. Spot toucans from your deck, swim in natural pools, and hike to hidden waterfalls before breakfast.',
 'Monteverde, Costa Rica', 'CR', 17500, 4000, 2000, 4, 'cabin', 'adventure', 'family',
 ARRAY['kitchen', 'hammock', 'hiking-trails', 'outdoor-shower', 'binoculars', 'wifi'],
 ARRAY['https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000020', 'Fjord Yurt', 'fjord-yurt',
 'A heated yurt perched above a Norwegian fjord. Watch the northern lights dance above glassy water while wrapped in reindeer hides by the fire.',
 'Tromsø, Norway', 'NO', 31000, 6500, 3500, 3, 'yurt', 'adventure', 'duo',
 ARRAY['fireplace', 'stargazing-deck', 'sauna', 'kayaks', 'snowshoes'],
 ARRAY['https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000021', 'Dune Glamping', 'dune-glamping',
 'Luxury tents nestled between towering sand dunes. Ride camels at sunset, sandboard at dawn, and feast under Bedouin-style canopies beneath the Milky Way.',
 'Merzouga, Morocco', 'MA', 14000, 3500, 2000, 8, 'glamping', 'adventure', 'group',
 ARRAY['bbq', 'outdoor-shower', 'stargazing-deck', 'yoga-mat', 'firepit', 'hammock'],
 ARRAY['https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1539437829697-1b4ed5aebd19?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1533632359083-0185df1be8d4?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000022', 'Waterfall Treehouse', 'waterfall-treehouse',
 'A treehouse built beside a thundering waterfall in the Blue Mountains. Feel the mist on your face as you sip coffee on the cantilevered deck.',
 'Katoomba, Australia', 'AU', 23000, 5000, 2500, 2, 'treehouse', 'adventure', 'solo',
 ARRAY['wifi', 'hammock', 'hiking-trails', 'binoculars', 'yoga-mat', 'library'],
 ARRAY['https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000023', 'Tundra Cabin', 'tundra-cabin',
 'A warm timber cabin on the edge of the Arctic tundra. Chase the northern lights, mush huskies, and thaw out in the wood-fired sauna after each frozen adventure.',
 'Fairbanks, Alaska', 'US', 20000, 5000, 2500, 4, 'cabin', 'adventure', 'family',
 ARRAY['fireplace', 'sauna', 'snowshoes', 'kitchen', 'wifi', 'stargazing-deck'],
 ARRAY['https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop']),

-- CULTURE (12)
('a0000000-0000-0000-0000-000000000005', 'Soho Houseboat', 'soho-houseboat',
 'A stylish narrowboat moored in the heart of the city. Step off the deck and into galleries, markets, and world-class dining within minutes.',
 'London, England', 'GB', 32000, 7000, 4000, 3, 'houseboat', 'culture', 'duo',
 ARRAY['wifi', 'kitchen', 'library', 'bikes', 'hammock'],
 ARRAY['https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1543489822-c49534f3271f?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000006', 'Kyoto Cabin', 'kyoto-cabin',
 'A minimalist wooden cabin in the bamboo forests outside Kyoto. Meditate at dawn, explore ancient temples, and soak in a private onsen.',
 'Kyoto, Japan', 'JP', 25000, 5500, 3000, 1, 'cabin', 'culture', 'solo',
 ARRAY['wifi', 'yoga-mat', 'library', 'sauna', 'hot-tub'],
 ARRAY['https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000007', 'Marrakech Glamping', 'marrakech-glamping',
 'Luxurious Berber-style tents on the edge of the medina. Sip mint tea on hand-woven rugs while the call to prayer echoes through the palm grove.',
 'Marrakech, Morocco', 'MA', 19500, 4500, 2500, 8, 'glamping', 'culture', 'group',
 ARRAY['wifi', 'kitchen', 'hammock', 'bbq', 'library', 'yoga-mat', 'outdoor-shower'],
 ARRAY['https://images.unsplash.com/photo-1539437829697-1b4ed5aebd19?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1548018560-c7196e1dca22?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000008', 'Tuscany Treehouse', 'tuscany-treehouse',
 'A romantic treehouse nestled among olive groves and vineyards. Take cooking classes, tour wineries, and watch sunsets over rolling Tuscan hills.',
 'Siena, Italy', 'IT', 35000, 7500, 3500, 5, 'treehouse', 'culture', 'family',
 ARRAY['wifi', 'kitchen', 'bbq', 'bikes', 'hammock', 'library', 'fireplace'],
 ARRAY['https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1467803738586-46b7eb7b16a1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000024', 'Havana Houseboat', 'havana-houseboat',
 'A colorful houseboat in Havana harbor. Dance salsa on the dock, explore vintage car-lined streets, and sip mojitos as the sun sets over the Malecón.',
 'Havana, Cuba', 'CU', 16000, 4000, 2000, 4, 'houseboat', 'culture', 'duo',
 ARRAY['wifi', 'kitchen', 'bikes', 'hammock', 'library'],
 ARRAY['https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000025', 'Athens Yurt', 'athens-yurt',
 'A modern yurt on a rooftop terrace overlooking the Acropolis. Explore ancient ruins by day and dine at tavernas by night with the Parthenon lit above you.',
 'Athens, Greece', 'GR', 21000, 5000, 2500, 3, 'yurt', 'culture', 'solo',
 ARRAY['wifi', 'yoga-mat', 'library', 'binoculars', 'hammock'],
 ARRAY['https://images.unsplash.com/photo-1499363536502-87642509e31b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1533575770077-052fa2c609fc?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000026', 'Buenos Aires Glamping', 'buenos-aires-glamping',
 'Stylish glamping tents in a historic estancia outside Buenos Aires. Watch polo matches, learn tango from locals, and feast on wood-fired asado.',
 'Buenos Aires, Argentina', 'AR', 18500, 4500, 2500, 6, 'glamping', 'culture', 'group',
 ARRAY['bbq', 'wifi', 'kitchen', 'bikes', 'hammock', 'firepit', 'library'],
 ARRAY['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1548018560-c7196e1dca22?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000027', 'Bali Treehouse', 'bali-treehouse',
 'A bamboo treehouse surrounded by rice terraces and Hindu temples. Join offerings at dawn, surf legendary breaks, and dine on organic Balinese cuisine.',
 'Ubud, Bali', 'ID', 14500, 3500, 2000, 2, 'treehouse', 'culture', 'solo',
 ARRAY['wifi', 'yoga-mat', 'hammock', 'bikes', 'outdoor-shower', 'library'],
 ARRAY['https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000028', 'Prague Cabin', 'prague-cabin',
 'A cozy cabin on the banks of the Vltava River with views of Prague Castle. Walk to centuries-old beer halls, jazz clubs, and the Charles Bridge.',
 'Prague, Czech Republic', 'CZ', 19000, 4500, 2500, 4, 'cabin', 'culture', 'family',
 ARRAY['wifi', 'kitchen', 'fireplace', 'library', 'bikes', 'hammock'],
 ARRAY['https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1543489822-c49534f3271f?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000029', 'Oaxaca Glamping', 'oaxaca-glamping',
 'Artisan-crafted tents in the hills above Oaxaca. Learn mezcal distilling, take pottery workshops, and eat mole made from recipes passed down for generations.',
 'Oaxaca, Mexico', 'MX', 12500, 3000, 1500, 6, 'glamping', 'culture', 'group',
 ARRAY['kitchen', 'wifi', 'hammock', 'bbq', 'yoga-mat', 'outdoor-shower', 'firepit'],
 ARRAY['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000030', 'Istanbul Yurt', 'istanbul-yurt',
 'A silk-draped yurt in a courtyard garden steps from the Grand Bazaar. Sip Turkish coffee on kilim cushions and watch the sunset paint the minarets gold.',
 'Istanbul, Turkey', 'TR', 17500, 4000, 2000, 3, 'yurt', 'culture', 'duo',
 ARRAY['wifi', 'kitchen', 'library', 'yoga-mat', 'hammock'],
 ARRAY['https://images.unsplash.com/photo-1539437829697-1b4ed5aebd19?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1499363536502-87642509e31b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1533575770077-052fa2c609fc?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000031', 'Lisbon Houseboat', 'lisbon-houseboat',
 'A sun-bleached houseboat moored on the Tagus River. Ride vintage trams to fado houses, eat pastéis de nata warm from the oven, and watch ships pass at sunset.',
 'Lisbon, Portugal', 'PT', 24000, 5500, 3000, 4, 'houseboat', 'culture', 'family',
 ARRAY['wifi', 'kitchen', 'bikes', 'library', 'hammock'],
 ARRAY['https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop']),

-- DISCONNECT (12)
('a0000000-0000-0000-0000-000000000009', 'Forest Cabin', 'forest-cabin',
 'A rustic off-grid cabin deep in old-growth forest. No Wi-Fi, no distractions — just the sound of wind through ancient trees and a crackling woodstove.',
 'Olympic Peninsula, Washington', 'US', 12000, 3500, 1500, 2, 'cabin', 'disconnect', 'solo',
 ARRAY['fireplace', 'library', 'hammock', 'hiking-trails'],
 ARRAY['https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000010', 'Desert Yurt', 'desert-yurt',
 'A minimalist yurt surrounded by red rock formations and endless desert sky. Fall asleep under a blanket of stars visible only in the darkest places on Earth.',
 'Sedona, Arizona', 'US', 16500, 4000, 2000, 3, 'yurt', 'disconnect', 'duo',
 ARRAY['stargazing-deck', 'yoga-mat', 'outdoor-shower', 'firepit', 'hammock'],
 ARRAY['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1533632359083-0185df1be8d4?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000011', 'Island Glamping', 'island-glamping',
 'Barefoot luxury on a private island. Your safari tent sits on white sand, steps from turquoise waters. Kayak to nearby coves or simply do nothing at all.',
 'San Juan Islands, Washington', 'US', 38000, 8000, 4000, 6, 'glamping', 'disconnect', 'family',
 ARRAY['kayaks', 'outdoor-shower', 'hammock', 'bbq', 'bikes', 'stargazing-deck'],
 ARRAY['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000012', 'Lakeside Treehouse', 'lakeside-treehouse',
 'A secluded treehouse overlooking a mirror-still alpine lake. Paddle out at dawn, read by the fire at dusk, and let the silence restore your soul.',
 'Lake Placid, New York', 'US', 21000, 5500, 2500, 4, 'treehouse', 'disconnect', 'group',
 ARRAY['kayaks', 'fireplace', 'library', 'hammock', 'sauna', 'outdoor-shower'],
 ARRAY['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000032', 'Meadow Yurt', 'meadow-yurt',
 'A hand-built yurt in an alpine meadow accessible only by foot trail. Wildflowers in every direction, no cell signal, and a sky so clear you can see the Milky Way arm.',
 'Telluride, Colorado', 'US', 13500, 3500, 1500, 2, 'yurt', 'disconnect', 'solo',
 ARRAY['yoga-mat', 'hammock', 'hiking-trails', 'stargazing-deck', 'firepit'],
 ARRAY['https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1533632359083-0185df1be8d4?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000033', 'Bog Cabin', 'bog-cabin',
 'A peat-roofed cabin on a misty Irish bog. No electricity, no running water — just peat fires, candlelight, and the haunting silence of the moor.',
 'Connemara, Ireland', 'IE', 9500, 2500, 1000, 2, 'cabin', 'disconnect', 'duo',
 ARRAY['fireplace', 'library', 'hiking-trails', 'hammock'],
 ARRAY['https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000034', 'Savanna Glamping', 'savanna-glamping',
 'Solar-powered safari tents on an East African savanna. Watch elephants from your veranda, dine under acacia trees, and fall asleep to distant lion calls.',
 'Maasai Mara, Kenya', 'KE', 52000, 10000, 5000, 4, 'glamping', 'disconnect', 'family',
 ARRAY['outdoor-shower', 'binoculars', 'hammock', 'stargazing-deck', 'yoga-mat'],
 ARRAY['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000035', 'River Treehouse', 'river-treehouse',
 'A treehouse on stilts above a lazy jungle river. No roads, no neighbors — arrive by canoe, fish for dinner, and let the current carry your worries away.',
 'Tortuguero, Costa Rica', 'CR', 15500, 4000, 2000, 3, 'treehouse', 'disconnect', 'duo',
 ARRAY['kayaks', 'hammock', 'outdoor-shower', 'binoculars', 'hiking-trails'],
 ARRAY['https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000036', 'Steppe Yurt', 'steppe-yurt',
 'A traditional felt yurt on the Mongolian steppe. Ride horses to the horizon, drink airag with nomad families, and sleep under the biggest sky on Earth.',
 'Ulaanbaatar, Mongolia', 'MN', 8500, 2000, 1000, 6, 'yurt', 'disconnect', 'group',
 ARRAY['firepit', 'stargazing-deck', 'hiking-trails', 'hammock'],
 ARRAY['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1533632359083-0185df1be8d4?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000037', 'Snowfield Cabin', 'snowfield-cabin',
 'A tiny cabin buried in snow at the edge of a frozen lake. Ski to your door, ice fish through a hole in the floor, and warm up with whisky by the stove.',
 'Yellowknife, Canada', 'CA', 11000, 3000, 1500, 2, 'cabin', 'disconnect', 'solo',
 ARRAY['fireplace', 'snowshoes', 'sauna', 'library', 'stargazing-deck'],
 ARRAY['https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000038', 'Reef Houseboat', 'reef-houseboat',
 'A solar-powered houseboat anchored off a coral reef. Snorkel straight from the swim platform, eat fresh-caught fish, and let the gentle rocking lull you to sleep.',
 'Whitsundays, Australia', 'AU', 44000, 9000, 4500, 4, 'houseboat', 'disconnect', 'family',
 ARRAY['kayaks', 'outdoor-shower', 'bbq', 'stargazing-deck', 'hammock', 'binoculars'],
 ARRAY['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000039', 'Highland Glamping', 'highland-glamping',
 'Canvas bell tents on a remote Scottish highland. Walk through heather-covered hills, swim in ice-cold lochs, and drink single malt by the campfire.',
 'Isle of Skye, Scotland', 'GB', 16000, 4000, 2000, 6, 'glamping', 'disconnect', 'group',
 ARRAY['firepit', 'hiking-trails', 'outdoor-shower', 'hammock', 'library', 'bbq'],
 ARRAY['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop']),

-- CELEBRATION (9)
('a0000000-0000-0000-0000-000000000013', 'Vineyard Houseboat', 'vineyard-houseboat',
 'A stunning houseboat docked along wine country canals. Host tastings on the sundeck, explore cellar doors by bike, and toast to life on the water.',
 'Napa Valley, California', 'US', 45000, 8000, 4000, 8, 'houseboat', 'celebration', 'group',
 ARRAY['kitchen', 'wifi', 'bikes', 'bbq', 'hot-tub', 'firepit'],
 ARRAY['https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1474073705867-a57dbf30d27f?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000014', 'Mountain Lodge Cabin', 'mountain-lodge-cabin',
 'A grand timber-frame cabin with cathedral ceilings and panoramic mountain views. Room for the whole family with a chef kitchen and game room.',
 'Jackson Hole, Wyoming', 'US', 42000, 7500, 3500, 8, 'cabin', 'celebration', 'family',
 ARRAY['fireplace', 'hot-tub', 'kitchen', 'wifi', 'sauna', 'bbq', 'library', 'bikes'],
 ARRAY['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000015', 'Garden Yurt', 'garden-yurt',
 'An enchanting yurt surrounded by lavender fields and rose gardens. Perfect for an intimate celebration with craft cocktails under fairy lights.',
 'Sonoma, California', 'US', 27500, 5500, 3000, 4, 'yurt', 'celebration', 'duo',
 ARRAY['hot-tub', 'outdoor-shower', 'hammock', 'firepit', 'yoga-mat', 'bbq'],
 ARRAY['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000040', 'Chateau Treehouse', 'chateau-treehouse',
 'A grand treehouse on a French château estate. Host champagne toasts on the wraparound deck overlooking manicured gardens and a private lake.',
 'Loire Valley, France', 'FR', 55000, 10000, 5000, 6, 'treehouse', 'celebration', 'group',
 ARRAY['kitchen', 'wifi', 'library', 'bikes', 'hot-tub', 'bbq', 'fireplace'],
 ARRAY['https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000041', 'Harbor Houseboat', 'harbor-houseboat',
 'A luxury houseboat in Sydney Harbor with Opera House views. Throw an unforgettable party on the water with the city skyline as your backdrop.',
 'Sydney, Australia', 'AU', 62000, 12000, 6000, 8, 'houseboat', 'celebration', 'group',
 ARRAY['kitchen', 'wifi', 'hot-tub', 'bbq', 'bikes', 'firepit'],
 ARRAY['https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000042', 'Aspen Cabin', 'aspen-cabin',
 'A designer cabin surrounded by golden aspen groves. Huge windows, a chef kitchen, and a wraparound hot tub make this the ultimate birthday or anniversary retreat.',
 'Aspen, Colorado', 'US', 48000, 8500, 4000, 6, 'cabin', 'celebration', 'family',
 ARRAY['fireplace', 'hot-tub', 'kitchen', 'wifi', 'sauna', 'library', 'snowshoes', 'bbq'],
 ARRAY['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000043', 'Rose Glamping', 'rose-glamping',
 'Safari tents in a sprawling rose garden estate. String lights, outdoor bathtubs, and a wood-fired pizza oven make every evening feel like a celebration.',
 'Santa Barbara, California', 'US', 33000, 6500, 3500, 8, 'glamping', 'celebration', 'group',
 ARRAY['hot-tub', 'outdoor-shower', 'bbq', 'firepit', 'wifi', 'kitchen', 'hammock'],
 ARRAY['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000044', 'Summit Yurt', 'summit-yurt',
 'A luxury yurt at 10,000 feet with 360-degree mountain views. Arrive by helicopter, toast with champagne, and celebrate milestones above the clouds.',
 'Telluride, Colorado', 'US', 39000, 7000, 3500, 4, 'yurt', 'celebration', 'duo',
 ARRAY['hot-tub', 'stargazing-deck', 'firepit', 'yoga-mat', 'kitchen', 'wifi'],
 ARRAY['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop']),

('a0000000-0000-0000-0000-000000000045', 'Orchard Cabin', 'orchard-cabin',
 'A renovated barn cabin in a cherry orchard. Host farm-to-table dinners, press your own cider, and celebrate surrounded by blossoms in spring.',
 'Hood River, Oregon', 'US', 25000, 5500, 3000, 6, 'cabin', 'celebration', 'family',
 ARRAY['kitchen', 'wifi', 'bbq', 'fireplace', 'bikes', 'hammock', 'hot-tub'],
 ARRAY['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1467803738586-46b7eb7b16a1?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&h=600&fit=crop']);

-- ============================================================
-- COLLECTIONS (15)
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
 'Gather your favorite people in extraordinary places. Room for everyone, with settings worthy of the occasion.'),
('c0000000-0000-0000-0000-000000000006', 'Treehouse Dreams', 'treehouse-dreams',
 'Life is better in the canopy. From alpine perches to jungle platforms, these treehouses redefine sleeping among the trees.'),
('c0000000-0000-0000-0000-000000000007', 'Waterfront Living', 'waterfront-living',
 'Wake up to the sound of water. Houseboats, lakeside retreats, and coastal escapes where the view is always blue.'),
('c0000000-0000-0000-0000-000000000008', 'Solo Sanctuaries', 'solo-sanctuaries',
 'Designed for one. Quiet spaces for reflection, creativity, and the luxury of your own company.'),
('c0000000-0000-0000-0000-000000000009', 'Group Getaways', 'group-getaways',
 'Room for the whole crew. These stays bring everyone together with space, activities, and communal vibes.'),
('c0000000-0000-0000-0000-000000000010', 'Under the Stars', 'under-the-stars',
 'Stargazing from bed. These stays offer the darkest skies and the best decks for watching the cosmos unfold.'),
('c0000000-0000-0000-0000-000000000011', 'Winter Warmers', 'winter-warmers',
 'Fireplaces, hot tubs, and snow-covered views. These stays make cold weather feel like a gift.'),
('c0000000-0000-0000-0000-000000000012', 'International Escapes', 'international-escapes',
 'Beyond borders. Unique stays in far-flung destinations that make the journey part of the adventure.'),
('c0000000-0000-0000-0000-000000000013', 'Budget-Friendly Finds', 'budget-friendly-finds',
 'Incredible stays that do not break the bank. Proof that unforgettable does not have to mean unaffordable.'),
('c0000000-0000-0000-0000-000000000014', 'Luxury Splurges', 'luxury-splurges',
 'Go all out. Premium stays with top-tier amenities, stunning locations, and service worth every penny.'),
('c0000000-0000-0000-0000-000000000015', 'Pet-Friendly Picks', 'pet-friendly-picks',
 'Bring your best friend. Outdoor space, nature trails, and stays that welcome the whole pack.');

-- ============================================================
-- COLLECTION_STAYS (junction rows)
-- ============================================================
INSERT INTO collection_stays (collection_id, stay_id, position) VALUES
-- Weekend Escapes: Summit Treehouse, Forest Cabin, Garden Yurt, Meadow Yurt, Bog Cabin
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 0),
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000009', 1),
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000015', 2),
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000032', 3),
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000033', 4),
-- Romantic Getaways: Glacier Cabin, Desert Yurt, Soho Houseboat, Fjord Yurt, Istanbul Yurt, Garden Yurt
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 0),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000010', 1),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', 2),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000020', 3),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000030', 4),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000015', 5),
-- Family Adventures: Cliff Yurt, Tuscany Treehouse, Island Glamping, Rainforest Cabin, Tundra Cabin, Lisbon Houseboat
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000004', 0),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000008', 1),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000011', 2),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000019', 3),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000023', 4),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000031', 5),
-- Off-Grid Retreats: Forest Cabin, Desert Yurt, Lakeside Treehouse, Bog Cabin, Snowfield Cabin, Steppe Yurt
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000009', 0),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000010', 1),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000012', 2),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000033', 3),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000037', 4),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000036', 5),
-- Celebration Spots: Vineyard Houseboat, Mountain Lodge Cabin, Garden Yurt, Chateau Treehouse, Harbor Houseboat, Rose Glamping
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000013', 0),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000014', 1),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000015', 2),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000040', 3),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000041', 4),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000043', 5),
-- Treehouse Dreams: Summit Treehouse, Tuscany Treehouse, Lakeside Treehouse, Alpine Treehouse, Waterfall Treehouse, Bali Treehouse, Chateau Treehouse
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 0),
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000008', 1),
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000012', 2),
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000018', 3),
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000022', 4),
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000027', 5),
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000040', 6),
-- Waterfront Living: Soho Houseboat, Canyon Houseboat, Havana Houseboat, Lisbon Houseboat, Vineyard Houseboat, Harbor Houseboat, Reef Houseboat
('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000005', 0),
('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000017', 1),
('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000024', 2),
('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000031', 3),
('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000013', 4),
('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000041', 5),
('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000038', 6),
-- Solo Sanctuaries: Summit Treehouse, Kyoto Cabin, Forest Cabin, Athens Yurt, Bali Treehouse, Meadow Yurt, Snowfield Cabin, Waterfall Treehouse
('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 0),
('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000006', 1),
('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000009', 2),
('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000025', 3),
('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000027', 4),
('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000032', 5),
('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000037', 6),
('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000022', 7),
-- Group Getaways: Rapids Glamping, Marrakech Glamping, Canyon Houseboat, Buenos Aires Glamping, Dune Glamping, Steppe Yurt, Highland Glamping, Rose Glamping
('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000003', 0),
('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000007', 1),
('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000017', 2),
('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000026', 3),
('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000021', 4),
('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000036', 5),
('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000039', 6),
('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000043', 7),
-- Under the Stars: Desert Yurt, Meadow Yurt, Dune Glamping, Volcano Glamping, Fjord Yurt, Summit Yurt
('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000010', 0),
('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000032', 1),
('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000021', 2),
('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000016', 3),
('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000020', 4),
('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000044', 5),
-- Winter Warmers: Glacier Cabin, Tundra Cabin, Snowfield Cabin, Mountain Lodge Cabin, Aspen Cabin, Fjord Yurt
('c0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000002', 0),
('c0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000023', 1),
('c0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000037', 2),
('c0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000014', 3),
('c0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000042', 4),
('c0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000020', 5),
-- International Escapes: Kyoto Cabin, Marrakech Glamping, Tuscany Treehouse, Havana Houseboat, Athens Yurt, Buenos Aires Glamping, Bali Treehouse, Prague Cabin, Istanbul Yurt, Lisbon Houseboat
('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000006', 0),
('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000007', 1),
('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000008', 2),
('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000024', 3),
('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000025', 4),
('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000026', 5),
('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000027', 6),
('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000028', 7),
('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000030', 8),
('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000031', 9),
-- Budget-Friendly Finds: Steppe Yurt, Bog Cabin, Forest Cabin, Oaxaca Glamping, Rainforest Cabin, Bali Treehouse, Dune Glamping
('c0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000036', 0),
('c0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000033', 1),
('c0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000009', 2),
('c0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000029', 3),
('c0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000019', 4),
('c0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000027', 5),
('c0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000021', 6),
-- Luxury Splurges: Harbor Houseboat, Chateau Treehouse, Savanna Glamping, Aspen Cabin, Vineyard Houseboat, Reef Houseboat, Alpine Treehouse
('c0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000041', 0),
('c0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000040', 1),
('c0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000034', 2),
('c0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000042', 3),
('c0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000013', 4),
('c0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000038', 5),
('c0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000018', 6),
-- Pet-Friendly Picks: Forest Cabin, Rainforest Cabin, Highland Glamping, Orchard Cabin, Rapids Glamping, Island Glamping
('c0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000009', 0),
('c0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000019', 1),
('c0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000039', 2),
('c0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000045', 3),
('c0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000003', 4),
('c0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000011', 5);

-- ============================================================
-- FAKE USERS for seed reviews (profiles only, no auth.users needed with replica mode)
-- ============================================================
INSERT INTO profiles (id, email, full_name) VALUES
('b0000000-0000-0000-0000-000000000001', 'alex.chen@example.com', 'Alex Chen'),
('b0000000-0000-0000-0000-000000000002', 'maria.garcia@example.com', 'Maria Garcia'),
('b0000000-0000-0000-0000-000000000003', 'sam.johnson@example.com', 'Sam Johnson'),
('b0000000-0000-0000-0000-000000000004', 'emma.wilson@example.com', 'Emma Wilson'),
('b0000000-0000-0000-0000-000000000005', 'james.taylor@example.com', 'James Taylor'),
('b0000000-0000-0000-0000-000000000006', 'sofia.andersson@example.com', 'Sofia Andersson'),
('b0000000-0000-0000-0000-000000000007', 'kenji.tanaka@example.com', 'Kenji Tanaka'),
('b0000000-0000-0000-0000-000000000008', 'priya.patel@example.com', 'Priya Patel'),
('b0000000-0000-0000-0000-000000000009', 'lucas.dubois@example.com', 'Lucas Dubois'),
('b0000000-0000-0000-0000-000000000010', 'amara.okafor@example.com', 'Amara Okafor'),
('b0000000-0000-0000-0000-000000000011', 'diego.morales@example.com', 'Diego Morales'),
('b0000000-0000-0000-0000-000000000012', 'nina.kowalski@example.com', 'Nina Kowalski'),
('b0000000-0000-0000-0000-000000000013', 'omar.hassan@example.com', 'Omar Hassan'),
('b0000000-0000-0000-0000-000000000014', 'chloe.martin@example.com', 'Chloe Martin'),
('b0000000-0000-0000-0000-000000000015', 'raj.sharma@example.com', 'Raj Sharma');

-- ============================================================
-- REVIEWS (60 across all stays)
-- ============================================================
INSERT INTO reviews (stay_id, user_id, rating, comment) VALUES
-- Summit Treehouse (3 reviews)
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 5, 'Absolutely magical. Waking up above the clouds was a once-in-a-lifetime experience.'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 4, 'Stunning views and very peaceful. The rope bridge was a fun touch, though a bit wobbly.'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 5, 'Best treehouse I have ever stayed in. Already planning my return trip.'),

-- Glacier Cabin (2 reviews)
('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 5, 'The hot tub under the stars was unforgettable. Cabin was spotless and incredibly warm.'),
('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 4, 'Beautiful location. The fireplace made every evening special.'),

-- Rapids Glamping (2 reviews)
('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000006', 5, 'Best group trip we have ever done. The rafting was incredible and the tents were surprisingly luxurious.'),
('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000007', 4, 'Great for our friend group reunion. Fire pit evenings were the highlight.'),

-- Cliff Yurt (2 reviews)
('a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000008', 5, 'Watched whales breach from our bed. The kids could not stop talking about it for weeks.'),
('a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000009', 4, 'Dramatic location and well-equipped kitchen. Wind can be intense but that is part of the charm.'),

-- Soho Houseboat (2 reviews)
('a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 4, 'Such a unique way to experience London. Loved the library nook on deck.'),
('a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 3, 'Cool concept but a bit cramped for two people. Great location though.'),

-- Kyoto Cabin (2 reviews)
('a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000003', 5, 'Pure serenity. The bamboo forest walks at dawn were the highlight of our Japan trip.'),
('a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000004', 5, 'Minimalist perfection. The private onsen was heavenly.'),

-- Marrakech Glamping (2 reviews)
('a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000010', 4, 'The Berber tents were gorgeous. Mint tea at sunset with the medina in the distance was dreamy.'),
('a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000011', 5, 'Incredible cultural immersion. Our group of eight fit perfectly and the food was phenomenal.'),

-- Tuscany Treehouse (2 reviews)
('a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000012', 5, 'The cooking class alone was worth the trip. Waking up among olive groves felt like a painting.'),
('a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000013', 4, 'Romantic and charming. The vineyard bike rides were a family favorite.'),

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

-- Lakeside Treehouse (2 reviews)
('a0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000014', 5, 'The lake was glass-still at dawn. Paddled out in perfect silence — absolutely healing.'),
('a0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000006', 4, 'Great for our group of four. The sauna after a cold lake swim was perfection.'),

-- Vineyard Houseboat (2 reviews)
('a0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000005', 5, 'Hosted my birthday here — the sundeck wine tastings were a dream come true.'),
('a0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000002', 4, 'Amazing for a group celebration. The hot tub on the boat is a nice touch.'),

-- Mountain Lodge Cabin (2 reviews)
('a0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000004', 5, 'Our whole family fit comfortably. The game room kept the kids entertained for hours.'),
('a0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000015', 4, 'Grand cabin with incredible mountain views. The sauna was a highlight after hiking.'),

-- Garden Yurt (2 reviews)
('a0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000001', 4, 'The lavender fields at sunset were breathtaking. Very romantic and intimate.'),
('a0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000009', 5, 'We celebrated our anniversary here. The fairy lights and craft cocktails were perfect.'),

-- Volcano Glamping (2 reviews)
('a0000000-0000-0000-0000-000000000016', 'b0000000-0000-0000-0000-000000000007', 5, 'Hiking the lava fields was surreal. The geothermal hot springs at sunset were unforgettable.'),
('a0000000-0000-0000-0000-000000000016', 'b0000000-0000-0000-0000-000000000010', 4, 'Unique experience you cannot get anywhere else. The rumbling earth at night is wild.'),

-- Canyon Houseboat (1 review)
('a0000000-0000-0000-0000-000000000017', 'b0000000-0000-0000-0000-000000000011', 5, 'Cliff jumping into turquoise water from our houseboat — best day of my life.'),

-- Alpine Treehouse (1 review)
('a0000000-0000-0000-0000-000000000018', 'b0000000-0000-0000-0000-000000000012', 5, 'The suspension bridge approach alone makes this worth it. Views are unreal.'),

-- Rainforest Cabin (2 reviews)
('a0000000-0000-0000-0000-000000000019', 'b0000000-0000-0000-0000-000000000013', 4, 'Woke up to toucans on the railing. The waterfall hike before breakfast became our daily ritual.'),
('a0000000-0000-0000-0000-000000000019', 'b0000000-0000-0000-0000-000000000008', 5, 'Our kids learned so much about wildlife. The natural pools were a huge hit.'),

-- Fjord Yurt (1 review)
('a0000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000014', 5, 'Northern lights from the stargazing deck. Literally could not believe my eyes.'),

-- Dune Glamping (1 review)
('a0000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000015', 4, 'Camel rides at sunset and feasting under the stars. Felt like another planet.'),

-- Waterfall Treehouse (1 review)
('a0000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000006', 5, 'The sound of the waterfall is the best white noise machine ever invented.'),

-- Tundra Cabin (1 review)
('a0000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000007', 4, 'Dog sledding was a dream come true. The cabin sauna was essential after sub-zero days.'),

-- Havana Houseboat (1 review)
('a0000000-0000-0000-0000-000000000024', 'b0000000-0000-0000-0000-000000000010', 4, 'Dancing salsa on the dock as the sun set over the Malecón. Pure magic.'),

-- Athens Yurt (1 review)
('a0000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000011', 5, 'Sipping wine with the Parthenon lit up above us. Best solo trip I have ever taken.'),

-- Buenos Aires Glamping (1 review)
('a0000000-0000-0000-0000-000000000026', 'b0000000-0000-0000-0000-000000000012', 4, 'The asado was incredible. Learning tango from locals was an unexpected highlight.'),

-- Bali Treehouse (2 reviews)
('a0000000-0000-0000-0000-000000000027', 'b0000000-0000-0000-0000-000000000013', 5, 'Yoga among rice terraces at sunrise. This place changed my perspective on everything.'),
('a0000000-0000-0000-0000-000000000027', 'b0000000-0000-0000-0000-000000000009', 4, 'Beautiful bamboo architecture and the organic food was outstanding.'),

-- Prague Cabin (1 review)
('a0000000-0000-0000-0000-000000000028', 'b0000000-0000-0000-0000-000000000014', 4, 'Walking to jazz clubs and centuries-old beer halls from our cabin on the river. Dreamy.'),

-- Oaxaca Glamping (1 review)
('a0000000-0000-0000-0000-000000000029', 'b0000000-0000-0000-0000-000000000015', 5, 'The mezcal distillery visit and pottery workshop were life-changing. Real cultural depth.'),

-- Istanbul Yurt (1 review)
('a0000000-0000-0000-0000-000000000030', 'b0000000-0000-0000-0000-000000000008', 4, 'Turkish coffee on kilim cushions steps from the Grand Bazaar. Romantic and authentic.'),

-- Lisbon Houseboat (1 review)
('a0000000-0000-0000-0000-000000000031', 'b0000000-0000-0000-0000-000000000001', 5, 'Watching ships pass on the Tagus at sunset while eating warm pastéis de nata. Heaven.'),

-- Meadow Yurt (1 review)
('a0000000-0000-0000-0000-000000000032', 'b0000000-0000-0000-0000-000000000003', 5, 'No cell signal, no noise — just wildflowers and the Milky Way. Exactly what my soul needed.'),

-- Bog Cabin (1 review)
('a0000000-0000-0000-0000-000000000033', 'b0000000-0000-0000-0000-000000000005', 4, 'Peat fires and candlelight with rain on the roof. Stripped-back and deeply peaceful.'),

-- Savanna Glamping (1 review)
('a0000000-0000-0000-0000-000000000034', 'b0000000-0000-0000-0000-000000000010', 5, 'Watched elephants walk past our tent at breakfast. No words can describe this place.'),

-- River Treehouse (1 review)
('a0000000-0000-0000-0000-000000000035', 'b0000000-0000-0000-0000-000000000011', 4, 'Arriving by canoe set the tone perfectly. Caught our own dinner from the deck.'),

-- Chateau Treehouse (1 review)
('a0000000-0000-0000-0000-000000000040', 'b0000000-0000-0000-0000-000000000009', 5, 'Champagne toasts overlooking the château gardens. Our anniversary could not have been more perfect.'),

-- Harbor Houseboat (1 review)
('a0000000-0000-0000-0000-000000000041', 'b0000000-0000-0000-0000-000000000012', 5, 'Threw a party with the Opera House as our backdrop. Absolutely next level.'),

-- Aspen Cabin (1 review)
('a0000000-0000-0000-0000-000000000042', 'b0000000-0000-0000-0000-000000000004', 5, 'The golden aspen trees in fall were breathtaking. Hot tub and chef kitchen were top notch.'),

-- Rose Glamping (1 review)
('a0000000-0000-0000-0000-000000000043', 'b0000000-0000-0000-0000-000000000002', 4, 'String lights and outdoor bathtubs in a rose garden. Every evening felt like a movie.'),

-- Summit Yurt (1 review)
('a0000000-0000-0000-0000-000000000044', 'b0000000-0000-0000-0000-000000000015', 5, 'Arrived by helicopter and popped champagne at 10,000 feet. Bucket list checked.'),

-- Orchard Cabin (1 review)
('a0000000-0000-0000-0000-000000000045', 'b0000000-0000-0000-0000-000000000006', 4, 'Pressing our own cider surrounded by cherry blossoms. The farm-to-table dinner was superb.');

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
('a0000000-0000-0000-0000-000000000009', '2026-04-05', '2026-04-08', 'manual_block'),
-- Volcano Glamping: volcanic activity
('a0000000-0000-0000-0000-000000000016', '2026-05-10', '2026-05-20', 'manual_block'),
-- Alpine Treehouse: winter closure
('a0000000-0000-0000-0000-000000000018', '2026-04-01', '2026-04-10', 'manual_block'),
-- Savanna Glamping: rainy season
('a0000000-0000-0000-0000-000000000034', '2026-04-15', '2026-05-15', 'manual_block'),
-- Fjord Yurt: owner personal use
('a0000000-0000-0000-0000-000000000020', '2026-06-01', '2026-06-10', 'manual_block'),
-- Harbor Houseboat: maintenance
('a0000000-0000-0000-0000-000000000041', '2026-04-25', '2026-04-30', 'manual_block'),
-- Chateau Treehouse: private event
('a0000000-0000-0000-0000-000000000040', '2026-05-15', '2026-05-20', 'manual_block'),
-- Steppe Yurt: seasonal closure
('a0000000-0000-0000-0000-000000000036', '2026-04-01', '2026-04-15', 'manual_block'),
-- Reef Houseboat: cyclone season
('a0000000-0000-0000-0000-000000000038', '2026-04-01', '2026-04-20', 'manual_block');

-- Restore normal FK constraints and triggers
SET session_replication_role = 'origin';
