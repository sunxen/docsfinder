import axios from 'axios';

export async function getHTML(url: string) {
  const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
  const { data } = await axios.get(url, {
    headers: {
      'User-Agent': userAgent,
    },
  });
  return data;
}