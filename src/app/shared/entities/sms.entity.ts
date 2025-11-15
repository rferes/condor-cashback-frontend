export type SendSMSCodeVerifyResponse = {
  cellphone: string;
  message: string;
};

export type SMSCodeCheckVerifyResponse = {
  cellphone: string;
  attempts: string;
  code: string;
};
