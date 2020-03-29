/*
 * Bollinger Bands consist of an N-period moving average (MA),
 * an upper band at K times an N-period standard deviation above the moving average (MA + Kσ),
 * and a lower band at K times an N-period standard deviation below the moving average (MA − Kσ).
 */

// simple moving average
// assume input_price_array is ordered from [oldest -> newest]
let simple_moving_average = (limit, input_price_array) => {
  let running_total = 0;
  let output_price_array = []

  // populate initial values in output_price_array at index 0 - limit to null
  for (let i = 0; i < limit; i++) output_price_array.push(null)

  for (let i = limit; i < input_price_array.length; i++) {
    for (let j = i-limit; j < i; j++) {
      running_total += input_price_array[j]
    }
    output_price_array.push(running_total/limit)
    running_total = 0
  }
  return output_price_array
}

// TODO : standard deviation
let stdev = () => {}


let main = async () => {
  let input_price_array = [1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1]
  let sma = simple_moving_average(5, input_price_array)

  // test print sma vs input price
  // for (let x = 0; x < input_price_array.length;x++) {
  //   console.log(input_price_array[x],sma[x])
  // }

}
main()
