
/**
 * Gives an array with the items in the list as shown from the values and ranges
 * @param {string} rangeString - the ranges and values in the form of a string 
 * @return {array} - The array of items in sorted order
 */
const rangeInterpreter = (rangeString) => {
    if(rangeString.match(/[^0-9\.\,\ \-]/g)) {
        window.alert("Invalid character in range")
        throw new Error("Invalid character in range")
    }

    //gets all of the values in between the commas
    let valuesAndRanges = rangeString.match(/-?[0-9\.]+(--?[0-9\.]+)?/g)
    let outputArray = []
    valuesAndRanges.forEach(string => {
        
        //If the string selected can be changed into a number already, then add that to the array
        if(Number(string)) {
            outputArray.push(Number(string))
        } else {
            //If the string cannot be added, than that means that it could be a range

            //This is the template for a range in regex
            if(string.match(/-?[0-9\.]+--?[0-9\.]+/)) {
                let values = string.match(/((?<![0-9\.])-)?[0-9\.]+/g)  //matches the individual numbers in the range
                console.log(values)
                let min = Math.floor(Number(values[0]))
                let max = Math.floor(Number(values[1]))
                if(min > max) {
                    window.alert("Minimum of a range cannot be gearter than the Maximum")
                    throw new Error("Minimum of a range cannot be gearter than the Maximum")
                }
                while(min <= max) {
                    outputArray.push(min)
                    min++
                }
            }
        }
    })

    //Sets can only have unique elements
    //This transformation and back removes duplicates
    outputArray = [...new Set(outputArray)]
    outputArray.sort((a,b) => a - b)

    return outputArray
}


const rangeInput = document.getElementById('range-input')
const rangeOutput = document.getElementById('range-output')

rangeInput.addEventListener('keypress', (event) => {
    if(event.key === "Enter") {
        if(rangeInterpreter(rangeInput.value)) {
            rangeOutput.innerText = rangeInterpreter(rangeInput.value)
        }
    }
})