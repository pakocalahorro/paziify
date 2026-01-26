-- Insert 3 initial Spanish audiobooks
-- Execute this AFTER uploading the MP3s to Supabase Storage
-- Replace [TU-PROJECT-ID] with your actual Supabase project ID

INSERT INTO audiobooks (
    title,
    author,
    narrator,
    description,
    category,
    tags,
    audio_url,
    duration_minutes,
    source,
    librivox_id,
    language,
    is_premium,
    is_featured
) VALUES

-- 1. Manual de Vida - Epicteto
(
    'Manual de Vida',
    'Epicteto',
    'Aubiblio Narraciones',
    'Guía práctica de filosofía estoica para vivir con tranquilidad y sabiduría. Enseñanzas sobre lo que está en nuestro control y cómo alcanzar la paz interior.',
    'growth',
    ARRAY['estoicismo', 'filosofía', 'práctica', 'serenidad', 'autodominio'],
    'https://[TU-PROJECT-ID].supabase.co/storage/v1/object/public/audiobooks/growth/manual-de-vida-epicteto.mp3',
    60,
    'youtube',
    'manual-de-vida-epicteto',
    'es',
    false,
    true
),

-- 2. Confianza en Uno Mismo - Ralph Waldo Emerson
(
    'Confianza en Uno Mismo',
    'Ralph Waldo Emerson',
    'Narrador Profesional',
    'Ensayo sobre la importancia de confiar en uno mismo y ser auténtico. Una guía para desarrollar la autoconfianza y vivir según tus propios valores.',
    'professional',
    ARRAY['confianza', 'autenticidad', 'autoestima', 'desarrollo', 'individualidad'],
    'https://[TU-PROJECT-ID].supabase.co/storage/v1/object/public/audiobooks/growth/confianza-en-uno-mismo-emerson.mp3',
    60,
    'youtube',
    'confianza-en-uno-mismo-emerson',
    'es',
    false,
    true
),

-- 3. De la Brevedad de la Vida - Séneca
(
    'De la Brevedad de la Vida',
    'Lucio Anneo Séneca',
    'Aubiblio Narraciones',
    'Reflexión profunda sobre el uso del tiempo y cómo vivir plenamente. Séneca nos enseña que la vida no es corta, sino que la desperdiciamos.',
    'growth',
    ARRAY['estoicismo', 'tiempo', 'vida', 'sabiduría', 'propósito'],
    'https://[TU-PROJECT-ID].supabase.co/storage/v1/object/public/audiobooks/growth/brevedad-de-la-vida-seneca.mp3',
    90,
    'youtube',
    'brevedad-de-la-vida-seneca',
    'es',
    false,
    true
);

-- Verify insertion
SELECT 
    title,
    author,
    category,
    duration_minutes,
    is_featured,
    language
FROM audiobooks
WHERE language = 'es'
ORDER BY is_featured DESC, title;
