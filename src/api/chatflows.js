import client, { list, load, insert, update, rowDelete } from './client'

//const getAllChatflows = () => client.get('/chatflows')
const getAllChatflows = () => list('ChatFlow');

// To Do
//const getAllAgentflows = () => client.get('/chatflows?type=MULTIAGENT')
const getAllAgentflows = () => list('ChatFlow', { parentEntityField: 'type', parentId: 'MULTIAGENT'})


//const getSpecificChatflow = (id) => client.get(`/chatflows/${id}`)
const getSpecificChatflow = (id) => load('ChatFlow', id);

const getSpecificChatflowFromPublicEndpoint = (id) => client.get(`/public-chatflows/${id}`)

//const createNewChatflow = (body) => client.post(`/chatflows`, body)
const createNewChatflow = (body) => insert('ChatFlow', body)

const importChatflows = (body) => client.post(`/chatflows/importchatflows`, body)

//const updateChatflow = (id, body) => client.put(`/chatflows/${id}`, body)
const updateChatflow = (id, body) => update('ChatFlow', { ...body, ChatFlowId: id })

//const deleteChatflow = (id) => client.delete(`/chatflows/${id}`)
const deleteChatflow = (id) => rowDelete('ChatFlow', { ChatFlowId: id })

const getIsChatflowStreaming = (id) => client.get(`/chatflows-streaming/${id}`)

const getAllowChatflowUploads = (id) => client.get(`/chatflows-uploads/${id}`)

export default {
    getAllChatflows,
    getAllAgentflows,
    getSpecificChatflow,
    getSpecificChatflowFromPublicEndpoint,
    createNewChatflow,
    importChatflows,
    updateChatflow,
    deleteChatflow,
    getIsChatflowStreaming,
    getAllowChatflowUploads
}
