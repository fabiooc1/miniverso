-- Migração de dados (sem alteração de schema): os campos de imagem das seções
-- passam a aceitar imagem ou vídeo.
--   hero.image / experience.image  ->  media: { "type": "image", "image": <imagem> }
--   projects.items[].image          ->  items[].media (mesmo formato)
--   hero.imageCaption               ->  hero.mediaCaption

UPDATE "Section"
SET "content" = ("content" - 'image')
  || jsonb_build_object('media', jsonb_build_object('type', 'image', 'image', "content"->'image'))
WHERE "key" IN ('hero', 'experience') AND "content" ? 'image';

UPDATE "Section"
SET "content" = ("content" - 'imageCaption')
  || jsonb_build_object('mediaCaption', "content"->'imageCaption')
WHERE "key" = 'hero' AND "content" ? 'imageCaption';

UPDATE "Section"
SET "content" = jsonb_set(
  "content",
  '{items}',
  (
    SELECT COALESCE(
      jsonb_agg(
        CASE
          WHEN item ? 'image' THEN (item - 'image')
            || jsonb_build_object('media', jsonb_build_object('type', 'image', 'image', item->'image'))
          ELSE item
        END
        ORDER BY position
      ),
      '[]'::jsonb
    )
    FROM jsonb_array_elements("content"->'items') WITH ORDINALITY AS items(item, position)
  )
)
WHERE "key" = 'projects' AND jsonb_typeof("content"->'items') = 'array';
