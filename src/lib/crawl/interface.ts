export interface Resp {
  ok: boolean;
  content?: Response;
  error?: Error;
}

export interface URLsObj {
  [key: string]: number;
}
