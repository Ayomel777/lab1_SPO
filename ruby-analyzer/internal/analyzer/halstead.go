package analyzer

import "math"

// CalculateHalstead возвращает метрики Холстеда (вместо печати в stdout).
func CalculateHalstead(operators, operands map[string]int) Metrics {
	var m Metrics

	m.Nu1 = len(operators)
	m.Nu2 = len(operands)

	for _, c := range operators {
		m.N1 += c
	}
	for _, c := range operands {
		m.N2 += c
	}

	m.N = m.N1 + m.N2
	m.Nu = m.Nu1 + m.Nu2

	if m.Nu > 0 {
		m.V = float64(m.N) * math.Log2(float64(m.Nu))
	}
	if m.Nu2 > 0 {
		m.D = float64(m.Nu1) / 2.0 * float64(m.N2) / float64(m.Nu2)
	}

	m.E = m.D * m.V
	m.B = m.V / 3000.0
	m.T = m.E / 18.0

	return m
}
