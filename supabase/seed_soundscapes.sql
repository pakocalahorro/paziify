-- Populate soundscapes from local data
-- This can be run in the Supabase SQL Editor

INSERT INTO soundscapes (id, slug, name, description, audio_url, image_url, icon, color, recommended_for)
VALUES 
('forest_meditation', 'forest_meditation', 'Bosque Profundo', 'Atmósfera natural y tranquila', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/soundscapes/forest_meditation.mp3', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/forest-sunrise.webp', 'leaf', '#4A6741', ARRAY['mindfulness', 'mañana']),
('atlantic_loop', 'atlantic_loop', 'Océano Atlántico', 'Olas constantes del océano', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/soundscapes/atlantic_loop.mp3', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/ocean-calm.webp', 'water', '#1A1A2E', ARRAY['sueño', 'noche']),
('bird_relaxation', 'bird_relaxation', 'Jardín de Aves', 'Canto de pájaros y naturaleza', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/soundscapes/bird_relaxtion.mp3', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/nature-birds.webp', 'rainy', '#4A90E2', ARRAY['sueño', 'ansiedad', 'foco']),
('deep_meditative', 'deep_meditative', 'Estado Profundo', 'Pad ambiental profundo', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/soundscapes/deep_meditative_state.mp3', 'https://ueuxjtyottluwkvdreqe.supabase.co/storage/v1/object/public/meditation-thumbnails/deep-focus.webp', 'water', '#2DD4BF', ARRAY['relajación', 'meditación'])
ON CONFLICT (slug) DO UPDATE SET
  audio_url = EXCLUDED.audio_url,
  image_url = EXCLUDED.image_url;
