class Calculator
  def initialize(value)
    @value = value
  end

  def add(number)
    if number > 0
      @value += number
    else
      @value = 0
    end
  end

  def subtract(number)
    if number > @value
      return false
    elsif number == @value
      @value = 0
    else
      @value -= number
    end
    return true
  end

  def multiply(number)
    @value *= number
    return @value
  end

  def divide(number)
    if number == 0
      return nil
    else
      @value /= number
    end
  end

  def positive?
    if @value > 0
      return true
    else
      return false
    end
  end

  def calculate(numbers)
    total = 0
    numbers.each do |number|
      if number > 0
        total += number
      else
        total -= number
      end
    end
    return total
  end

  def check(value)
    case value
    when 0
      puts "zero"
    when 1
      puts "one"
    when 2
      puts "two"
    else
      puts "other"
    end
  end

  def loop_test(limit)
    index = 0
    while index < limit
      index += 1
    end
    return index
  end

  def until_test(limit)
    index = 0
    until index >= limit
      index += 1
    end
    return index
  end

  def range_test
    result = []
    for number in 1..5
      result << number
    end
    return result
  end
end

calculator = Calculator.new(10)
calculator.add(5)
calculator.subtract(3)
puts calculator.calculate([1, 2, 3])
puts calculator.positive?