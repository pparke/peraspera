INSERT INTO star_type (name, description, mass, max_radius, luminosity, habitable_zone_center, habitable_zone_width)
VALUES ('White Dwarf', '', 1000, 1000, 1, 100, 100);

INSERT INTO star_type (name, description, mass, max_radius, luminosity, habitable_zone_center, habitable_zone_width)
VALUES ('Red Dwarf', '', 2000, 10000, 1, 2000, 1000);

INSERT INTO star_type (name, description, mass, max_radius, luminosity, habitable_zone_center, habitable_zone_width)
VALUES ('Orange', '', 3000, 100000, 2, 4000, 1000);

INSERT INTO star_type (name, description, mass, max_radius, luminosity, habitable_zone_center, habitable_zone_width)
VALUES ('Yellow', '', 4000, 100000, 3, 6000, 1000);

INSERT INTO star_type (name, description, mass, max_radius, luminosity, habitable_zone_center, habitable_zone_width)
VALUES ('Yellow-White', '', 5000, 100000, 4, 8000, 1000);

INSERT INTO star_type (name, description, mass, max_radius, luminosity, habitable_zone_center, habitable_zone_width)
VALUES ('White', '', 6000, 100000, 5, 10000, 1000);

INSERT INTO star_type (name, description, mass, max_radius, luminosity, habitable_zone_center, habitable_zone_width)
VALUES ('Blue-White', '', 7000, 100000, 5, 12000, 1000);

INSERT INTO star_type (name, description, mass, max_radius, luminosity, habitable_zone_center, habitable_zone_width)
VALUES ('Blue', '', 8000, 100000, 5, 14000, 1000);

INSERT INTO systems (name, description, star_type, coord_x, coord_y)
VALUES ('Sol', 'Homeworld', 3, 0, 0);

INSERT INTO systems (name, description, star_type, coord_x, coord_y)
VALUES ('Alpha Centauri', 'First colonized', 3, 1, 1);

INSERT INTO ship_type (name, description, max_fuel, max_hull, max_cargo, max_crew, max_hardpoints, max_power)
VALUES ('Shuttle', 'A basic planetary shuttle', 50, 20, 10, 2, 3, 50);
