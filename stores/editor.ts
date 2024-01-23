import { action, makeObservable, observable } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";

enableStaticRendering(typeof window === "undefined");

export class App {
  constructor() {
    makeObservable(this, {});
  }
}
