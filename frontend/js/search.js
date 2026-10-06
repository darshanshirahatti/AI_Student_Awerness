document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('webSearchForm');
    const input = document.getElementById('webSearchInput');
    const provider = document.getElementById('searchProvider');
    const historyList = document.getElementById('searchHistory');
    const status = document.getElementById('searchStatus');
    const historyKey = 'searchHistory';
    const providers = {
        google: 'https://www.google.com/search?q=',
        bing: 'https://www.bing.com/search?q=',
        duckduckgo: 'https://duckduckgo.com/?q='
    };

    const readHistory = () => {
        try {
            const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
            return Array.isArray(history) ? history.filter((item) => typeof item === 'string').slice(0, 10) : [];
        } catch (error) {
            return [];
        }
    };

    const renderHistory = () => {
        const history = readHistory();
        historyList.replaceChildren();
        if (!history.length) {
            const empty = document.createElement('li');
            empty.className = 'search-history-empty';
            empty.textContent = 'Your recent searches will appear here.';
            historyList.append(empty);
            return;
        }
        history.forEach((query) => {
            const item = document.createElement('li');
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'recent-search-item';
            button.textContent = query;
            button.addEventListener('click', () => {
                input.value = query;
                input.focus();
            });
            item.append(button);
            historyList.append(item);
        });
    };

    const performSearch = (query) => {
        const safeQuery = query.trim();
        if (!safeQuery) {
            status.textContent = 'Enter a topic to search.';
            input.focus();
            return;
        }
        const providerUrl = providers[provider.value] || providers.google;
        const searchUrl = `${providerUrl}${encodeURIComponent(safeQuery)}`;
        const history = [safeQuery, ...readHistory().filter((item) => item.toLowerCase() !== safeQuery.toLowerCase())].slice(0, 10);
        localStorage.setItem(historyKey, JSON.stringify(history));
        renderHistory();
        status.textContent = `Opening ${provider.options[provider.selectedIndex].text} results for “${safeQuery}”.`;
        window.open(searchUrl, '_blank', 'noopener,noreferrer');
    };

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');
    if (initialQuery) input.value = initialQuery.slice(0, 300);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        performSearch(input.value);
    });
    document.getElementById('searchSuggestions').addEventListener('click', (event) => {
        const suggestion = event.target.closest('button[data-query]');
        if (!suggestion) return;
        input.value = suggestion.dataset.query;
        input.focus();
    });
    document.getElementById('clearSearchHistory').addEventListener('click', () => {
        localStorage.removeItem(historyKey);
        renderHistory();
        status.textContent = 'Recent search history cleared.';
    });
    renderHistory();
});
