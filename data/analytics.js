// Implementation of the Analytics Module to initialize the Google Tag and track user command events.

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-YMYV8Y1KFB');
function trackEvent(category, action, label = null) {
    gtag('event', action, {'event_category': category,'event_label': label});
}