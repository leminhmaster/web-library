const generateConfigHeader = (jwtToken) => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    }
}

const generateConfigHeaderFormData = (jwtToken) => {
    return {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${jwtToken}`
        }
    }
}

const generateConfigHeaderApiPubic = () => {
    return {
        headers: {
            'Content-Type': 'application/json',
        }
    }
}
module.exports = {
    generateConfigHeader: generateConfigHeader,
    generateConfigHeaderFormData: generateConfigHeaderFormData,
    generateConfigHeaderApiPubic: generateConfigHeaderApiPubic
}