import schedule from 'node-schedule'
import refreshModmeToken from './new-modme-token.js'
import groupsSync from './groups-sync.js'



schedule.scheduleJob("*/3 * * * *", async () => {
    refreshModmeToken()
})


// schedule.scheduleJob("*/5 * * * *", async () => {
//     groupsSync()
// })