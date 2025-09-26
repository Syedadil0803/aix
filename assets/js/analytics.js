(function() {
  const CONFIG = {
    writeKey: "33E0iVy6zroU31pZLHEGFXa0Sfe", // unique to this client
    dataplaneUrl: "https://aairavxhrwapyh.dataplane.rudderstack.com"
  };

  initAnalytics(CONFIG);

  // Track page load
  trackEvent("page_viewed", {
    page: window.location.pathname,
    device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop"
  });

  // Track clicks
  document.addEventListener("click", (e) => {
    if (e.target.dataset.clickTrack) {
      trackEvent(e.target.dataset.clickTrack, {
        cta_name: e.target.dataset.ctaName || "unknown",
        page: window.location.pathname,
        device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop"
      });
    }
  });

  // Track hovers with 5-second cooldown between API calls
  let lastHoverApiCall = 0;
  const HOVER_COOLDOWN = 5000; // 5 seconds in milliseconds
  
  document.addEventListener("mouseover", (e) => {
    if (e.target.dataset.hoverTrack) {
      const now = Date.now();
      
      // Check if 5 seconds have passed since last hover API call
      if (now - lastHoverApiCall >= HOVER_COOLDOWN) {
        trackEvent(e.target.dataset.hoverTrack, {
          cta_name: e.target.dataset.ctaName || "unknown",
          page: window.location.pathname,
          device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop"
        });
        lastHoverApiCall = now;
      }
    }
  });
})();
