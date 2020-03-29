let express = require('express')
, app = express()
, port = 8080

/*
 * Bollinger Bands consist of an N-period moving average (MA),
 * an upper band at K times an N-period standard deviation above the moving average (MA + Kσ),
 * and a lower band at K times an N-period standard deviation below the moving average (MA − Kσ).
 */

 const k = 2
 , n = 20

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


let calc_mean_of_period = (period, input_price_array) => {
  let running_total = 0;
  for (let i = period.start; i < period.end; i++) {
    running_total += input_price_array[i]
  }
  return running_total/(period.end-period.start)
}

// TODO : standard deviation
let stdev = (limit, input_price_array) => {
  let output_stdev_array = []
  for (let i = 0; i < limit; i++) output_stdev_array.push(null)


  for (let i = limit; i < input_price_array.length; i++) {
    let mean = calc_mean_of_period({start:i-limit,end:i}, input_price_array)

    // find the sum of the squared differences
    let squared_differences_sum = 0
    for (let ii = i-limit;ii < i; ii++) {
      squared_differences_sum += Math.pow(input_price_array[ii] - mean, 2)
    }
    // take the mean of the squared differences
    let mean_of_squared_differences = squared_differences_sum/limit
    output_stdev_array[i] = Math.sqrt(mean_of_squared_differences)
  }
  return output_stdev_array
}

let calc_bollinger_bands = (input_price_array, sma, stdev_arr) => {
  let bollinger_bands = {
    'price' : input_price_array,
    'sma' : sma,
    'upper-band' : [],
    'lower-band' : []
  }

  for (let x = 0; x < input_price_array.length;x++) {
    bollinger_bands['upper-band'].push(sma[x] + (k*stdev_arr[x]))
    bollinger_bands['lower-band'].push(sma[x] - (k*stdev_arr[x]))
  }
  return bollinger_bands
}

// let main = async () => {
//   let input_price_array = [1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1]
//   let sma = simple_moving_average(n, input_price_array)
//   let stdev_arr = stdev(n, input_price_array)]
//   let bollinger_bands = calc_bollinger_bands(input_price_array, sma, stdev_arr)
//   return bollinger_bands
// }
// main()


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.get('/bollinger_bands', (req, res) => {
  let input_price_array = [1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2,1]
  , sma = simple_moving_average(n, input_price_array)
  , stdev_arr = stdev(n, input_price_array)
  , bollinger_bands = calc_bollinger_bands(input_price_array, sma, stdev_arr)

  res.json({'bollinger_bands' : bollinger_bands})
})

app.listen(port, () => {
  console.log('listening on', port)
})
