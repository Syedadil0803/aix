// Finx Analytics SDK
class FinxAnalytics {
  constructor(config) {
    this.writeKey = config.writeKey;
    this.dataplaneUrl = config.dataplaneUrl;
    this.sessionId = this.generateSessionId();
    this.anonymousId = this.getOrCreateAnonymousId(); // Only anonymous ID
    this.clientId = "68d2453d19834411cbcdb035";
  }

  generateSessionId() {
    return (
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    );
  }

  getOrCreateAnonymousId() {
    let anonymousId = localStorage.getItem("finx_anonymous_id");
    if (!anonymousId) {
      anonymousId =
        "anonymous_" +
        Math.random().toString(36).substr(2, 9) +
        "_" +
        Date.now();
      localStorage.setItem("finx_anonymous_id", anonymousId);
    }
    return anonymousId;
  }

  async trackEvent(eventName, properties = {}) {
    const event = {
      event: eventName,
      anonymousId: this.anonymousId, // Only anonymous ID
      properties: {
        ...properties,
        client_id: this.clientId,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
      context: {
        library: {
          name: "finx-analytics-sdk",
          version: "1.0.0",
        },
      },
    };

    try {
      const response = await fetch(`${this.dataplaneUrl}/v1/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(this.writeKey + ":")}`,
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        console.error(
          "Analytics tracking failed:",
          response.status,
          response.statusText
        );
      } else {
        console.log("Event tracked successfully:", eventName, properties);
      }
    } catch (error) {
      console.error("Analytics tracking error:", error);
    }
  }

  identify(userId, traits = {}) {
    const identifyEvent = {
      type: "identify",
      userId: userId,
      anonymousId: this.anonymousId, // Include anonymous ID in identify too
      traits: traits,
      timestamp: new Date().toISOString(),
      context: {
        library: {
          name: "finx-analytics-sdk",
          version: "1.0.0",
        },
      },
    };

    fetch(`${this.dataplaneUrl}/v1/identify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(this.writeKey + ":")}`,
      },
      body: JSON.stringify(identifyEvent),
    }).catch((error) => {
      console.error("Analytics identify error:", error);
    });
  }
}

// Global functions for backward compatibility
let analyticsInstance = null;

function initAnalytics(config) {
  analyticsInstance = new FinxAnalytics(config);
  console.log("Analytics initialized with config:", config);
}

function trackEvent(eventName, properties = {}) {
  if (!analyticsInstance) {
    console.error("Analytics not initialized. Call initAnalytics() first.");
    return;
  }
  analyticsInstance.trackEvent(eventName, properties);
}

function identify(userId, traits = {}) {
  if (!analyticsInstance) {
    console.error("Analytics not initialized. Call initAnalytics() first.");
    return;
  }
  analyticsInstance.identify(userId, traits);
}

// Make functions globally available
window.initAnalytics = initAnalytics;
window.trackEvent = trackEvent;
window.identify = identify;
