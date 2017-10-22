CREATE TABLE passwd (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users,
  username      TEXT NOT NULL,
  password      TEXT NOT NULL,
  hash          TEXT NOT NULL,
  salt          TEXT NOT NULL,
  token_verify  TEXT NOT NULL,
  token_public  TEXT NOT NULL,
  token_expires TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  handle      TEXT NOT NULL,
  email       TEXT NOT NULL,
  verified    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE star_type (
  id                    SERIAL PRIMARY KEY,
  name                  TEXT NOT NULL,
  description           TEXT NOT NULL,
  mass                  INTEGER NOT NULL,
  max_radius            INTEGER NOT NULL,
  luminosity            INTEGER,
  habitable_zone_center INTEGER,
  habitable_zone_width  INTEGER,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE systems (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  star_type   INTEGER REFERENCES star_type,
  coord_x     INTEGER NOT NULL,
  coord_y     INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sectors (
  id          SERIAL PRIMARY KEY,
  coord_x     INTEGER NOT NULL,
  coord_y     INTEGER NOT NULL,
  system_id   INTEGER REFERENCES systems
);

CREATE TABLE wormholes (
  id            SERIAL PRIMARY KEY,
  system_a_id   INTEGER REFERENCES systems,
  system_b_id   INTEGER REFERENCES systems,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE planets (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
	mass			REAL NOT NULL,
	population		BIGINT DEFAULT 0,
	temperature		INTEGER,
	atmosphere		TEXT,
  system_id   INTEGER REFERENCES systems,
  sector_id   INTEGER REFERENCES sectors,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE stations (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  system_id   INTEGER REFERENCES systems,
  sector_id   INTEGER REFERENCES sectors,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ship_type (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  max_fuel        INTEGER NOT NULL DEFAULT 100,
  max_hull        INTEGER NOT NULL DEFAULT 100,
  max_cargo       INTEGER NOT NULL DEFAULT 100,
  max_crew        INTEGER NOT NULL DEFAULT 100,
  max_hardpoints  INTEGER NOT NULL DEFAULT 10,
  max_power       INTEGER NOT NULL DEFAULT 100,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ships (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  fuel            INTEGER NOT NULL DEFAULT 100,
  hull_integrity  INTEGER NOT NULL DEFAULT 100,
  cargo_space     INTEGER NOT NULL DEFAULT 100,
  crew            INTEGER NOT NULL DEFAULT 100,
  hardpoints      INTEGER NOT NULL DEFAULT 10,
  power_level     INTEGER NOT NULL DEFAULT 100,
  ship_type       INTEGER REFERENCES ship_type NOT NULL,
  system_id       INTEGER NOT NULL REFERENCES systems,
  sector_id       INTEGER NOT NULL REFERENCES sectors,
  planet_id       INTEGER REFERENCES planets,
  station_id      INTEGER REFERENCES stations,
  docked          BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE items (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO peraspera;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO peraspera;
