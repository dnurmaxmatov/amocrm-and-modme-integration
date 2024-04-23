import schedule from 'node-schedule'
import refreshModmeToken from './new-modme-token.js'
import groupsSync from './groups-sync.js'



schedule.scheduleJob("* * * * *", async () => {
    refreshModmeToken()
    console.log(1111);
})


// schedule.scheduleJob("*/5 * * * *", async () => {
//     groupsSync()
// })