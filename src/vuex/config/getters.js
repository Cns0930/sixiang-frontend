const getters = {
    getCity: state => state.city,
    getProvince: state => state.province,
    getCrumbList: state => state.crumbList,
    getCrumbListSecond: state => state.crumbListSecond,
    hasManagePermission(state) {
        let hasAdmin = state.roles.includes('admin');
        let hasResearcher = state.roles.includes('researcher');
        if (hasAdmin || hasResearcher) {
            return true;
        }
        return false;
    }
};
export default getters
