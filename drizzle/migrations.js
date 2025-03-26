// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_bright_dexter_bennett.sql';
import m0001 from './0001_bright_wasp.sql';
import m0002 from './0002_salty_betty_ross.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002
    }
  }
  