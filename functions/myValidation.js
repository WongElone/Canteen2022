
module.exports = {
    validateDate (date) {
        if (!date) return {};
    
        const [d, m, y] = date.split('/').map((e) => parseInt(e));
    
        if (d > 31 || d <= 0 || m <= 0 || m > 12 || y < 1970 || y > 2099) {
            return { error: {
                details: [,{
                    message: 'invalid date'
                }]
            }}
        }

        return {};
    }
}