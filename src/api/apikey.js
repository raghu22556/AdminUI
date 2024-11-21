import client, { list, load, insert, update, rowDelete } from './client'
const TABLE_NAME = 'ApiKey';

//const getAllAPIKeys = () => client.get('/apikey')
const getAllAPIKeys = () => list(TABLE_NAME);

// const createNewAPI = (body) => client.post(`/apikey`, body)
const createNewAPI = (body) => insert(TABLE_NAME, body)

// const updateAPI = (id, body) => client.put(`/apikey/${id}`, body)
const updateAPI = (id, body) => update(TABLE_NAME, { ...body, ApiKeyId: id })

// const deleteAPI = (id) => client.delete(`/apikey/${id}`)
const deleteAPI = (id) => rowDelete(TABLE_NAME, { ApiKeyId: id })

const importAPI = (body) => client.post(`/apikey/import`, body)

export default {
    getAllAPIKeys,
    createNewAPI,
    updateAPI,
    deleteAPI,
    importAPI
}
