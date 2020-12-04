import * as frames from './frames'

export default class LLFan {
    eventStack:{ r: number[]; g: number[]; b: number[]; }[]
    framePointer: number
    frameRate: number
    changed: boolean
    intervalTimer:NodeJS.Timeout
    constructor() {
        this.eventStack = [];

        this.framePointer = 0;
        this.frameRate    = 1;

        this.changed = true;
        this.intervalTimer = null;
    }

    nextFrame() {
        if (this.eventStack.length == 1)
            return;

        if ((this.framePointer+1) == this.eventStack.length) {
            this.framePointer = 0;

            this.changed = true;
        }
        else {
            this.framePointer++;

            this.changed = true;
        }
    }

    setFramerate(fps) {
        this.frameRate = fps;

        if (this.intervalTimer) {
            clearInterval(this.intervalTimer);
        }

        this.intervalTimer = setInterval(() => {
            this.nextFrame();
        }, Math.floor((1/fps)*1000));
    }

    getFrame() {
        if (this.eventStack.length == 0)
            return frames.blankFrame();

        if (this.framePointer >= this.eventStack.length) {
            this.framePointer = 0;
        }


        if (this.changed)
            this.changed = false;

        return this.eventStack[this.framePointer];
    }

    turnOff() {
        this.framePointer = 0;
        this.eventStack   = [frames.blankFrame()];
    }

};