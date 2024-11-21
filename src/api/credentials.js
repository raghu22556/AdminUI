import client, { list, load, insert, update, rowDelete } from './client'
const TABLE_NAME = 'Credentials';

//const getAllCredentials = () => client.get('/credentials')
const getAllCredentials = () => list(TABLE_NAME);

//const getCredentialsByName = (componentCredentialName) => client.get(`/credentials?credentialName=${componentCredentialName}`)
const getCredentialsByName = (componentCredentialName) => list(TABLE_NAME, { credentialName: componentCredentialName})

const getAllComponentsCredentials = () => client.get('/components-credentials')

//const getSpecificCredential = (id) => client.get(`/credentials/${id}`)
const getSpecificCredential = (id) => load(TABLE_NAME, id);

const getSpecificComponentCredential = (name) => client.get(`/components-credentials/${name}`)

//const createCredential = (body) => client.post(`/credentials`, body)
const createCredential = (body) => insert(TABLE_NAME, body)

//const updateCredential = (id, body) => client.put(`/credentials/${id}`, body)
const updateCredential = (id, body) => update(TABLE_NAME, { ...body, CredentialId: id })

//const deleteCredential = (id) => client.delete(`/credentials/${id}`)
const deleteCredential = (id) => rowDelete(TABLE_NAME, { CredentialsId: id })

export default {
    getAllCredentials,
    getCredentialsByName,
    getAllComponentsCredentials,
    getSpecificCredential,
    getSpecificComponentCredential,
    createCredential,
    updateCredential,
    deleteCredential
}
