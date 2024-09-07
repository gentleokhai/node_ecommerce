import axios from 'axios';
import { ExchangeRates } from '../models/exchangeRates.model';
import dotenv from 'dotenv';
import { AppError } from '../utility/AppError';
import { Company } from '../models';

const API_URL = process.env.EXCHANGE_RATES_URL as string;
const API_KEY = process.env.EXCHANGE_RATES_KEY as string;

dotenv.config();

export const fetchAndStoreExchangeRates = async () => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        base_currency: 'USD',
      },
      headers: {
        apikey: API_KEY,
      },
    });

    if (response.status === 200) {
      const exchangeData = response.data.data;
      const lastUpdated = new Date(response.data.meta.last_updated_at);

      for (const currencyCode in exchangeData) {
        const { code, value } = exchangeData[currencyCode];

        await ExchangeRates.findOneAndUpdate(
          { currencyCode: code },
          { value, lastUpdated },
          { upsert: true, new: true }
        );
      }
    } else {
      console.error('Failed to fetch exchange rates');
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
  }
};

async function getExchangeRate(currencyCode: string): Promise<number> {
  const rate = await ExchangeRates.findOne({ currencyCode });
  if (!rate) {
    throw new AppError(`Exchange rate for ${currencyCode} not found`, 400);
  }
  return rate.value;
}

export async function convertToCurrency(
  amount: number,
  currencyCode: string
): Promise<number> {
  const exchangeRate = await getExchangeRate(currencyCode);

  return amount * exchangeRate;
}

export async function convertNGNToUSD(amount: number): Promise<number> {
  const exchangeRate = await getExchangeRate('NGN');

  return amount / exchangeRate;
}

export async function calculatePriceForViewingCurrency(
  companyId: string,
  amount: number
): Promise<number> {
  const company = await Company.findById(companyId);

  if (!company) {
    throw new Error('Company not found');
  }

  const exchangeRate = await getExchangeRate(company.viewingCurrency || 'USD');
  return amount * exchangeRate;
}
