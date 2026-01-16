<p align="center">
  <img src="public/logo.svg" alt="More Like This Logo" width="120" height="120">
</p>

<h1 align="center">More Like This</h1>

<p align="center">
  <strong>🎬 Discover similar movies and series based on what you love</strong>
</p>

<p align="center">
  <a href="https://44295f3e7104-morelikethis.baby-beamup.club/configure">
    <img src="https://img.shields.io/badge/Install-Stremio%20Addon-7B68EE?style=for-the-badge&logo=stremio&logoColor=white" alt="Install Addon">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.2.0-blue?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square&logo=node.js" alt="Node">
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/platform-Stremio-purple?style=flat-square" alt="Platform">
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#%EF%B8%8F-configuration">Configuration</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-platform-compatibility">Platform Compatibility</a> •
  <a href="#-development">Development</a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Similar Content** | Get recommendations based on TMDB's similarity algorithm |
| 🤖 **AI-Powered Picks** | Gemini AI analyzes themes, mood, and storytelling for smarter suggestions |
| 🎬 **Movies & Series** | Full support for both movies and TV series |
| ⚡ **Smart Caching** | 1-hour cache for faster repeated lookups |
| 🔒 **Privacy First** | Your API keys stay in your local configuration |
| 🌐 **Self-Hostable** | Run your own instance or use the public deployment |

## 🚀 Installation

### Quick Install (Recommended)

1. **Get your API keys (both required):**
   - [TMDB API Key](https://www.themoviedb.org/settings/api) (Free) - *For movie/series lookup*
   - [Gemini API Key](https://aistudio.google.com/app/apikey) (Free) - *For AI recommendations*

2. **Install the addon:**
   
   [![Install Addon](https://img.shields.io/badge/Click%20to%20Install-Configure%20Addon-7B68EE?style=for-the-badge)](https://44295f3e7104-morelikethis.baby-beamup.club/configure)

3. **Enter your API keys** and click "Install Addon"

4. **Done!** Open any movie/series in Stremio to see recommendations

### Manual Install

```
https://44295f3e7104-morelikethis.baby-beamup.club/{config}/manifest.json
```

Replace `{config}` with your URL-encoded configuration JSON.

## ⚙️ Configuration

| Key | Required | Description |
|-----|----------|-------------|
| `tmdbApiKey` | ✅ Yes | Your TMDB API key for movie/series lookup |
| `geminiApiKey` | ✅ Yes | Your Gemini AI API key for recommendations |

> **Note:** This addon is **AI-powered only**. Both API keys are required for recommendations to work. There is no fallback to TMDB similar content.

### Getting API Keys

<details>
<summary><b>📺 TMDB API Key</b></summary>

1. Create an account at [themoviedb.org](https://www.themoviedb.org/)
2. Go to [API Settings](https://www.themoviedb.org/settings/api)
3. Request an API key (select "Developer" option)
4. Copy your API key (v3 auth)

</details>

<details>
<summary><b>🤖 Gemini API Key</b></summary>

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

</details>

## 🔍 How It Works

```
┌─────────────────┐     ┌─────────────────┐      ┌─────────────────┐
│   You watch a   │────▶│  More Like This │────▶│ Recommendations │
│  movie/series   │     │     analyzes    │      │    appear in    │
│   in Stremio    │     │   your choice   │      │      Stremio    │
└─────────────────┘     └─────────────────┘      └─────────────────┘
```

### Recommendation Engine

The addon uses **Gemini AI** exclusively for recommendations:

- AI analyzes themes, mood, atmosphere, and storytelling style
- TMDB is only used to look up movie/series information
- **No fallback** - if AI fails, no results are shown (by design)

## 📺 Platform Compatibility

| Platform | Support Level | Notes |
|----------|---------------|-------|
| **Windows/Mac/Linux** | ✅ Full | All features work |
| **Web App** | ✅ Full | All features work |
| **Android Mobile** | ✅ Full | All features work |
| **Android TV** | ⚠️ Partial | See limitations below |
| **Samsung TV (Tizen)** | ⚠️ Partial | See limitations below |
| **LG TV (WebOS)** | ⚠️ Partial | See limitations below |

### TV Limitations (Known Issues)

Due to Stremio platform limitations on Smart TVs, some features work differently:

| Feature | Desktop/Web | Smart TVs |
|---------|-------------|-----------|
| Stream button (quick access) | ✅ Works | ❌ Not supported |
| Movie-specific recommendations | ✅ Works | ❌ Not supported |
| General AI recommendations | ✅ Works | ✅ Works |
| Catalog browsing | ✅ Works | ✅ Works |

### Why TV Has Limitations

These are **Stremio platform bugs**, not addon issues:

1. **`externalUrl` streams broken** - Stream buttons cause infinite loading on Samsung/LG TVs
2. **Deep link parameters stripped** - The `?search=` parameter that identifies which movie you're viewing gets ignored
3. **Stream buttons not supported** - Officially confirmed by Stremio community

### How to Use on TV

Since movie-specific recommendations don't work on TV, here's how to use the addon:

1. Open Stremio → Go to **Discover**
2. Select **"More Like This"** from the catalog dropdown
3. Browse the **general AI-curated recommendations**

> **Note:** On TV, you'll see general trending/AI picks instead of recommendations specific to a movie you're viewing. This is the best experience possible given platform limitations.

### Troubleshooting TV Issues

If the addon doesn't work on your TV:

1. **Update Stremio** to the latest version
2. **Uninstall → Hard reboot TV → Reinstall** (hold power until logo or unplug for 10 seconds)
3. **Check TV model** - Samsung TVs from 2019+ are officially supported
4. **Try changing DNS** to `8.8.8.8` (Google DNS)

## 🛠️ Development

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Local Setup

```powershell
# Clone the repository
git clone https://github.com/yourusername/MoreLikeThis.git
cd MoreLikeThis

# Install dependencies
npm install

# Start the server
npm start
```

The addon will be available at:
- **Configure:** http://127.0.0.1:7000/configure
- **Manifest:** http://127.0.0.1:7000/manifest.json

### Project Structure

```
MoreLikeThis/
├── addon.js        # Main addon server & handlers
├── configure.js    # Configuration page generator
├── tmdb.js         # TMDB API integration
├── gemini.js       # Gemini AI integration
├── public/
│   └── logo.svg    # Addon logo
├── package.json
└── Procfile        # Deployment configuration
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 7000) |
| `BASE_URL` | Public URL for the addon |

## 📝 API Reference

### Catalogs

| ID | Type | Description |
|----|------|-------------|
| `morelikethis-movie` | movie | AI/Similar movie recommendations |
| `morelikethis-series` | series | AI/Similar series recommendations |

### Catalog Behavior

| Context | Behavior |
|---------|----------|
| With `search` param (Desktop) | Returns movie-specific AI recommendations |
| Without `search` param (TV) | Returns general trending/AI recommendations |

### Supported Resources

- `catalog` - Browse recommendations (works on all platforms)
- `meta` - Enriched metadata with recommendation links
- `stream` - Quick access button (Desktop/Web only)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Stremio](https://www.stremio.com/) - The best media center
- [TMDB](https://www.themoviedb.org/) - Movie & TV database
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI recommendations
- [Beamup](https://github.com/Stremio/stremio-beamup) - Easy addon deployment

---

<p align="center">
  Made with ❤️ for the Stremio community
</p>

<p align="center">
  <a href="https://44295f3e7104-morelikethis.baby-beamup.club/configure">
    <img src="https://img.shields.io/badge/🎬_Install_Now-More_Like_This-7B68EE?style=for-the-badge" alt="Install Now">
  </a>
</p>
