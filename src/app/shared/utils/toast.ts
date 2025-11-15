import { MessageService } from 'primeng/api';

export function toastMessage(
  messageService: MessageService,
  message: {
    severity: string;
    summary: string;
    detail: string;
    life: number;
  }
) {
  messageService.add({
    severity: message.severity,
    summary: message.summary,
    detail: message.detail,
    life: message.life,
  });
}
