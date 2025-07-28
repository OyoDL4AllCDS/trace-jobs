import axios from 'axios';
import cheerio from 'cheerio';

// This function is the serverless handler
export default async function handler(req, res) {
  // Set CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = 'https://www.hotnigerianjobs.com/';
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const jobs = [];
    
    $('div.mycase').each((i, el) => {
      const titleElement = $(el).find('h1 a');
      const title = titleElement.text().trim();
      const jobUrl = titleElement.attr('href');
      const postedInfo = $(el).find('span.semibio').first().text().trim();
      
      if (title && jobUrl && postedInfo) {
        jobs.push({
          title,
          company: 'N/A',
          location: 'Nigeria',
          url: jobUrl,
          posted: postedInfo,
        });
      }
    });
    
    const jobResults = jobs.slice(0, 20);
    console.log(`[PROD SCRAPER] /api/nigeria-jobs called. Returned ${jobResults.length} jobs.`);
    
    res.status(200).json({ jobs: jobResults });
  } catch (err) {
    console.error('[PROD SCRAPER] Error fetching from HotNigerianJobs:', err.message);
    res.status(500).json({ error: 'Failed to scrape job data.' });
  }
} 