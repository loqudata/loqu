// https://stackoverflow.com/questions/26809484/how-to-use-double-star-glob-in-go
package utils

import (
	"os"
	"path/filepath"
)

func Glob(dir string, ext string) ([]string, error) {
	files := []string{}
	err := filepath.Walk(dir, func(path string, f os.FileInfo, err error) error {
		if filepath.Ext(path) == ext {
			files = append(files, path)
		}
		return nil
	})

	return files, err
}
