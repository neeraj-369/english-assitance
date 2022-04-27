import Login from '../../login/Login'

const Logout = () => {
    localStorage.clear()
    return (
        <Login />
    )
}

export default Logout