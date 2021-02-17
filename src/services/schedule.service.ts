var cron = require('node-cron');
export default class ScheduleService {

    constructor() { }

    public async scheduler() {
        // const adminService = new AdminService()

        cron.schedule('0 0 0 1-31 * *', async () => {
            
           console.log('Scheduler Working')
        });
        
        // adminService.defaultAdminCrate()
    }
}