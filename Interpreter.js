const axios = require("axios")
const mqtt = require("mqtt")
const client = mqtt.connect("mqtt://localhost:1883/")
const Api = axios.create({
    baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:8000/api'
})
var CommandsFactory = require('hystrixjs').commandFactory;

client.on("connect", e => {
    console.log("connected")
    client.subscribe("/dentistimo/#", {qos:1},e => {
        client.on("message", (topic, m, option) => {
            console.log('aaoo got something')
            if (m.length !== 0){
                try {
                    let message = JSON.parse(m.toString())
                    if (message.request === 'post') {
                        var postPromise = postCommand.execute(message.url, message.data, message.data.Authorization) //Execute the command, creating a promise
                        postPromise.then(data => { //Once the promise is fulfilled, execute the rest of the code
                            let response = { "id": message.id, "response": "response", "data": data }
                            return client.publish(topic, JSON.stringify(response), {qos:1})
                        })
                    } else if (message.request === 'get') {
                        var getPromise = getCommand.execute(message.url, message.data.Authorization)
                        getPromise.then(data => {
                            let response = { "id": message.id, "response": "response", "data": data }
                            return client.publish(topic, JSON.stringify(response), {qos:1})
                        })
                    } else if (message.request === 'book') {
                        console.log('here')
                        var bookPromise = bookCommand.execute(message.url, message.data) //Execute the command, creating a promise
                        bookPromise.then(data => { //Once the promise is fulfilled, execute the rest of the code
                            let response = { "id": message.id, "response": "response", "data": data }
                            return client.publish(topic, JSON.stringify(response), {qos:1})
                        })

                    }
                    console.log(option)
                } catch (e) {
                    let response = { "id": topic.split('/').pop(), "response": "response", "data": "400 Bad Requests" }
                    return client.publish(topic, JSON.stringify(response), {qos:1})
                }
            } 
        })
    })
})

var bookCommand = CommandsFactory.getOrCreate("Service on port :" + service.port + ":" + port) //Create a book command with default settings
    .circuitBreakerErrorThresholdPercentage(service.errorThreshold)
    .timeout(service.timeout)
    .run(book) //The command calls the book function when executed, creating a promise
    .circuitBreakerRequestVolumeThreshold(service.concurrency)
    .circuitBreakerSleepWindowInMilliseconds(service.timeout)
    .statisticalWindowLength(10000)
    .statisticalWindowNumberOfBuckets(10)
    .errorHandler(isErrorHandler)
    .build();

async function book(url, data) {
    console.log(data)
    let res = {}
    await Api.post(url, { data: data }).then(response => {
        console.log(response.data)
        res = response.status
    }).catch(e => {
        res = { "error": e}
    })
    console.log(res)
    return res
}

var getCommand = CommandsFactory.getOrCreate("Service on port :" + service.port + ":" + port) //Same as above, but for the getRequest function
    .circuitBreakerErrorThresholdPercentage(service.errorThreshold)
    .timeout(service.timeout)
    .run(getRequest)
    .circuitBreakerRequestVolumeThreshold(service.concurrency)
    .circuitBreakerSleepWindowInMilliseconds(service.timeout)
    .statisticalWindowLength(10000)
    .statisticalWindowNumberOfBuckets(10)
    .errorHandler(isErrorHandler)
    .build();

async function getRequest(url, Autho) {
    let data = {}
    if(Autho != undefined){
        await Api.get(url, {headers: {Authorization: 'Bearer ' + Autho}}).then(response => {
            data = response.data
        }).catch(e => {
            data = { "error": e.response.status + " " + e.response.statusText }
        })
        return data
    } else {
        await Api.get(url).then(response => {
            data = response.data
        }).catch(e => {
            data = { "error": e.response.status + " " + e.response.statusText }
        })
        return data
    }
}

var postCommand = CommandsFactory.getOrCreate("Service on port :" + service.port + ":" + port) //Same as above, but for the postRequest function
    .circuitBreakerErrorThresholdPercentage(service.errorThreshold)
    .timeout(service.timeout)
    .run(postRequest)
    .circuitBreakerRequestVolumeThreshold(service.concurrency)
    .circuitBreakerSleepWindowInMilliseconds(service.timeout)
    .statisticalWindowLength(10000)
    .statisticalWindowNumberOfBuckets(10)
    .errorHandler(isErrorHandler)
    .build();

async function postRequest(url, data, Autho) {
    let res = {}
    if(Autho != undefined){
        await Api.post(url, data, {headers: {Authorization: 'Bearer ' + Autho}}).then(response => {
            res = { "status": response.status + " " + response.statusText, "data": response.data }
        }).catch(e => {
            res = { "error": e.response.status + " " + e.response.statusText }
        })
        return res
    } else {
        await Api.post(url, data).then(response => {
            res = { "status": response.status + " " + response.statusText, "data": response.data }
        }).catch(e => {
            res = { "error": e.response.status + " " + e.response.statusText }
        })
        return res
    }
}