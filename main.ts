music.startMelody(music.builtInMelody(Melodies.Baddy), MelodyOptions.OnceInBackground)
let timer_started = 1
let timer_stopped = 0
let timer_paused = 2
let timer_state = timer_stopped
let remaining_minutes = 0
let minute_step = 5
let minutes = 10
let listX : number[] = []
let listY : number[] = []
let sound : number[] = []
let elapsed = 0
let presses = 1
initList()
reset()
sound = [131, 165, 196, 262, 294]
//  if minutes == 25:
//      minutes = minute_step
//      tone = 131
//  else:
//      tone = tone + 34
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    let tone = 131
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
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    //  led.fade_in()
    if (timer_state != timer_stopped) {
        stop_timer()
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    led.fadeIn()
    if (timer_state != timer_started) {
        render_screen()
        timer_state = timer_started
        music.startMelody(music.builtInMelody(Melodies.PowerUp), MelodyOptions.OnceInBackground)
    } else {
        timer_state = timer_paused
        music.startMelody(music.builtInMelody(Melodies.Funk), MelodyOptions.OnceInBackground)
    }
    
})
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
            music.playTone(131, music.beat(BeatFraction.Half))
        }
        
        if (remaining_minutes <= 0) {
            timer_state = timer_stopped
            on_timer_end()
        }
        
    }
    
    if (timer_state == timer_paused) {
        led.fadeOut(100)
        pause_timer()
        led.fadeIn(300)
    }
    
})
function on_timer_end() {
    
    timer_state = timer_stopped
    led.fadeOut()
    basic.showIcon(IconNames.No)
    led.fadeIn()
    music.startMelody(music.builtInMelody(Melodies.Wawawawaa), MelodyOptions.OnceInBackground)
    for (let x2 = 0; x2 < 5; x2++) {
        led.fadeOut()
        basic.pause(500)
        led.fadeIn()
    }
    reset()
}

function stop_timer() {
    
    timer_state = timer_stopped
    basic.clearScreen()
    for (let x3 = 0; x3 < 3; x3++) {
        led.fadeOut()
        basic.showLeds(`
            . . . . .
                                . # # # .
                                . # . # .
                                . # # # .
                                . . . . .
        `)
        basic.pause(500)
        led.fadeIn()
    }
    reset()
}

function pause_timer() {
    basic.showLeds(`
        . . . . .
                                . # . # .
                                . # . # .
                                . # . # .
                                . . . . .
    `)
}

function set_default_values() {
    
    timer_state = timer_stopped
    remaining_minutes = minutes
}

function render_screen() {
    basic.clearScreen()
    let x4 = 0
    let y2 = 0
    let minIdx = remaining_minutes - 1
    for (let index = 0; index < remaining_minutes; index++) {
        x4 = listX[index]
        y2 = listY[index]
        led.plot(x4, y2)
    }
}

function reset() {
    basic.clearScreen()
    set_default_values()
    render_screen()
}

function initList() {
    for (let y3 = 0; y3 < 5; y3++) {
        for (let x5 = 0; x5 < 5; x5++) {
            listX.push(x5)
            listY.push(y3)
        }
    }
}

