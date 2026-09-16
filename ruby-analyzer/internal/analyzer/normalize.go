package analyzer

// Normalize оставляет только операторы и операнды,
// отбрасывая служебные токены блоков (if/end/else и т.п.).
func Normalize(tokens []Token) []Token {
	out := make([]Token, 0, len(tokens))
	for _, t := range tokens {
		switch t.Type {
		case TokenOperator, TokenOperand:
			out = append(out, t)
		}
	}
	return out
}
