package analyzer

import "strings"

func Normalize(tokens []Token) []Token {
	type frame struct {
		opener string
		parts  []string
	}

	stack := make([]frame, 0, 16)
	out := make([]Token, 0, len(tokens))

	for _, t := range tokens {
		switch t.Type {

		case TokenOpenBlock:
			if t.Value == "do" && len(stack) > 0 {
				top := stack[len(stack)-1].opener
				if top == "while" || top == "until" || top == "for" {
					continue
				}
			}
			stack = append(stack, frame{opener: t.Value})

		case TokenBlockPart:
			if len(stack) > 0 {
				stack[len(stack)-1].parts = append(
					stack[len(stack)-1].parts, t.Value,
				)
			}

		case TokenCloseBlock:
			if len(stack) == 0 {
				out = append(out, Token{Value: t.Value, Type: TokenOperator})
				continue
			}
			f := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			out = append(out, Token{
				Value: buildBlockName(f.opener, f.parts),
				Type:  TokenOperator,
			})

		case TokenOperator, TokenOperand:
			out = append(out, t)
		}
	}

	for _, f := range stack {
		out = append(out, Token{Value: f.opener, Type: TokenOperator})
	}

	return out
}

func buildBlockName(opener string, parts []string) string {
	seen := make(map[string]bool, len(parts))
	uniq := make([]string, 0, len(parts))
	for _, p := range parts {
		if !seen[p] {
			seen[p] = true
			uniq = append(uniq, p)
		}
	}

	var sb strings.Builder
	sb.WriteString(opener)
	for _, p := range uniq {
		sb.WriteString("...")
		sb.WriteString(p)
	}
	sb.WriteString("...end")
	return sb.String()
}
