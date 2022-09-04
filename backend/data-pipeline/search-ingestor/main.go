package main

import (
	"fmt"

	"github.com/pemistahl/lingua-go"
)

func main() {
	languages := []lingua.Language{
		lingua.English,
		lingua.French,
		lingua.German,
		lingua.Spanish,
	}

	detector := lingua.NewLanguageDetectorBuilder().
		FromLanguages(languages...).
		Build()

	if language, exists := detector.DetectLanguageOf("languages are awesome"); exists {
		fmt.Println(language)
	}

	// Output: English
}
