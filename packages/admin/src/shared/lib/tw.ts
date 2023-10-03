class Tw {
  constructor(private classes: string | undefined) {
    this.tw(classes);
  }

  get s() {
    return this.classes;
  }

  tw(...classes: any[]) {
    this.classes += " " + classes.filter(Boolean).join(" ");
    return this;
  }

  if(condition: boolean, classes: any, elseClasses?: any) {
    if (condition) {
      this.tw(classes);
    } else if (elseClasses) {
      this.tw(elseClasses);
    }
    return this;
  }

  sw(ojb: Record<any, boolean>) {
    Object.entries(ojb).forEach(([key, value]) => {
      if (value) {
        this.tw(key);
      }
    });
    return this;
  }
}

export default function tw(...classes: any[]) {
  return new Tw(classes.join(" "));
}
