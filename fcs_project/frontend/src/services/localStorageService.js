const storeToken = (value) => {
    if (value) {
        ////console.log("Stored token")
        const {access, refresh} = value
        localStorage.setItem('access_token', access)
        //localStorage.setItem('refresh_token', refresh)
    }
}

const storeUser = (value) => {
    if (value) {
        ////console.log("Stored user")
        const {name, email, _} = value
        localStorage.setItem('username', name)
        localStorage.setItem('useremail', email)
    }
}

const getToken = () => {
    let access_token = localStorage.getItem('access_token')
    //let refresh_token = localStorage.getItem('refresh_token')
    return {access_token}
}

const getUser = () => {
    let username = localStorage.getItem('username')
    let useremail = localStorage.getItem('useremail')
    return {username, useremail}
}

const removeToken = () => {
    localStorage.removeItem('access_token')
    //localStorage.removeItem('refresh_token')
}

const removeUser = () => {
    localStorage.removeItem('username')
    localStorage.removeItem('useremail')
}

export {storeToken, storeUser, getToken, getUser, removeToken, removeUser}