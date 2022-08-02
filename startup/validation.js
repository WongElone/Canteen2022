
function validateMsg(error) {
    return error.details.reduce((accumulator, current) => {
        return [...accumulator, current.message];
    }, []);
}

module.exports.validateMsg = validateMsg;