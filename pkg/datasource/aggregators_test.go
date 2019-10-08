package datasource

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestParseDuration_validString(t *testing.T) {
	duration, err := parseDuration("5h")
	assert.Nil(t, err)
	assert.Equal(t, &Duration{
		Value: 5,
		Unit:  HOURS,
	}, duration)

	duration, err = parseDuration("10ms")
	assert.Nil(t, err)
	assert.Equal(t, &Duration{
		Value: 10,
		Unit:  MILLISECONDS,
	}, duration)
}

func TestParseDuration_invalidUnit(t *testing.T) {
	duration, err := parseDuration("1x")
	assert.Nil(t, duration)
	assert.IsType(t, &ParseError{}, err)
}

func TestParseDuration_invalidFormat(t *testing.T) {
	duration, err := parseDuration("")
	assert.Nil(t, duration)
	assert.IsType(t, &ParseError{}, err)

	duration, err = parseDuration("h")
	assert.Nil(t, duration)
	assert.IsType(t, &ParseError{}, err)

	duration, err = parseDuration("1")
	assert.Nil(t, duration)
	assert.IsType(t, &ParseError{}, err)

	duration, err = parseDuration("h1")
	assert.Nil(t, duration)
	assert.IsType(t, &ParseError{}, err)

	duration, err = parseDuration("1h1h")
	assert.Nil(t, duration)
	assert.IsType(t, &ParseError{}, err)

	duration, err = parseDuration("1.5h")
	assert.Nil(t, duration)
	assert.IsType(t, &ParseError{}, err)
}
