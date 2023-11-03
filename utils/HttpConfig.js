const generateConfigHeader = (jwtToken) => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    }
}
export default generateConfigHeader