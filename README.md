# In-View

## Todos
- imitate leetcode style
- questions tab
    - create custom questions sheet
        - question title
        - personal notes
        - answer history - text / voice + attempt timestamp + duration
- review tab
    - randomised
    - 

## Notes
- `npx drizzle-kit generate` generate migrations for Expo SQLite database
- delete the database and start all over if running into issues creating table
```
import { deleteDatabaseSync } from "expo-sqlite";
deleteDatabaseSync("db.db");
```
