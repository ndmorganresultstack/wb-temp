// lib/appInsights.ts
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

const reactPlugin = new ReactPlugin();
const appInsightsClient = new ApplicationInsights({
  config: {
    connectionString: process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING,
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
    samplingPercentage: 100,
  },
});

let appInsightsServer: ApplicationInsights | null = null;
let isServerInitialized = false; // Track server initialization

if (typeof window === 'undefined' && process.env.APPINSIGHTS_CONNECTION_STRING && process.env.NEXT_BUILD !== 'true') {
  appInsightsServer = new ApplicationInsights({
    config: {
      connectionString: process.env.APPINSIGHTS_CONNECTION_STRING,
      samplingPercentage: 100,
    },
  });
}

export function initializeAppInsights() {
  if (process.env.NEXT_BUILD === 'true') {
    console.log('Skipping Application Insights initialization during Next.js build');
    return;
  }
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING) {
    appInsightsClient.loadAppInsights();
    appInsightsClient.trackPageView();
    console.log('Initialized Application Insights (client-side)');
  } else if (typeof window === 'undefined' && process.env.APPINSIGHTS_CONNECTION_STRING && !isServerInitialized) {
    appInsightsServer?.loadAppInsights();
    appInsightsServer?.trackPageView();
    isServerInitialized = true; // Prevent reinitialization
    console.log('Initialized Application Insights (server-side)');
  } else if (!process.env.APPINSIGHTS_CONNECTION_STRING && !process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING) {
    console.warn('Application Insights connection string not found');
  }
}

export function trackException(error: Error, customProperties?: { [key: string]: string | number }) {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING) {
    appInsightsClient.trackException({ exception: error, properties: customProperties });
  } else if (typeof window === 'undefined' && process.env.APPINSIGHTS_CONNECTION_STRING && process.env.NEXT_BUILD !== 'true') {
    appInsightsServer?.trackException({ exception: error, properties: customProperties });
  }
}

export function trackTrace(message: string, customProperties?: { [key: string]: string | number }) {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING) {
    appInsightsClient.trackTrace({ message, properties: customProperties });
  } else if (typeof window === 'undefined' && process.env.APPINSIGHTS_CONNECTION_STRING && process.env.NEXT_BUILD !== 'true') {
    appInsightsServer?.trackTrace({ message, properties: customProperties });
  }
}

export { reactPlugin };