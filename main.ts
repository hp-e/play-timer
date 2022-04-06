let elapsed = 0
let listY : number[] = []
let listX : number[] = []
let sound : number[] = []
let timer_stopped = 0
let timer_started = 1
let timer_paused = 2
let timer_state = timer_stopped
let minute_step = 5
let minutes = 10
let remaining_minutes = minutes
let presses = 1
initList()
reset()
sound = [131, 165, 196, 262, 294]
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (timer_state == timer_stopped) {
        if (presses == 4) {
            presses = 0
            minutes = minute_step
        } else {
            presses = presses + 1
            minutes = minutes + minute_step
        }
        
        remaining_minutes = minutes
        render_screen()
        music.playTone(sound[presses], music.beat(BeatFraction.Half))
    }
    
})
function initList() {
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            listX.push(x)
            listY.push(y)
        }
    }
}

function reset() {
    basic.clearScreen()
    set_default_values()
    render_screen()
}

function stop_timer() {
    
    timer_state = timer_stopped
    basic.clearScreen()
    for (let index = 0; index < 3; index++) {
        led.fadeOut(200)
        basic.showLeds(`
            . . . . .
            . # # # .
            . # . # .
            . # # # .
            . . . . .
        `)
        led.fadeIn(300)
    }
    reset()
}

function pause_timer() {
    
    timer_state = timer_paused
    music.startMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.OnceInBackground)
}

function start_timer() {
    
    render_screen()
    timer_state = timer_started
    music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.OnceInBackground)
}

function on_timer_end() {
    
    timer_state = timer_stopped
    music.startMelody(music.builtInMelody(Melodies.Dadadadum), MelodyOptions.OnceInBackground)
    for (let index = 0; index < 5; index++) {
        led.fadeOut(200)
        basic.showIcon(IconNames.No)
        led.fadeIn(300)
    }
    reset()
}

input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    if (timer_state != timer_stopped) {
        stop_timer()
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    led.fadeIn()
    if (timer_state != timer_started) {
        start_timer()
    } else {
        pause_timer()
    }
    
})
function set_default_values() {
    
    timer_state = timer_stopped
    remaining_minutes = minutes
}

function render_screen() {
    basic.clearScreen()
    let x = 0
    let y = 0
    let minIdx = remaining_minutes - 1
    for (let index = 0; index < remaining_minutes; index++) {
        x = listX[index]
        y = listY[index]
        led.plot(x, y)
    }
}

loops.everyInterval(1000, function on_every_interval() {
    let x: number;
    let y: number;
    
    if (timer_state == timer_started) {
        elapsed = elapsed + 1
        x = listX[remaining_minutes - 1]
        y = listY[remaining_minutes - 1]
        led.toggle(x, y)
        if (elapsed == 60) {
            elapsed = 0
            remaining_minutes = remaining_minutes - 1
            render_screen()
            music.playTone(131, music.beat(BeatFraction.Sixteenth))
        }
        
        if (remaining_minutes <= 0) {
            timer_state = timer_stopped
            on_timer_end()
        }
        
    }
    
    if (timer_state == timer_paused) {
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
