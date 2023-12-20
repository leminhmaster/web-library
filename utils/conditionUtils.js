
export const phieuMuonIsUpdated = (status) => {
    const values = ['TAO_MOI'];
    return values.includes(status)
}

export const phieuMuonIsDeleted = (status) => {
    const values = ['TAO_MOI', 'HET_HAN_XAC_NHAN', 'HUY_DON_MUON'];
    return values.includes(status)
}

export const phieuMuonIsReturn = (status) => {
    const values = ['XAC_NHAN_MUON', 'DEN_HAN_TRA', 'QUA_HAN_TRA'];
    return values.includes(status)
}

export const nhanVienIsActivate = (status) => {
    const values = ['CREATE'];
    return values.includes(status)
}

export const nhanVienIsDeactivate = (status) => {
    const values = ['ACTIVATE'];
    return values.includes(status)
}

export const nhanVienIsDelete = (status) => {
    const values = ['CREATE'];
    return values.includes(status)
}

export const isInternalUser = (user) => {
    if (user === undefined || user === null) {
        return false;
    }
    const values = ['ADMIN', 'STAFF'];
    const roles = [
        ...user.roles
    ];
    return roles.some((value, index, array) => values.includes(value.code));

}