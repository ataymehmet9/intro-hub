package utils

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/go-playground/locales/en"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	en_translations "github.com/go-playground/validator/v10/translations/en"
)

var (
	validate   *validator.Validate
	translator ut.Translator
)

func init() {
	// Initialize validator
	validate = validator.New()

	// Register validation for struct fields
	validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})

	// Set up translator
	english := en.New()
	uni := ut.New(english, english)
	translator, _ = uni.GetTranslator("en")
	en_translations.RegisterDefaultTranslations(validate, translator)
}

// Validate validates a struct using the validator
func Validate(s interface{}) error {
	if err := validate.Struct(s); err != nil {
		validationErrors := err.(validator.ValidationErrors)
		translatedErrors := validationErrors.Translate(translator)

		// Build user-friendly error messages
		var errorMessages []string
		for _, e := range validationErrors {
			errorMessages = append(errorMessages, translatedErrors[e.Namespace()])
		}

		if len(errorMessages) > 0 {
			return fmt.Errorf("validation failed: %s", strings.Join(errorMessages, ", "))
		}

		return fmt.Errorf("validation failed")
	}

	return nil
}
