package analyzer

import "sort"

type Entry struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

type Metrics struct {
	N1  int     `json:"n1"`
	N2  int     `json:"n2"`
	Nu1 int     `json:"nu1"`
	Nu2 int     `json:"nu2"`
	N   int     `json:"N"`
	Nu  int     `json:"nu"`
	V   float64 `json:"V"`
	D   float64 `json:"D"`
	E   float64 `json:"E"`
	B   float64 `json:"B"`
	T   float64 `json:"T"`
}

type Result struct {
	Operators []Entry `json:"operators"`
	Operands  []Entry `json:"operands"`
	Metrics   Metrics `json:"metrics"`
}

// Analyze — единая точка входа. Заменяет CLI-main из исходной программы.
func Analyze(source string) Result {
	tokens := Tokenize(source)
	tokens = Normalize(tokens)
	ops, opds := CountTokens(tokens)

	return Result{
		Operators: toSortedEntries(ops),
		Operands:  toSortedEntries(opds),
		Metrics:   CalculateHalstead(ops, opds),
	}
}

func CountTokens(tokens []Token) (map[string]int, map[string]int) {
	operators := make(map[string]int)
	operands := make(map[string]int)
	for _, t := range tokens {
		if t.Type == TokenOperator {
			operators[t.Value]++
		}
		if t.Type == TokenOperand {
			operands[t.Value]++
		}
	}
	return operators, operands
}

func toSortedEntries(m map[string]int) []Entry {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Slice(keys, func(i, j int) bool {
		if m[keys[i]] != m[keys[j]] {
			return m[keys[i]] > m[keys[j]]
		}
		return keys[i] < keys[j]
	})
	out := make([]Entry, 0, len(keys))
	for _, k := range keys {
		out = append(out, Entry{Name: k, Count: m[k]})
	}
	return out
}
