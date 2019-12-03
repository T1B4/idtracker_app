import { Alert } from 'react-native'

// const server = 'http://10.0.2.2:3005'
const server = 'http://coletor.idtracker.com.br:3005'

function showError(err) {
  Alert.alert('Ops ocorreu um erro...', `${err}`)
}

export { server, showError }
