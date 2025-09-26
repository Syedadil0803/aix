// Finx Analytics SDK
class FinxAnalytics {
  constructor(config) {
    this.writeKey = config.writeKey;
    this.dataplaneUrl = config.dataplaneUrl;
    this.sessionId = this.generateSessionId();
    this.userId = this.getOrCreateUserId();
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getOrCreateUserId() {
    let userId = localStorage.getItem('finx_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('finx_user_id', userId);
    }
    return userId;
  }

  async trackEvent(eventName, properties = {}) {
    const event = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        userId: this.userId,
        url: window.location.href,
        userAgent: navigator.userAgent
      },
      context: {
        library: {
          name: 'finx-analytics-sdk',
          version: '1.0.0'
        }
      }
    };

    try {
      const response = await fetch(`${this.dataplaneUrl}/v1/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(this.writeKey + ':')}`
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        console.error('Analytics tracking failed:', response.status, response.statusText);
      } else {
        console.log('Event tracked successfully:', eventName, properties);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  identify(userId, traits = {}) {
    const identifyEvent = {
      type: 'identify',
      userId: userId,
      traits: traits,
      timestamp: new Date().toISOString(),
      context: {
        library: {
          name: 'finx-analytics-sdk',
          version: '1.0.0'
        }
      }
    };

    fetch(`${this.dataplaneUrl}/v1/identify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(this.writeKey + ':')}`
      },
      body: JSON.stringify(identifyEvent)
    }).catch(error => {
      console.error('Analytics identify error:', error);
    });
  }
}

// Global functions for backward compatibility
let analyticsInstance = null;

function initAnalytics(config) {
  analyticsInstance = new FinxAnalytics(config);
  console.log('Analytics initialized with config:', config);
}

function trackEvent(eventName, properties = {}) {
  if (!analyticsInstance) {
    console.error('Analytics not initialized. Call initAnalytics() first.');
    return;
  }
  analyticsInstance.trackEvent(eventName, properties);
}

function identify(userId, traits = {}) {
  if (!analyticsInstance) {
    console.error('Analytics not initialized. Call initAnalytics() first.');
    return;
  }
  analyticsInstance.identify(userId, traits);
}

// Make functions globally available
window.initAnalytics = initAnalytics;
window.trackEvent = trackEvent;
window.identify = identify;
