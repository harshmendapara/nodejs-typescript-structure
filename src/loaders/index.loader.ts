import expressLoader from './express.loader';
import postgreLoader from './postgre.loader';
// import mongooseLoader from './mongoose.loader';
import postgreSQLLoader from './postgreSQL.loader';
import ScheduleService from '../services/schedule.service'
export default async ({ expressApp }) => {
  try {
    // await mongooseLoader();
    await postgreSQLLoader()
    console.log('=========================================');
    console.log('[INFO]:  ✌️ DB loaded and connected! ✌️');
    console.log('-----------------------------------------');
    // await expressLoader({ app: expressApp });
    await postgreLoader({ app: expressApp })
    console.log('-----------------------------------------');
    console.log('[INFO]:   ✌️ Express loaded ✌️');
    console.log('=========================================');
    const scheduleService = new ScheduleService()
    scheduleService.scheduler()
  } catch (err) {
    console.log('[ERROR]:   Unable to connect to db', err);
  }
};
