import { API_ENDPOINTS } from '../../config/constants';
import { HTTP } from '../../utils/HTTP';

export type SendRequestData = {
  name: string;
  email: string;
  message: string;
};

export type SendToSlackRequestData = {
  text: string;
};

export const contactAPI = {
  send: (data: SendRequestData) => HTTP.post<void>(API_ENDPOINTS.CONTACT.SEND, { data }),

  sentToSlack: (data: SendToSlackRequestData) => {
    try {
      const slackWebhookUrl = new URL(__SLACK_FEEDBACK_WEBHOOK_URL__);
      return HTTP.post<void>(slackWebhookUrl.pathname, {
        baseUrl: slackWebhookUrl.origin,
        withCredentials: false,
        data: JSON.stringify(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    } catch (error) {
      return Promise.reject('Please define SLACK_FEEDBACK_WEBHOOK_URL variable in .env');
    }
  },
};
