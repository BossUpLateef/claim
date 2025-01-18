import dynamic from 'next/dynamic';

const ClientFeedbackHistory = dynamic(
  () => import('./ClientFeedbackHistory').then(mod => mod.ClientFeedbackHistory),
  { ssr: false }
);

export function FeedbackHistory() {
  return <ClientFeedbackHistory />;
} 