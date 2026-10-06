document.addEventListener('DOMContentLoaded', async () => {
    const status = document.getElementById('progressStatus');
    try {
        const [historyResponse, dashboardResponse, predictionResponse] = await Promise.all([getQuizHistory(), getDashboard(), getPredictionHistory()]);
        const history = (historyResponse.data || []).slice().reverse();
        const predictions = (predictionResponse.data || []).slice().reverse();
        const dashboard = dashboardResponse.data || {};
        const scores = history.map((item) => item.percentage);
        document.getElementById('progressAttempts').textContent = dashboard.quizAttempts || 0;
        document.getElementById('progressBest').textContent = dashboard.bestScore === null ? '--' : `${dashboard.bestScore}%`;
        document.getElementById('progressLessons').textContent = `${dashboard.lessonsCompleted || 0} / ${dashboard.totalLessons || 6}`;
        status.textContent = history.length || predictions.length ? '' : 'Complete a quiz or run a prediction to start building your progress charts.';
        if (status.textContent) status.hidden = false;
        else status.hidden = true;

        if (!window.Chart) return;
        if (history.length) {
            new Chart(document.getElementById('quizChart'), {
                type: 'line',
                data: { labels: history.map((item, index) => `Attempt ${index + 1}`), datasets: [{ label: 'Score (%)', data: scores, borderColor: '#147f75', backgroundColor: 'rgba(20,127,117,.12)', fill: true, tension: .3 }] },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 100 } } }
            });
            new Chart(document.getElementById('activityChart'), {
                type: 'bar',
                data: { labels: history.map((item, index) => `Attempt ${index + 1}`), datasets: [{ label: 'Quiz attempts', data: history.map(() => 1), backgroundColor: '#3e8fb5', borderRadius: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
            });
        }
        if (predictions.length) {
            new Chart(document.getElementById('predictionChart'), {
                type: 'line',
                data: {
                    labels: predictions.map((item) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(item.predictedAt))),
                    datasets: [{ label: 'Awareness score', data: predictions.map((item) => item.score), borderColor: '#5b6fcf', backgroundColor: 'rgba(91,111,207,.12)', fill: true, tension: .3 }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { min: 0, max: 100 } } }
            });
        }
    } catch (error) {
        status.textContent = error.message || 'Unable to load your progress right now. Please try again later.';
    }
});
