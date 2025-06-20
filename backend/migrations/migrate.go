package migrate

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
)

func ResetDB(db *sql.DB) error {
	files := []string{"down.sql", "up.sql", "seed.sql"}

	for _, file := range files {
		sqlBytes, err := os.ReadFile(filepath.Join("migrations", file))
		if err != nil {
			return fmt.Errorf("failed to read %s: %w", file, err)
		}

		sqlStatements := string(sqlBytes)

		_, err = db.Exec(sqlStatements)
		if err != nil {
			return fmt.Errorf("failed to execute %s: %w", file, err)
		}
	}

	return nil
}
