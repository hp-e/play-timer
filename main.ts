const BUTTON_LONG_CLICK = 4;
const BUTTON_DOUBLE_CLICK = 6;
const MAX_ALLOWED_MINUTES = 25;
const MAX_STEP = 5
const MIN_STEP = 1

enum TimerState {
    stopped,
    started,
    paused
}

let _elapsed = 0
let _listY : number[] = []
let _listX : number[] = []

let _timerState: TimerState = TimerState.stopped; 
let _minuteStep = 5

let _minutes = 10
let _remainingMinutes = _minutes

initList()
reset()

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
            // add reminder if step is 5 and modulus is not 0
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

function blinkLeds(times: number = 3, msout: number = 300, msin: number = 500) {
    for (let index = 0; index <= times; index++) {
        led.fadeOut(msout)
        led.fadeIn(msin)
    }
}
function pauseTimer() {
    
    _timerState = TimerState.paused
    music.startMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.OnceInBackground)
}

function startTimer() {
    
    renderScreen()
    _timerState = TimerState.started
    music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.OnceInBackground)
}

function onTimerEnd() {
    
    _timerState = TimerState.stopped
    music.startMelody(music.builtInMelody(Melodies.Wawawawaa), MelodyOptions.OnceInBackground)
    basic.showIcon(IconNames.No)
    
    blinkLeds(5)

    reset()
}

input.onButtonPressed(Button.AB, () => {
    if (_timerState != TimerState.stopped) {
        stopTimer()
    }
    
})
input.onButtonPressed(Button.B, () => {
    
    led.fadeIn()
    if (_timerState != TimerState.started) {
        startTimer()
    } else {
        pauseTimer()
    }
    
})
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
            music.playTone(131, music.beat(BeatFraction.Sixteenth))
        }
        
        if (_remainingMinutes <= 0) {
            _timerState = TimerState.stopped
            onTimerEnd()
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
