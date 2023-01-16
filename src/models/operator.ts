import { Socket } from 'socket.io';

export type Operator = {
  screenName: string;
  socket?: Socket;
}
