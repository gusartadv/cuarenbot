
const axios = require('axios');
const qs = require('qs');
let defaultConfig = {
  host:  process.env.BPM_HOST || 'localhost',
  port:  process.env.BPM_PORT || 8080
}

class APIBpmsIntegration {

  constructor(config) {
    //cargamos valores por defecto
    this.config = config || defaultConfig
    this.host = `http://${this.config.host}:${this.config.port}`
  }

  async login(username, password) {
    this.username = username
    this.password = password
    let urlLogin = `${this.host}/api/loginservice`

    const data = { 
      'username': username,
      'password': password,
      'redirect': false
    }

    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(data),
      url: urlLogin,
      withCredentials: true
    }

    //let result = await axios(options)
    //TODO obtener token
    this.token = ''//result.headers['set-cookie']
    console.log('Se hace login en la api')
    return
  }

  async startCase(processId, data){
    let urlStartCase = `${this.host}/api/pedido`

    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(data),
      url: urlStartCase,
      withCredentials: false
    }
    console.log('se hace la petición a: ', urlStartCase)
    console.log(data)
    await axios(options)
    return
  }

  async executeUserTask(userTaskId, data){
    let urlExecuteTask= `${this.host}/api/bpm/userTask/${userTaskId}/execution?assign=true`

    const options = {
      method: 'POST',
      headers: { 
        'X-Bonita-API-Token': this.getTokenFromCookies(this.cookies),
        Cookie: this.cookies.join(';')
      },
      url: urlExecuteTask,
      withCredentials: true,
      data: data
    }
    //await axios(options)
    console.log(`Se envia la tarea: ${userTaskId} para su ejecución con la data: ${data}`)
    return
  }

  async getContextTask(userTaskId, varName){
    return 
  }

  async getProcessIdByName(processName){
    return ''
  }

}


module.exports = { APIBpmsIntegration: APIBpmsIntegration };