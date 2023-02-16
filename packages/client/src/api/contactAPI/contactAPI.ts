import { API_ENDPOINTS } from '../../config/constants';
import { HTTP } from '../../utils/HTTP';
import { type SendRequestData, type SendToSlackRequestData } from './typings';

export const contactAPI = {
  send: (data: SendRequestData) => HTTP.post<void>(API_ENDPOINTS.CONTACT.SEND, { data }),

  sendToSlack: (data: SendToSlackRequestData) => {
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
