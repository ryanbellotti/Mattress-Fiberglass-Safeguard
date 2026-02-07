# Setup Instructions

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/ryanbellotti/Mattress-Fiberglass-Safeguard.git
cd Mattress-Fiberglass-Safeguard
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure your Gemini API key**
Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

## Running the Application

### Development Mode
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## Project Structure

```
├── components/        # React components (NavBar, Visualizer, etc.)
├── pages/            # Page components (Welcome, Dashboard, etc.)
├── services/         # API and external service integrations
├── utils/            # Utility functions
├── App.tsx           # Main app component with routing
├── index.tsx         # React entry point
├── index.html        # HTML template
├── types.ts          # TypeScript interfaces
├── vite.config.ts    # Vite configuration
└── tsconfig.json     # TypeScript configuration
```

## Features

- 🔍 **Mattress Detection**: AI-powered fiberglass detection using Gemini Vision
- 💬 **AI Assistant**: Conversational support for safety questions
- 📊 **Dashboard**: View statistics and recent activity
- 🛡️ **Safety Checker**: Search database for mattress safety information
- 🧹 **Cleanup Guide**: Step-by-step contamination cleanup instructions
- 📞 **Live Expert Support**: Connect with safety experts

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **AI**: Google Gemini 3 Vision API
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Troubleshooting

### Port 3000 already in use
Edit `vite.config.ts` and change the port:
```typescript
server: {
  port: 3001,  // or any available port
}
```

### Module not found errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build issues
Ensure TypeScript version matches:
```bash
npm install typescript@~5.8.2
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
