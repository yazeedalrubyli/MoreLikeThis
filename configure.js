// Custom configuration page HTML
function getConfigurePage(manifest) {
    const configFields = Array.isArray(manifest.config) ? manifest.config : [];
    const fieldMeta = {
        tmdbApiKey: {
            label: 'TMDB API Key',
            subtitle: 'Get your free API key at <a href="https://www.themoviedb.org/settings/api" target="_blank">themoviedb.org</a>',
            placeholder: 'Enter your TMDB API key'
        },
        geminiApiKey: {
            label: 'Gemini API Key',
            subtitle: 'Get your free API key at <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a>',
            placeholder: 'Enter your Gemini API key'
        },
        geminiModel: {
            label: 'AI Model',
            subtitle: 'Select the Gemini model to use for recommendations',
            placeholder: 'Verify API key first'
        }
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${manifest.name} - Configure</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            min-height: 100vh;
            background: #0a0a0f;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 24px;
        }
        
        .container {
            width: 100%;
            max-width: 420px;
        }
        
        .card {
            background: linear-gradient(145deg, #12121a 0%, #0d0d12 100%);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 20px;
            padding: 40px 32px;
        }
        
        .logo-container {
            display: flex;
            justify-content: center;
            margin-bottom: 28px;
        }
        
        .logo {
            width: 72px;
            height: 72px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
            position: relative;
            overflow: hidden;
        }
        
        .logo::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
                45deg,
                transparent 30%,
                rgba(255,255,255,0.1) 50%,
                transparent 70%
            );
            animation: shine 3s infinite;
        }
        
        @keyframes shine {
            0% { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(100%) rotate(45deg); }
        }
        
        .logo svg {
            width: 36px;
            height: 36px;
            position: relative;
            z-index: 1;
        }
        
        .header {
            text-align: center;
            margin-bottom: 32px;
        }
        
        .header h1 {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
            color: #fff;
        }
        
        .header .description {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
            line-height: 1.5;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.85);
            margin-bottom: 4px;
        }
        
        .form-group .subtitle {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.4);
            margin-bottom: 10px;
        }
        
        .form-group .subtitle a {
            color: #8b5cf6;
            text-decoration: none;
        }
        
        .form-group .subtitle a:hover {
            text-decoration: underline;
        }
        
        .input-row {
            display: flex;
            gap: 8px;
            align-items: stretch;
        }
        
        .input-row input {
            flex: 1;
            min-width: 0;
        }
        
        .form-group input {
            width: 100%;
            padding: 14px 16px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            color: #fff;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.2s ease;
        }
        
        .form-group input:hover {
            border-color: rgba(255, 255, 255, 0.15);
            background: rgba(255, 255, 255, 0.06);
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #6366f1;
            background: rgba(99, 102, 241, 0.08);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
        
        .form-group input::placeholder {
            color: rgba(255, 255, 255, 0.25);
        }
        
        .form-group input.valid {
            border-color: #22c55e;
            background: rgba(34, 197, 94, 0.08);
        }
        
        .form-group input.invalid {
            border-color: #ef4444;
            background: rgba(239, 68, 68, 0.08);
        }
        
        .verify-btn {
            padding: 14px 16px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 13px;
            font-weight: 500;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
        }
        
        .verify-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
            color: #fff;
        }
        
        .verify-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .verify-btn.verifying {
            color: #fbbf24;
            border-color: rgba(251, 191, 36, 0.3);
        }
        
        .verify-btn.success {
            color: #22c55e;
            border-color: rgba(34, 197, 94, 0.3);
            background: rgba(34, 197, 94, 0.1);
        }
        
        .verify-btn.error {
            color: #ef4444;
            border-color: rgba(239, 68, 68, 0.3);
            background: rgba(239, 68, 68, 0.1);
        }
        
        .status-message {
            font-size: 12px;
            margin-top: 6px;
            display: none;
        }
        
        .status-message.show {
            display: block;
        }
        
        .status-message.success {
            color: #22c55e;
        }
        
        .status-message.error {
            color: #ef4444;
        }
        
        .install-btn {
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border: none;
            border-radius: 12px;
            color: #fff;
            font-size: 15px;
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: 8px;
        }
        
        .install-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
        }
        
        .install-btn:active {
            transform: translateY(0);
        }
        
        .divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.06);
            margin: 28px 0;
        }
        
        .features {
            display: flex;
            justify-content: center;
            gap: 32px;
        }
        
        .feature {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }
        
        .feature-icon {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.04);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }
        
        .feature-text {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.4);
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .spinner {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 2px solid transparent;
            border-top-color: currentColor;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-right: 6px;
            vertical-align: middle;
        }
        
        .model-select {
            width: 100%;
            padding: 14px 16px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            color: #fff;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.2s ease;
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 16px center;
        }
        
        .model-select:hover {
            border-color: rgba(255, 255, 255, 0.15);
            background-color: rgba(255, 255, 255, 0.06);
        }
        
        .model-select:focus {
            outline: none;
            border-color: #6366f1;
            background-color: rgba(99, 102, 241, 0.08);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
        
        .model-select option {
            background: #1a1a2e;
            color: #fff;
            padding: 12px;
        }
        
        .model-select.valid {
            border-color: #22c55e;
            background-color: rgba(34, 197, 94, 0.08);
        }
        
        /* Slider styles */
        .slider-container {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .slider {
            flex: 1;
            -webkit-appearance: none;
            appearance: none;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            outline: none;
            cursor: pointer;
        }
        
        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
            transition: transform 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
        }
        
        .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            border-radius: 50%;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
        }
        
        .slider-value {
            min-width: 48px;
            padding: 8px 12px;
            background: rgba(99, 102, 241, 0.15);
            border: 1px solid rgba(99, 102, 241, 0.3);
            border-radius: 8px;
            color: #a5b4fc;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
        }
        
        /* Toggle button group */
        .toggle-group {
            display: flex;
            gap: 8px;
        }
        
        .toggle-btn {
            flex: 1;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 10px;
            color: rgba(255, 255, 255, 0.5);
            font-size: 13px;
            font-weight: 500;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
        }
        
        .toggle-btn:hover {
            border-color: rgba(255, 255, 255, 0.15);
            color: rgba(255, 255, 255, 0.7);
        }
        
        .toggle-btn.active {
            background: rgba(99, 102, 241, 0.15);
            border-color: rgba(99, 102, 241, 0.4);
            color: #a5b4fc;
        }
        
        .toggle-btn .toggle-icon {
            display: block;
            font-size: 18px;
            margin-bottom: 4px;
        }
        
        /* Section divider */
        .section-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.06);
            margin: 24px 0;
        }
        
        .section-title {
            font-size: 12px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.3);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <div class="logo-container">
                <div class="logo">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="white"/>
                    </svg>
                </div>
            </div>
            
            <div class="header">
                <h1>${manifest.name}</h1>
                <p class="description">${manifest.description}</p>
            </div>
            
            <form id="configForm">
                <div class="form-group" data-key="tmdbApiKey">
                    <label>TMDB API Key</label>
                    <div class="subtitle">Get your free API key at <a href="https://www.themoviedb.org/settings/api" target="_blank">themoviedb.org</a></div>
                    <div class="input-row">
                        <input 
                            type="text" 
                            name="tmdbApiKey" 
                            placeholder="Enter your TMDB API key"
                            id="input-tmdbApiKey"
                        >
                        <button type="button" class="verify-btn" data-key="tmdbApiKey" onclick="verifyKey('tmdbApiKey')">Verify</button>
                    </div>
                    <div class="status-message" id="status-tmdbApiKey"></div>
                </div>
                
                <div class="form-group" data-key="geminiApiKey">
                    <label>Gemini API Key</label>
                    <div class="subtitle">Get your free API key at <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a></div>
                    <div class="input-row">
                        <input 
                            type="text" 
                            name="geminiApiKey" 
                            placeholder="Enter your Gemini API key"
                            id="input-geminiApiKey"
                        >
                        <button type="button" class="verify-btn" data-key="geminiApiKey" onclick="verifyKey('geminiApiKey')">Verify</button>
                    </div>
                    <div class="status-message" id="status-geminiApiKey"></div>
                </div>
                
                <div class="form-group" data-key="geminiModel" id="model-selector-group" style="display: none;">
                    <label>AI Model</label>
                    <div class="subtitle">Select the Gemini model to use for recommendations</div>
                    <select name="geminiModel" id="input-geminiModel" class="model-select">
                        <option value="">Verify API key first</option>
                    </select>
                    <div class="status-message" id="status-geminiModel"></div>
                </div>
                
                <div class="section-divider"></div>
                <div class="section-title">Recommendation Settings</div>
                
                <div class="form-group">
                    <label>Number of Recommendations</label>
                    <div class="subtitle">How many similar titles to show (1-30)</div>
                    <div class="slider-container">
                        <input type="range" name="maxResults" id="input-maxResults" class="slider" min="1" max="30" value="10">
                        <span class="slider-value" id="slider-value">10</span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Content Type Filter</label>
                    <div class="subtitle">What types of content to recommend</div>
                    <div class="toggle-group">
                        <button type="button" class="toggle-btn active" data-value="same" onclick="setContentType('same')">
                            <span class="toggle-icon">🎯</span>
                            Same Type
                        </button>
                        <button type="button" class="toggle-btn" data-value="all" onclick="setContentType('all')">
                            <span class="toggle-icon">🎬📺</span>
                            All Types
                        </button>
                    </div>
                    <input type="hidden" name="contentTypeFilter" id="input-contentTypeFilter" value="same">
                </div>
                
                <button type="submit" class="install-btn">Install Addon</button>
            </form>
            
            <div class="divider"></div>
            
            <div class="features">
                <div class="feature">
                    <span class="feature-icon">🎬</span>
                    <span class="feature-text">Movies</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">📺</span>
                    <span class="feature-text">Series</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">🤖</span>
                    <span class="feature-text">AI Picks</span>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        async function verifyTmdbKey(apiKey) {
            try {
                const response = await fetch('https://api.themoviedb.org/3/configuration?api_key=' + encodeURIComponent(apiKey));
                if (response.ok) {
                    return { valid: true, message: 'API key is valid and working!' };
                } else if (response.status === 401) {
                    return { valid: false, message: 'Invalid API key. Please check and try again.' };
                }
                return { valid: false, message: 'Could not verify key. Please try again.' };
            } catch (e) {
                return { valid: false, message: 'Network error. Please check your connection.' };
            }
        }

        // Model priority for sorting (lower = better/recommended)
        const MODEL_PRIORITY = {
            'gemini-2.5-flash': 1,
            'gemini-2.5-flash-lite': 2,
            'gemini-2.5-pro': 3,
            'gemini-3-flash-preview': 4,
            'gemini-3-pro-preview': 5,
            'gemini-2.0-flash': 6,
            'gemini-2.0-flash-lite': 7,
            'gemini-flash-latest': 8,
            'gemini-flash-lite-latest': 9,
            'gemini-pro-latest': 10
        };
        
        function getModelLabel(modelId) {
            if (modelId === 'gemini-2.5-flash') return '⭐ Recommended';
            if (modelId === 'gemini-2.5-flash-lite') return '⚡ Faster';
            if (modelId.includes('pro')) return '🚀 Pro';
            if (modelId.includes('lite')) return '⚡ Lite';
            if (modelId.includes('preview')) return '🧪 Preview';
            if (modelId.includes('latest')) return '🔄 Latest';
            return '';
        }
        
        async function verifyGeminiKey(apiKey) {
            try {
                const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + encodeURIComponent(apiKey));
                if (response.ok) {
                    const data = await response.json();
                    const models = data.models || [];
                    
                    // Filter to Gemini text generation models only
                    const availableModels = models
                        .filter(m => {
                            const modelName = m.name.replace('models/', '');
                            // Must support generateContent
                            if (!m.supportedGenerationMethods || !m.supportedGenerationMethods.includes('generateContent')) {
                                return false;
                            }
                            // Only include Gemini models (not Gemma, embedding, imagen, veo, aqa)
                            if (!modelName.startsWith('gemini-')) {
                                return false;
                            }
                            // Exclude special-purpose models
                            if (modelName.includes('image') || modelName.includes('tts') || 
                                modelName.includes('robotics') || modelName.includes('computer-use') ||
                                modelName.includes('deep-research') || modelName.includes('embedding') ||
                                modelName.includes('nano-banana')) {
                                return false;
                            }
                            // Must have reasonable output token limit (exclude embedding models)
                            if (m.outputTokenLimit < 1000) {
                                return false;
                            }
                            return true;
                        })
                        .map(m => {
                            const modelId = m.name.replace('models/', '');
                            return {
                                id: modelId,
                                displayName: m.displayName || modelId,
                                description: m.description || '',
                                label: getModelLabel(modelId),
                                priority: MODEL_PRIORITY[modelId] || 100
                            };
                        })
                        // Sort by priority (lower = better)
                        .sort((a, b) => a.priority - b.priority);
                    
                    if (availableModels.length === 0) {
                        return { 
                            valid: false, 
                            message: 'No compatible Gemini text models found for this API key.',
                            models: []
                        };
                    }
                    
                    return { 
                        valid: true, 
                        message: \`Found \${availableModels.length} available model(s). Select one below.\`,
                        models: availableModels
                    };
                } else if (response.status === 400 || response.status === 403) {
                    return { valid: false, message: 'Invalid API key. Please check and try again.', models: [] };
                }
                return { valid: false, message: 'Could not verify key. Please try again.', models: [] };
            } catch (e) {
                return { valid: false, message: 'Network error. Please check your connection.', models: [] };
            }
        }
        
        function showModelSelector(models) {
            const modelGroup = document.getElementById('model-selector-group');
            const modelSelect = document.getElementById('input-geminiModel');
            const modelStatus = document.getElementById('status-geminiModel');
            
            // Clear existing options
            modelSelect.innerHTML = '';
            
            if (models.length === 0) {
                modelGroup.style.display = 'none';
                return;
            }
            
            // Add options with labels
            models.forEach((model, index) => {
                const option = document.createElement('option');
                option.value = model.id;
                const label = model.label ? ' - ' + model.label : '';
                option.textContent = model.displayName + label;
                if (index === 0) option.selected = true;
                modelSelect.appendChild(option);
            });
            
            // Show the selector
            modelGroup.style.display = 'block';
            modelSelect.classList.add('valid');
            
            // Show status
            modelStatus.textContent = \`\${models.length} model(s) available\`;
            modelStatus.className = 'status-message show success';
        }
        
        function hideModelSelector() {
            const modelGroup = document.getElementById('model-selector-group');
            const modelSelect = document.getElementById('input-geminiModel');
            modelGroup.style.display = 'none';
            modelSelect.innerHTML = '<option value="">Verify API key first</option>';
            modelSelect.classList.remove('valid');
        }

        async function verifyKey(keyType) {
            const input = document.getElementById('input-' + keyType);
            const btn = document.querySelector('.verify-btn[data-key="' + keyType + '"]');
            const status = document.getElementById('status-' + keyType);
            const apiKey = input.value.trim();

            if (!apiKey) {
                status.textContent = 'Please enter an API key first.';
                status.className = 'status-message show error';
                input.classList.remove('valid');
                input.classList.add('invalid');
                return;
            }

            // Set loading state
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner"></span>Verifying';
            btn.className = 'verify-btn verifying';
            status.className = 'status-message';
            input.classList.remove('valid', 'invalid');

            // Verify based on key type
            let result;
            if (keyType === 'tmdbApiKey') {
                result = await verifyTmdbKey(apiKey);
            } else if (keyType === 'geminiApiKey') {
                result = await verifyGeminiKey(apiKey);
            } else {
                result = { valid: false, message: 'Unknown key type' };
            }

            // Update UI
            btn.disabled = false;
            if (result.valid) {
                btn.textContent = '✓ Valid';
                btn.className = 'verify-btn success';
                status.textContent = result.message;
                status.className = 'status-message show success';
                input.classList.add('valid');
                
                // Show model selector for Gemini
                if (keyType === 'geminiApiKey' && result.models) {
                    showModelSelector(result.models);
                }
            } else {
                btn.textContent = '✗ Invalid';
                btn.className = 'verify-btn error';
                status.textContent = result.message;
                status.className = 'status-message show error';
                input.classList.add('invalid');
                
                // Hide model selector if Gemini key is invalid
                if (keyType === 'geminiApiKey') {
                    hideModelSelector();
                }
            }

            // Reset button after 3 seconds
            setTimeout(() => {
                btn.textContent = 'Verify';
                btn.className = 'verify-btn';
            }, 3000);
        }

        // Reset status when input changes
        document.querySelectorAll('.form-group input').forEach(input => {
            input.addEventListener('input', function() {
                const key = this.name;
                const btn = document.querySelector('.verify-btn[data-key="' + key + '"]');
                const status = document.getElementById('status-' + key);
                
                this.classList.remove('valid', 'invalid');
                if (btn) {
                    btn.textContent = 'Verify';
                    btn.className = 'verify-btn';
                }
                if (status) {
                    status.className = 'status-message';
                }
                
                // Hide model selector when Gemini API key changes
                if (key === 'geminiApiKey') {
                    hideModelSelector();
                }
            });
        });

        // Slider value update
        const slider = document.getElementById('input-maxResults');
        const sliderValue = document.getElementById('slider-value');
        
        slider.addEventListener('input', function() {
            sliderValue.textContent = this.value;
        });
        
        // Content type toggle
        function setContentType(value) {
            document.getElementById('input-contentTypeFilter').value = value;
            document.querySelectorAll('.toggle-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.value === value);
            });
        }
        window.setContentType = setContentType;

        document.getElementById('configForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const config = {};
            
            formData.forEach((value, key) => {
                if (value) config[key] = value;
            });

            // Check if both keys are provided (required for AI-only addon)
            if (!config.tmdbApiKey || !config.geminiApiKey) {
                alert('Both TMDB and Gemini API keys are required for this addon.');
                return;
            }
            
            // Check if model is selected
            if (!config.geminiModel) {
                alert('Please verify your Gemini API key and select a model.');
                return;
            }
            
            config.baseUrl = window.location.origin;
            
            const configStr = encodeURIComponent(JSON.stringify(config));
            const manifestUrl = window.location.origin + '/' + configStr + '/manifest.json';
            
            window.location.href = 'stremio://' + manifestUrl.replace(/^https?:\\/\\//, '');
        });
    </script>
</body>
</html>`;
}

module.exports = { getConfigurePage };
