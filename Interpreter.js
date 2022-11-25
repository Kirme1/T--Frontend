const axios = require("axios")
const mqtt = require("mqtt")
const client = mqtt.connect("mqtt://localhost:1883/")
const Api = axios.create({
    baseURL: process.env.VUE_APP_API_ENDPOINT || 'http://localhost:8000/api'
})

client.on("connect", e => {
    console.log("connected")
    client.subscribe("/dentistimo/#", {qos:1},e => {
        client.on("message", (topic, m, option) => {
            console.log('aaoo got something')
            if (m.length !== 0){
                try {
                    console.log(m.toString())
                    let message = JSON.parse(m.toString())
                    if (message.request === 'post') {
                        postRequest(message.url, message.data, message.data.Authorization).then(data => {
                            let response = { "id": message.id, "response": "response", "data": data }
                            return client.publish(topic, JSON.stringify(response), {qos:1})
                        })
                    } else if (message.request === 'get') {
                        getRequest(message.url, message.data.Authorization).then(data => {
                            let response = { "id": message.id, "response": "response", "data": data }
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
                        })
                    } else if (message.request === 'postC') {
                        console.log('here')
                        postC(message.url, message.data).then(data => {
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

async function postC(url, data) {
    console.log('here2')
    let res = {}
    await Api.post(url, data).then(response => {
        console.log({ 'the response': response.data })
        res = response
    }).catch(e => {
        res = { "error": e}
    })
    console.log(res)
    return res
}

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