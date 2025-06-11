export const isLoggedIn = (): boolean => {
    const token = localStorage.getItem('jwtToken');
    return !!token;
};
