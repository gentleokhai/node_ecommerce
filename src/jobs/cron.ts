import cron from 'node-cron';
import { fetchAndStoreExchangeRates } from '../services/exchangeRate.service';

cron.schedule('0 */12 * * *', async () => {
  try {
    await fetchAndStoreExchangeRates();
  } catch (error) {
    console.error('Error during cron job:', error);
  }
});
