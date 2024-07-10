export type BaseMessage<T = unknown> = {
  type: string;
  data?: T;
};

export type ModifyType<T, R> = Omit<T, keyof R> & R;