interface for service

```ts
type CommandToken = string;
type CommandHanler = (...args: any): any;


interface ServiceExport {
  commnads?: { [key: CommandToken]: CommandHanler };
  eventHanlders?;
}
```
