
import nc from 'next-connect';
import axios from 'axios';

const handler = nc();

const DATA_URL =
  'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

handler.get(async (req, res) => {
  const apiKey = process.env.MARKET_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      ok: false,
      error: 'Mandi data API is not configured.',
      message: 'Add MARKET_API_KEY to your local .env file.',
    });
  }

  const commodity =
    typeof req.query.commodity === 'string'
      ? req.query.commodity.trim()
      : '';

  const state =
    typeof req.query.state === 'string'
      ? req.query.state.trim()
      : '';

  const district =
    typeof req.query.district === 'string'
      ? req.query.district.trim()
      : '';

  if (!commodity) {
    return res.status(400).json({
      ok: false,
      error: 'Please select a crop or commodity.',
    });
  }

  try {
    const params = {
      'api-key': apiKey,
      format: 'json',
      limit: 100,
      offset: 0,
      'filters[commodity]': commodity,
    };

    if (state) params['filters[state.keyword]'] = state;
    if (district) params['filters[district]'] = district;

    const response = await axios.get(DATA_URL, {
      params,
      timeout: 15000,
    });

    const records = (response.data.records || [])
      .map((item) => ({
        state: item.state || '',
        district: item.district || '',
        commodity: item.commodity || commodity,
        variety: item.variety || '',
        grade: item.grade || '',
        market: item.market || 'Unknown market',
        min: Number(item.min_price),
        max: Number(item.max_price),
        modal: Number(item.modal_price),
        date: item.arrival_date || '',
        unit: '₹/quintal',
      }))
      .filter(
        (item) =>
          Number.isFinite(item.min) &&
          Number.isFinite(item.max) &&
          Number.isFinite(item.modal)
      );

    return res.status(200).json({
      ok: true,
      source: 'data.gov.in',
      updatedAt: response.data.updated || null,
      total: Number(response.data.total || records.length),
      data: {
        commodity,
        mandiPrices: records,
      },
    });
  } catch (error) {
    console.error(
      'Mandi API error:',
      error.response?.status || error.code || error.message
    );

    return res.status(502).json({
      ok: false,
      error: 'Unable to retrieve mandi prices right now.',
      message:
        'Check your data.gov.in API key and try again later.',
    });
  }
});

export default handler;
