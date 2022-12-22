const axios = require("axios")
const mqtt = require("mqtt")
const client = mqtt.connect("mqtt://localhost:1883/")
const Api = axios.create({
    baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:8000/api'
})
// All the requests sent from the client, after being authenticated come here
// Interpreter checks what is the type of request (like if it is a get, post, book, etc)
// Then based on the type, the request is handeld via one the async functions below.
client.on("connect", e => {
    console.log("connected")
    client.subscribe("/dentistimo/authenticated/#", {qos:1},e => {
        client.on("message", (topic, m, option) => {
            console.log('aaoo got something')
            if (m.length !== 0){
                try {
                    //console.log(m.toString())
                    let message = JSON.parse(m.toString())
                    console.log(message.request)
                    if (message.request === 'post') {
                        postRequest(message.url, message.data, message.data.Authorization).then(data => {
                            let response = { "id": message.id, "response": "response", "data": data }
                            return client.publish(topic, JSON.stringify(response), {qos:1})
                        })
                    } else if (message.request === 'get') {
                        getAllC(message.url, message.data.Authorization).then(data => {
                            let response = { "id": message.id, "response": "response", "data": data }
                            console.log(response)
                            return client.publish(topic, JSON.stringify(response), {qos:1})
                        })
                    } else if (message.request === 'book') {
                        console.log('here')
                        console.log(message.data)
                        book(message.url, message.data).then(data => {
                            let response = { "id": message.id, "response": "response", "data": data }
                            return client.publish(topic, JSON.stringify(response), {qos:1})
                        })
                    } else if (message.request === 'deleteAll') {
                        console.log('here')
                        deleteAll(message.url).then(data => {
                            let response = { "id": message.id, "response": "response", "data": data }
                            return client.publish(topic, JSON.stringify(response), {qos:1})
                        })
                    } else if (message.request === 'getAllC') {
                        console.log('here')
                        getAllC(message.url).then(data => {
                            let response = { "id": message.id, "response": "response", "data": data }
                            return client.publish(topic, JSON.stringify(response), {qos:1})
                        })}
                        else if (message.request === 'getAllBookingsOfClinic') {
                            console.log('here-lov')
                            console.log(message.url)
                            getAllBookingsOfClinic(message.url).then(data => {
                                let response = { "id": message.id, "response": "response", "data": data }
                                return client.publish(topic, JSON.stringify(response), {qos:1})
                            })
                        }
                    else if (message.request === 'postC') {
                        console.log('here')
                        postC(message.url, message.data).then(data => {
                            let response = { "id": message.id, "response": "response", "data": data }
                            return client.publish(topic, JSON.stringify(response), {qos:1})
                        }) } 
                        else if (message.request === 'postBookingForUser') {
                            console.log('here')
                            postBookingForUser(message.url, message.data).then(data => {
                                let response = { "id": message.id, "response": "response", "data": data }
                                return client.publish(topic, JSON.stringify(response), {qos:1})
                            }) }
                        else if (message.request === 'postU') {
                            console.log('here')
                            postU(message.url, message.data).then(data => {
                                let response = { "id": message.id, "response": "response", "data": data }
                                console.log(response)
                                return client.publish(topic, JSON.stringify(response), {qos:1})
                            })
                        }
                        else if (message.request === 'patchU') {
                            console.log('here')
                            patchU(message.url, message.data).then(data => {
                                let response = { "id": message.id, "response": "response", "data": data }
                                console.log(response)
                                return client.publish(topic, JSON.stringify(response), {qos:1})
                            })
                        }
                        else if (message.request === 'getU') {
                            console.log('here')
                            getU(message.url, message.data).then(data => {
                                let response = { "id": message.id, "response": "response", "data": data }
                                console.log(response)
                                return client.publish(topic, JSON.stringify(response), {qos:1})
                            })
                        }
                    else if (message.request === 'login') {
                        console.log('here-login')
                        login(message.url, message.data).then(data => {
                            console.log(data)
                            let response = { "id": message.id, "response": "response", "data": data }
                            console.log(response)
                            return client.publish(topic, JSON.stringify(response), {qos:1})
                        })

                    } else if (message.request === 'getBookings') {
                        console.log('here-get-bookings')
                        login(message.url, message.data).then(data => {
                            console.log(data)
                            let response = { "id": message.id, "response": "response", "data": data }
                            console.log(response)
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
// Wer are not using this method anymore!
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };
  // this function handles the request for posting a clinic and sends it to the relevant endpoint here in the controllers.
async function postC(url, data) {
    console.log('here2')
    let res = {}
    console.log(url, data)
    await Api.post(url, data).then(response => {
        console.log({ 'the response': response.data })
        res = response
    }).catch(e => {
        res = { "error": e}
    })
    console.log(res)
      return res
}
// This method handles the request for post a new booking for a specfic user
// It then sends the request to the related endpoint in the booking controller
async function postBookingForUser(url, data) {
    console.log('here2')
    let res = {}
    console.log(url, data)
    await Api.post(url, data).then(response => {
        console.log({ 'the response': response.data })
        res = response.data
    }).catch(e => {
        res = { "error": e}
    })
    console.log(res)
      return res
}
// This method handels the request for retrieving all the bookings.
async function getAllBookingsOfClinic(url) {
    console.log('here2')
    let res = {}
    await Api.get(url).then(response => {
        console.log({ 'the response': response.data })
        res = response.data
    }).catch(e => {
        res = { "error": e}
    })
    console.log(res)
    return res
}
// This function handles the request for getting all the clinics and sends the 
// request to the endpoint in the backend that can retrive all the clinics
async function getAllC(url) {
    console.log('here2')
    let res = {}
    await Api.get(url).then(response => {
        console.log({ 'the response': response.data })
        res = response.data
    }).catch(e => {
        res = { "error": e}
    })
    console.log(res)
    return res
}
// This function sends the request to deleting endpoint in booking controller to 
// delete all the bookings
async function deleteAll(url) {
    console.log('here2')
    let res = {}
    await Api.delete(url).then(response => {
        console.log({ 'the response': response.data })
        res = response.status
    }).catch(e => {
        res = { "error": e}
    })
    console.log(res)
    return res
}
// This function uses the post function in the booking controller to create a booking.
async function book(url, data) {
    console.log(data)
    let res = {}
    await Api.post(url, data).then(response => {
        console.log(response.data)
        res = response.status
    }).catch(e => {
        res = { "error": e}
    })
    console.log(res)
    return res
}

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
// This function uses the post endpoint in the user controller to post a user.
async function postU(url, data) {
    console.log('here2')
    let res = {}
    console.log(url, data)
    await Api.post(url, data).then(response => {
        console.log({ 'the response': response.data })
        res = response.data
    }).catch(e => {
        res = { "error": e}
    })
    console.log(res)
      return res
}

async function getU(url, data) {
    console.log('here2')
    let res = {}
    console.log(url, data)
    await Api.get(url, data).then(response => {
        console.log({ 'the response': response.data })
        res = response.data
    }).catch(e => {
        res = { "error": e}
    })
    console.log(res)
      return res
}

// This function uses the patch a user endpoint in the user controller to edit the whole 
// or part of a user information.
async function patchU(url, data) {
    console.log('here2')
    let res = {}
    console.log(url, data)
    await Api.patch(url, data).then(response => {
        console.log({ 'the response': response.data })
        res = response.data
    }).catch(e => {
        res = { "error": e}
    })
    console.log(res)
      return res
}
// This function uses the post endpoint for logging in a user in the user controller
async function login(url, data) {
    console.log('here-l')
    let res = {}
    await Api.post(url, data).then(response => {
        console.log(response.data)
        res = response.data
        //res = { "status": response.status + " " + response.statusText, "data": response.data }
    }).catch(e => {
        console.log('caught')
        res = { "error": e}
        //res = { "error": e.response.status + " " + e.response.statusText }
    })
    return res
}