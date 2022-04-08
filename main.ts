const BUTTON_LONG_CLICK = 4;
const MAX_ALLOWED_MINUTES = 25;
const MAX_STEP = 5
const MIN_STEP = 1
const EVENT_TIMER_SOURCE = 90000;

enum TimerState {
    stopped,
    started,
    paused
}

let _enableSound = true;
let _elapsed = 0
let _listY : number[] = []
let _listX : number[] = []

let _timerState: TimerState = TimerState.stopped; 
let _minuteStep = 5

let _minutes = 10
let _remainingMinutes = _minutes

initList()
reset()

control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_AB, BUTTON_LONG_CLICK, () => {    
    _enableSound = !_enableSound
    basic.showNumber(+_enableSound);
    playMelody(Melodies.JumpUp);
    blinkLeds(3)
    renderScreen()
})

control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_B, BUTTON_LONG_CLICK, stopTimer)

input.onButtonPressed(Button.AB, endTimer)
input.onButtonPressed(Button.B, toggleTimer)

control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, BUTTON_LONG_CLICK, () => {
    let plotOnY = 2;

    _minuteStep = _minuteStep == MAX_STEP ? MIN_STEP : MAX_STEP;

    basic.clearScreen()

    if (_minuteStep == MAX_STEP) {
        for (let x = 0; x <= _minuteStep - 1; x++) {
            led.plot(x, plotOnY)
        }
    } else {
        led.plot(plotOnY, plotOnY)
    }

    blinkLeds(3)

    renderScreen();
})

input.onButtonPressed(Button.A, () => {
 
    if (_timerState == TimerState.stopped) {
        
        if (_minutes >= MAX_ALLOWED_MINUTES) {
            _minutes = _minuteStep;
        } else {
            // add remainer if step is 5 and modulus is not 0
            _minutes += _minutes % 5 > 0 && _minuteStep == MAX_STEP ? 5 - (_minutes % 5) : _minuteStep;            
        }

        _remainingMinutes = _minutes
        renderScreen()
    }
})

function initList() {
    for (let y = 0; y < MAX_STEP; y++) {
        for (let x = 0; x < MAX_STEP; x++) {
            _listX.push(x)
            _listY.push(y)
        }
    }
}

function reset() {
    basic.clearScreen()
    setDefaultValues()
    renderScreen()
}

function stopTimer() {
    if (_timerState != TimerState.stopped) {
        _timerState = TimerState.stopped
        basic.clearScreen()
            basic.showLeds(`
                . . . . .
                . # # # .
                . # . # .
                . # # # .
                . . . . .
            `)
        blinkLeds()
        reset()
    }
}

function blinkLeds(times: number = 3, msout: number = 300, msin: number = 500) {
    for (let index = 0; index <= times; index++) {
        led.fadeOut(msout)
        led.fadeIn(msin)
    }
}
function pauseTimer() {
    // control.raiseEvent(EVENT_TIMER_SOURCE, TimerState.paused) ;
    _timerState = TimerState.paused
    playMelody(Melodies.Funk)
}

function startTimer() {    
    renderScreen()
    _timerState = TimerState.started
    playMelody(Melodies.PowerUp)
}

function playMelody(melody: Melodies) {
    if (_enableSound) {
        music.startMelody(music.builtInMelody(melody), MelodyOptions.OnceInBackground)
    }
}

function playSound(frequency: number) {
    if (_enableSound) {
        music.playTone(frequency, music.beat(BeatFraction.Sixteenth))
    }
}

function toggleTimer() {
    led.fadeIn()
    if (_timerState != TimerState.started) {
        startTimer()
    } else {
        pauseTimer()
    }
}

function endTimer() {
    
    _timerState = TimerState.stopped
    playMelody(Melodies.Wawawawaa)
    basic.showIcon(IconNames.No)
    
    blinkLeds(5)
    reset()
}

function setDefaultValues() {
    
    _timerState = TimerState.stopped
    _remainingMinutes = _minutes
}

function renderScreen() {
    basic.clearScreen()
    let x = 0
    let y = 0
    let minIdx = _remainingMinutes - 1
    for (let index = 0; index < _remainingMinutes; index++) {
        x = _listX[index]
        y = _listY[index]
        led.plot(x, y)
    }
}

loops.everyInterval(1000, () => {
    let x: number;
    let y: number;
    
    if (_timerState == TimerState.started) {
        _elapsed = _elapsed + 1
        x = _listX[_remainingMinutes - 1]
        y = _listY[_remainingMinutes - 1]
        led.toggle(x, y)
        if (_elapsed == 60) {
            _elapsed = 0
            _remainingMinutes = _remainingMinutes - 1
            renderScreen()
            playSound(131);
        }
        
        if (_remainingMinutes <= 0) {            
            endTimer()
        }
        
    }
    
    if (_timerState == TimerState.paused) {
        led.fadeOut(100)
        basic.showLeds(`
            . . . . .
            . # . # .
            . # . # .
            . # . # .
            . . . . .
        `)
        led.fadeIn(300)
    }
    
})
