let defaultConfig = {
  bpmUsername: process.env.BPM_USERNAME || 'bot',
  bpmPassword: process.env.BPM_PASWORD || 'bpm',
  processId: process.env.BPM_PROCESS_ID || '',
}

class ProcesoBPM {
  constructor(config){
    this.config = config || defaultConfig
  }

  usarBPMS(integracionBPMS) {
    this.bpms = integracionBPMS
  }

  async iniciarCaso(data) {
    await this.bpms.login(this.config.bpmUsername, this.config.bpmPassword)
    let processId = await this.bpms.getProcessIdByName(this.config.processName)
    await this.bpms.startCase(processId, data) //this.marshalling(data))
  }

  async ejecutarTareaUsuario(idTarea, data) {
    await this.bpms.executeUserTask(idTarea, this.taskMarshalling(data))
  }

  async obtenerContextoDeTarea(idTarea, nombreVariable) {
    return await this.bpms.getContextTask(idTarea, nombreVariable);
  }


  marshalling(data) {
    //Es importante que el input se llame 'instanciationProcessInput'
    let procesoInput = Object.assign({}, data)
    let result = {
      instanciationProcessInput: procesoInput
    }
    console.log(result)
    return result
  }

  taskMarshalling(data) {
    //Es importante que el input se llame 'executionTaskInput'
    let procesoInput = Object.assign({}, data)
    let result = {
      executionTaskInput: procesoInput
    }
    console.log(result)
    return result
  }
}

module.exports.ProcesoBPM = ProcesoBPM;