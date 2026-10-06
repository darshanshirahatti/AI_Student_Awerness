if (window.AISaksharaAuth?.getToken()) {
    window.location.replace(`assistant.html?appReload=${Date.now()}`);
} else {
    window.location.replace(`login.html?fresh=${Date.now()}`);
}
