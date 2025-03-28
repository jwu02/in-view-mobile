# In-View

## Todos
- questions tab
    - create custom questions sheet
        - question title
        - personal notes
        - answer history - text / voice + attempt timestamp + duration
- review tab
    - randomised
- [] response screen
    - [x] text response
    - [x] audio response
    - [] delete recorded media file if not submitted
        - [x] on retakes
        - [] on unmount - check database / any other way?
            - or manually - option in settings to bulk check with database?
    - [] video response

## Notes
- imitate leetcode style
- `npx drizzle-kit generate` generate migrations for Expo SQLite database
- delete the database and start all over if running into issues creating table
```
import { deleteDatabaseSync } from "expo-sqlite";
deleteDatabaseSync("db.db");
```
