
import nc from 'next-connect';

const handler = nc();

const validCategories = [
  'General Feedback',
  'AI Assistant',
  'Weather Information',
  'Crop Health Detection',
  'Mandi Prices',
  'Website Design',
  'Bug Report',
  'Feature Request',
];

handler.post(async (req, res) => {
  try {
    const { name, category, rating, message } = req.body || {};

    if (
      typeof message !== 'string' ||
      message.trim().length < 5 ||
      message.trim().length > 2000
    ) {
      return res.status(400).json({
        ok: false,
        error: 'Feedback must be between 5 and 2000 characters.',
      });
    }

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        ok: false,
        error: 'Please select a valid feedback category.',
      });
    }

    const numericRating = Number(rating);

    if (
      rating == null ||
      rating === '' ||
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        ok: false,
        error: 'Rating must be between 1 and 5.',
      });
    }

    // No database or persistent storage is configured yet.
    // Do not report successful storage until persistence is implemented.
    console.log('Feedback received:', {
      name: typeof name === 'string' ? name.trim().slice(0, 80) : '',
      category,
      rating: numericRating,
      message: message.trim(),
      receivedAt: new Date().toISOString(),
    });

    return res.status(200).json({
      ok: true,
      message: 'Feedback received by the server. Persistent storage is not configured yet.',
      saved: false,
    });
  } catch (error) {
    console.error('Feedback API error:', error.message);

    return res.status(500).json({
      ok: false,
      error: 'Unable to process feedback right now. Please try again.',
    });
  }
});

export default handler;
