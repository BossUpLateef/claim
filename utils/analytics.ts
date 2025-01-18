export const analytics = {
  track: (eventName: string, data: any) => {
    // Integration with your analytics service
    console.log('Analytics Event:', eventName, data);
    // You can replace this with actual analytics integration
    // Example: mixpanel.track(eventName, data);
  }
};

export const trackRebuttalGeneration = (rebuttalData: any) => {
  analytics.track('Rebuttal Generated', {
    state: rebuttalData.state,
    carrier: rebuttalData.carrier,
    deniedItem: rebuttalData.deniedItem,
    timestamp: new Date().toISOString()
  });
}; 