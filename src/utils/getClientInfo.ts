import axios from 'axios';

export async function getClientInfo(ip: string): Promise<string> {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data;
  } catch (error) {
    throw new Error('Unable to retrieve client country');
  }
}
