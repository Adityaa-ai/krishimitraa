
import nc from 'next-connect';
import multer from 'multer';
import axios from 'axios';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/bmp',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Upload a JPEG, PNG, WEBP, or BMP image.'));
    }
  },
});

export const config = {
  api: { bodyParser: false },
};

const handler = nc({
  onError(error, req, res) {
    console.error('Pest API error:', error.message);

    if (error instanceof multer.MulterError) {
      return res.status(
        error.code === 'LIMIT_FILE_SIZE' ? 413 : 400
      ).json({
        ok: false,
        message:
          error.code === 'LIMIT_FILE_SIZE'
            ? 'Image must be smaller than 10 MB.'
            : 'Unable to process uploaded image.',
      });
    }

    return res.status(500).json({
      ok: false,
      message: error.message || 'Unexpected server error.',
    });
  },
});

handler.use(upload.single('image'));

handler.post(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      ok: false,
      message: 'Please upload an image.',
    });
  }

  const apiKey = process.env.ROBOFLOW_API_KEY;
  const modelId =
    process.env.ROBOFLOW_MODEL ||
    'plant-disease-detection-s2tyd/1';

  if (!apiKey) {
    return res.status(503).json({
      ok: false,
      message: 'Roboflow API key is missing. Configure ROBOFLOW_API_KEY.',
    });
  }

  try {
    const imageBase64 = req.file.buffer.toString('base64');

    const url =
      `https://serverless.roboflow.com/${modelId}`;

    const result = await axios.post(url, imageBase64, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 30000,
      maxBodyLength: MAX_FILE_SIZE * 2,
    });

    const predictions = result.data?.predictions;

    if (!Array.isArray(predictions)) {
      throw new Error('Unexpected response from Roboflow.');
    }

    const detections = predictions.map((prediction) => ({
      label: String(prediction.class || 'Unknown'),
      confidence: Number(prediction.confidence) || 0,
      bbox: {
        x: Math.round(
          (Number(prediction.x) || 0) -
          (Number(prediction.width) || 0) / 2
        ),
        y: Math.round(
          (Number(prediction.y) || 0) -
          (Number(prediction.height) || 0) / 2
        ),
        width: Math.round(Number(prediction.width) || 0),
        height: Math.round(Number(prediction.height) || 0),
      },
    }));

    const suggestions = detections.length
      ? [
          'Review the detected labels and inspect the affected plant.',
          'AI predictions are preliminary; confirm the disease before treatment.',
          'If possible, consult a local agricultural expert for treatment advice.',
        ]
      : [
          'The model did not detect objects in its trained classes.',
          'This does not guarantee the plant is healthy. Try a clearer image if symptoms remain.',
        ];

    return res.status(200).json({
      ok: true,
      data: {
        filename: req.file.originalname,
        size: req.file.size,
        detections,
        suggestions,
        source: 'roboflow',
        warning:
          'AI predictions may be incorrect. Confirm findings before applying crop treatments.',
      },
    });
  } catch (error) {
    console.error(
      'Roboflow request failed:',
      error.response?.status || error.code || error.message
    );

    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        ok: false,
        message: 'Analysis timed out. Please try again.',
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        ok: false,
        message: 'Roboflow rate limit reached. Try again later.',
      });
    }

    if ([401, 403].includes(error.response?.status)) {
      return res.status(502).json({
        ok: false,
        message: 'Roboflow rejected the API credentials. Check your API key.',
      });
    }

    return res.status(502).json({
      ok: false,
      message: 'Crop analysis failed. Check the model configuration and try again.',
    });
  }
});

export default handler;
