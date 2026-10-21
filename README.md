# Krishi Mitra Web App 🌾

An AI-powered farming assistant built with Next.js, providing farmers with intelligent support for their agricultural needs through voice interaction, pest detection, weather forecasting, and market insights.

## ✨ Features

- 🤖 **AI Chat Assistant** - Voice-enabled chat with multilingual support (English, Hindi, Marathi)
- 🌤️ **Weather Forecast** - Real-time weather data with farming alerts
- 🔍 **Pest Detection** - AI-powered pest and disease identification from images
- 📈 **Market Prices** - Current mandi prices for agricultural commodities
- 💭 **Feedback System** - User feedback collection and management

## 🛠️ Tech Stack

- **Framework**: Next.js (Pages Router)
- **Styling**: Tailwind CSS
- **Language**: JavaScript/TypeScript
- **AI**: Google Generative AI (Gemini)
- **Speech**: Web Speech API
- **File Upload**: Multer
- **HTTP Client**: Axios
- **API Routes**: Next-Connect

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd krishi-mitra-web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   # Google Gemini AI (Required for chat)
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   
   # OpenWeather API (Optional - uses mock data if not provided)
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   
   # Roboflow API (Optional - uses mock data if not provided)
   ROBOFLOW_API_KEY=your_roboflow_api_key_here
   ROBOFLOW_MODEL=your_model_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌐 Deployment on Vercel

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production deployment
vercel --prod
```

### 2. Set Environment Variables in Vercel

Go to your Vercel dashboard → Project Settings → Environment Variables and add:

```
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
OPENWEATHER_API_KEY=your_openweather_api_key_here
ROBOFLOW_API_KEY=your_roboflow_api_key_here
ROBOFLOW_MODEL=your_model_id
```

### 3. Redeploy

After setting environment variables, redeploy your application:
```bash
vercel --prod
```

## 📁 Project Structure

```
├── components/          # Reusable React components
│   ├── Header.tsx      # Navigation header
│   └── SpeechInput.js  # Voice input component
├── pages/              # Next.js pages (Pages Router)
│   ├── api/           # API routes
│   │   ├── chat.js    # AI chat endpoint
│   │   ├── weather.js # Weather data endpoint
│   │   ├── pest.js    # Pest detection endpoint
│   │   ├── market.js  # Market prices endpoint
│   │   └── feedback.js # Feedback submission endpoint
│   ├── index.tsx      # Home page
│   ├── chat.js        # Chat interface
│   ├── weather.js     # Weather forecast
│   ├── pest.js        # Pest detection
│   ├── market.js      # Market prices
│   └── feedback.js    # Feedback form
├── styles/            # Global CSS and Tailwind styles
└── ...config files
```

## 🔧 API Endpoints

- `POST /api/chat` - AI chat with voice support
- `POST /api/weather` - Weather data with alerts
- `POST /api/pest` - Pest detection from images
- `POST /api/market` - Market price lookup
- `POST /api/feedback` - User feedback submission

## 🌍 Supported Languages

- **English** (en-IN)
- **Hindi** (hi-IN) 
- **Marathi** (mr-IN)

## 📱 Browser Compatibility

- Chrome/Edge: Full support (including speech features)
- Firefox: Full support
- Safari: Basic support (limited speech features)
- Mobile browsers: Full responsive support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🙏 Acknowledgments

- Google Gemini AI for intelligent farming advice
- OpenWeather for weather data
- Roboflow for pest detection capabilities
- Web Speech API for voice interaction
- Tailwind CSS for beautiful UI components
