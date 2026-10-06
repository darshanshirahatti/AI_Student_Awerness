document.addEventListener('DOMContentLoaded', async () => {
    const status = document.getElementById('dashboardStatus');
    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    try {
        const response = await getDashboard();
        const data = response.data;
        if (!data) throw new Error('Dashboard data is unavailable.');

        const awarenessScore = data.awarenessScore;
        const averageScore = data.averageScore;
        const lessons = Number(data.lessonsCompleted) || 0;
        const totalLessons = Number(data.totalLessons) || 6;
        const attempts = Number(data.quizAttempts) || 0;

        setText('welcomeHeading', `Welcome back, ${data.user?.name || window.AISaksharaAuth?.getUser()?.name || 'Student'}!`);
        setText('awarenessScore', awarenessScore === null ? '--' : `${awarenessScore}/100`);
        setText('awarenessLevel', data.awarenessLevel || 'NOT STARTED');
        setText('awarenessCardLevel', awarenessScore === null ? 'Start your first quiz' : data.awarenessLevel);
        setText('awarenessCardScore', awarenessScore === null ? '--' : awarenessScore);
        setText('lessonsCompleted', lessons);
        setText('totalLessons', totalLessons);
        setText('averageScore', averageScore === null ? '--' : `${averageScore}%`);
        setText('quizAttempts', attempts === 1 ? '1 quiz attempt' : `${attempts} quiz attempts`);
        setText('safetyScore', data.safetyScore === null || data.safetyScore === undefined ? 'Not tracked' : `${data.safetyScore}%`);
        setText('journeyCount', `${lessons} / ${totalLessons} lessons`);

        const progress = document.getElementById('journeyProgress');
        if (progress) progress.style.width = `${Math.min(100, Math.round((lessons / totalLessons) * 100))}%`;

        const recommendation = document.getElementById('awarenessRecommendation');
        if (recommendation) {
            recommendation.textContent = awarenessScore === null
                ? 'Take the AI Awareness Quiz to get a personalized learning snapshot.'
                : awarenessScore >= 80
                    ? 'You have a strong foundation. Explore AI technologies and responsible AI use next.'
                    : awarenessScore >= 50
                        ? 'You are building a solid foundation. Continue with AI technologies and safety.'
                        : 'Start with AI Basics, then try the quiz again to track your progress.';
        }

        const activity = document.getElementById('recentActivity');
        if (activity) {
            activity.replaceChildren();
            if (!data.recentActivity?.length) {
                const empty = document.createElement('li');
                empty.className = 'empty-activity';
                empty.textContent = 'Your quiz results will appear here after your first attempt.';
                activity.append(empty);
            } else {
                data.recentActivity.forEach((item) => {
                    const row = document.createElement('li');
                    const title = document.createElement('span');
                    title.textContent = 'AI Awareness Quiz';
                    const score = document.createElement('strong');
                    score.textContent = `${item.score}%`;
                    const date = document.createElement('time');
                    const completedAt = new Date(item.date);
                    date.dateTime = completedAt.toISOString();
                    date.textContent = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(completedAt);
                    row.append(title, score, date);
                    activity.append(row);
                });
            }
        }
        status.textContent = '';
        status.hidden = true;
    } catch (error) {
        status.textContent = 'Unable to load your progress right now. Please try again later.';
        status.classList.add('dashboard-error');
    }
});
