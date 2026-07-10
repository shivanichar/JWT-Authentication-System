export const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
})