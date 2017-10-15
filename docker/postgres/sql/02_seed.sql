INSERT INTO star_type (name, description, mass, max_radius, luminosity, habitable_zone_center, habitable_zone_width)
VALUES ('White Dwarf', '', 50, 500, 1, 250, 100),
('Red Dwarf', '', 70, 600, 1, 300, 100),
('Orange', '', 100, 1000, 2, 500, 100),
('Yellow', '', 100, 1000, 3, 500, 100),
('Yellow-White', '', 110, 1000, 4, 500, 100),
('White', '', 130, 1500, 5, 750, 100),
('Blue-White', '', 150, 2000, 5, 1000, 100),
('Blue', '', 170, 2000, 5, 1000, 100);

INSERT INTO systems (name, description, star_type, coord_x, coord_y)
VALUES ('Sol', 'Terran home system', 3, 0, 0),
('Alpha Centauri', 'First colonized', 3, 10, 10);

INSERT INTO sectors (coord_x, coord_y, system_id)
VALUES (1, 1, 1);

INSERT INTO planets (name, description, mass, population, temperature, atmosphere, system_id, sector_id)
VALUES ('Earth', 'Terran homeworld', 1.0, 10000000000, 25, 'nitrogen-oxygen', 1, 1);

INSERT INTO ship_type (name, description, max_fuel, max_hull, max_cargo, max_crew, max_hardpoints, max_power)
VALUES ('Shuttle', 'A basic planetary shuttle', 50, 20, 10, 2, 3, 50);
