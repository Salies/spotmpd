/*
module based (tbh almost entirely cloned) from this excellent StackOverflow answer:
https://stackoverflow.com/questions/24724852/pause-and-resume-setinterval/24725066
*/

function IntervalTimer(callback, interval) {
    let timerId, startTime, remaining = 0, state = 0;

    this.pause = function () {
        if (state != 1) return;

        remaining = interval - (new Date() - startTime);
        clearInterval(timerId);
        state = 2;
    };

    this.resume = function () {
        if (state != 2) return;

        state = 3;
        setTimeout(this.timeoutCallback, remaining);
    };

    this.timeoutCallback = function () {
        if (state != 3) return;

        callback();

        startTime = new Date();
        timerId = setInterval(callback, interval);
        state = 1;
    };

    this.start = function(){
        if (state !== 0){
            return
        }else{
            state = 2;
            this.resume();
        }

        startTime = new Date();
        timerId = setInterval(callback, interval);
        state = 1;
    }

    this.restart = function(){
        if(state !== 0){
            clearInterval(timerId);
            remaining = 0;
            state = 0;
        }
        
        this.start();
    }
}

module.exports = IntervalTimer;