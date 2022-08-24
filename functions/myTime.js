
module.exports = {
    todayHKDate() {
        return new Date()
            .toLocaleString('en-UK', { timeZone: 'Asia/Singapore' })
            .slice(0,10);
    }
}