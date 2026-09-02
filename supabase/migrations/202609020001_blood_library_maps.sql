alter table public.expedition_maps
  add column area_number smallint check (area_number between 1 and 99),
  add column view_name text;

-- This is a deliberate reset of the disposable first-playtest board. Deleting
-- the old maps also cascades any markers placed on them.
delete from public.expedition_maps
where expedition_id = '00000000-0000-4000-8000-000000000101';

update public.expeditions
set name = 'Blood Library'
where id = '00000000-0000-4000-8000-000000000101';

insert into public.expedition_maps (id, expedition_id, room_number, area_number, view_name, name, image_path) values
  ('00000000-0000-4000-8000-000000000121', '00000000-0000-4000-8000-000000000101', 1, 1, null, 'Entrance', '/maps/blood-library/01-entrance.jpg'),
  ('00000000-0000-4000-8000-000000000122', '00000000-0000-4000-8000-000000000101', 2, 2, 'Ground', 'Library', '/maps/blood-library/02-library-ground.jpg'),
  ('00000000-0000-4000-8000-000000000123', '00000000-0000-4000-8000-000000000101', 3, 2, 'Balcony', 'Library', '/maps/blood-library/03-library-balcony.jpg'),
  ('00000000-0000-4000-8000-000000000124', '00000000-0000-4000-8000-000000000101', 4, 3, 'Lower', 'Prison Crystal', '/maps/blood-library/04-prison-crystal-lower.jpg'),
  ('00000000-0000-4000-8000-000000000125', '00000000-0000-4000-8000-000000000101', 5, 3, 'Upper', 'Prison Crystal', '/maps/blood-library/04-prison-crystal-upper.jpg'),
  ('00000000-0000-4000-8000-000000000126', '00000000-0000-4000-8000-000000000101', 6, 4, null, 'Laboratory', '/maps/blood-library/05-laboratory.jpg'),
  ('00000000-0000-4000-8000-000000000127', '00000000-0000-4000-8000-000000000101', 7, 5, null, 'Private Quarters', '/maps/blood-library/06-private-quarters.jpg'),
  ('00000000-0000-4000-8000-000000000128', '00000000-0000-4000-8000-000000000101', 8, 6, null, 'Forbidden Books', '/maps/blood-library/07-forbidden-books.jpg'),
  ('00000000-0000-4000-8000-000000000129', '00000000-0000-4000-8000-000000000101', 9, 7, null, 'Museum', '/maps/blood-library/08-museum.jpg'),
  ('00000000-0000-4000-8000-000000000130', '00000000-0000-4000-8000-000000000101', 10, 8, null, 'The Road', '/maps/blood-library/road.webp');

alter table public.expedition_maps
  alter column area_number set not null;
