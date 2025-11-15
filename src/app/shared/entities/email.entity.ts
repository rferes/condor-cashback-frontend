export type SendEmailVerifyResponse = {
  email: string;
};

export type EmailCodeCheckVerifyResponse = {
  email: string;
  attempts: string;
  code: string;
};
// export type SendEmailVerifyResponseComponentEntity = {
//   email: string;
// };

// export type CheckEmailVerifyRequestComponentEntity = {
//   email: string;
//   code: string;
// };

// export type CheckEmailVerifyResponseComponentEntity = {
//   email: string;
// };
