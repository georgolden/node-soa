interface EventHandler {
  (event: object): any;
}
interface Consumer {}
interface ConsumerGroup {
  consumers: Consumer[];
}

export interface Bus {
  // PubSub
  subscribe(eventName: string, handler: EventHandler): boolean;
  publish(eventName: string, event: object): boolean;

  // // Event Streams
  // writeStream(streamKey: string, events: object[]): boolean;
  // readStream(streamKey: string): object[];

  // // Consumer Groups
  // createConsumerGroup(groupKey: string): ConsumerGroup;
  // readInGroup(
  //   groupKey: string,
  //   streamKey: string,
  //   consumerId?: string,
  // ): Promise<object[]>;

  // Command to another service or remote call
  command(commandName: string, payload: object): Promise<object>;
}
